import type { KeyboardEvent, MouseEvent } from "react";
import { observer } from "mobx-react-lite";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LockClockOutlinedIcon from "@mui/icons-material/LockClockOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";

import { getWishIcon } from "../../../constants/wishIcons";
import { useStore, useStoreOrders } from "../../../hooks/useStore";
import type { OrderData } from "../../../types/orders";

const statusStyles = {
  Свободно: { bgcolor: "#E8F7EF", color: "#177447" },
  Забронировано: { bgcolor: "#FFF3D7", color: "#9A6500" },
  Подарено: { bgcolor: "#E8F1FF", color: "#064DB5" },
} as const;

interface OrderCardProps {
  order: OrderData;
  isExpanded: boolean;
  isAnimating: boolean;
  onToggle: () => void;
}

function formatDate(value: string | Date, withTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Дата не указана";

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

function getSourceName(href: string) {
  if (!href) return "";
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "Источник";
  }
}

function stopPropagation(event: MouseEvent) {
  event.stopPropagation();
}

function OrderVisual({
  icon,
  large = false,
  transitionName,
  isAnimating,
}: Pick<OrderData, "icon"> & {
  large?: boolean;
  transitionName: string;
  isAnimating: boolean;
}) {
  const wishIcon = getWishIcon(icon);

  return (
    <Box
      aria-hidden="true"
      sx={{
        viewTransitionName: isAnimating ? transitionName : "none",
        viewTransitionClass: "order-shared",
        display: "grid",
        placeItems: "center",
        width: large ? { xs: 54, sm: 64 } : 54,
        height: large ? { xs: 54, sm: 64 } : 54,
        flexShrink: 0,
        borderRadius: large ? "18px" : "15px",
        bgcolor: "#EDF4FF",
        color: "primary.main",
        fontSize: large ? { xs: 27, sm: 32 } : 27,
      }}
    >
      {wishIcon.symbol}
    </Box>
  );
}

function Author({
  order,
  withDate = false,
  transitionPrefix,
  isAnimating,
}: {
  order: OrderData;
  withDate?: boolean;
  transitionPrefix: string;
  isAnimating: boolean;
}) {
  return (
    <Box
      sx={{
        viewTransitionName: isAnimating
          ? `${transitionPrefix}-author`
          : "none",
        viewTransitionClass: "order-shared",
        display: "flex",
        alignItems: "center",
        gap: 1,
        minWidth: 0,
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: "#E8F1FF",
          color: "primary.main",
          fontSize: 10,
          fontWeight: 800,
        }}
      >
        {getInitials(order.author.name)}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            overflow: "hidden",
            fontSize: 13,
            fontWeight: 650,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {order.author.name} #{order.author.hash}
        </Typography>
        {withDate && (
          <Typography
            sx={{
              viewTransitionName: isAnimating
                ? `${transitionPrefix}-date`
                : "none",
              viewTransitionClass: "order-shared",
              color: "text.secondary",
              fontSize: 12,
            }}
          >
            Создано {formatDate(order.createdAt, true)}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function OrderActions({ order }: { order: OrderData }) {
  const orderStore = useStoreOrders();
  const { userStore } = useStore();
  const currentUser = userStore.currentUser;
  const isAuthor = Boolean(
    currentUser && String(currentUser.id) === String(order.author.id),
  );
  const isReservationOwner = Boolean(
    currentUser &&
      order.reservedBy &&
      String(currentUser.id) === String(order.reservedBy.id),
  );
  const buttonSx = {
    borderRadius: "11px",
    textTransform: "none",
    fontWeight: 650,
  } as const;

  if (isAuthor) {
    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Button
          type="button"
          variant="outlined"
          startIcon={<EditOutlinedIcon />}
          onClick={() => orderStore.editOrder(order.id)}
          sx={buttonSx}
        >
          Редактировать
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlineRoundedIcon />}
          onClick={() => orderStore.deleteOrder(order.id)}
          sx={buttonSx}
        >
          Удалить
        </Button>
      </Box>
    );
  }

  if (order.status === "Свободно") {
    return (
      <Button
        type="button"
        variant="contained"
        disableElevation
        startIcon={<BookmarkAddOutlinedIcon />}
        onClick={() => orderStore.reserveOrder(order.id)}
        sx={buttonSx}
      >
        Забронировать
      </Button>
    );
  }

  if (order.status === "Забронировано" && isReservationOwner) {
    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Button
          type="button"
          variant="outlined"
          startIcon={<RemoveCircleOutlineRoundedIcon />}
          onClick={() => orderStore.cancelOrderReservation(order.id)}
          sx={buttonSx}
        >
          Снять бронь
        </Button>
        <Button
          type="button"
          variant="contained"
          disableElevation
          startIcon={<CardGiftcardRoundedIcon />}
          onClick={() => orderStore.markOrderAsGifted(order.id)}
          sx={buttonSx}
        >
          Подарить
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 1.25,
        color: "text.secondary",
        bgcolor: "#F8FAFC",
        borderRadius: "11px",
      }}
    >
      <LockClockOutlinedIcon sx={{ fontSize: 19 }} />
      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
        {order.status === "Подарено"
          ? "Запись уже отмечена как подаренная"
          : "Эта запись забронирована другим участником"}
      </Typography>
    </Box>
  );
}

const OrderCard = observer(function OrderCard({
  order,
  isExpanded,
  isAnimating,
  onToggle,
}: OrderCardProps) {
  const sourceName = getSourceName(order.href);
  const transitionPrefix = `order-${String(order.id).replace(
    /[^a-zA-Z0-9_-]/g,
    "-",
  )}`;

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!isExpanded && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onToggle();
    }
  }

  return (
    <Box
      component="article"
      role={!isExpanded ? "button" : undefined}
      tabIndex={!isExpanded ? 0 : undefined}
      aria-expanded={isExpanded}
      onClick={!isExpanded ? onToggle : undefined}
      onKeyDown={handleKeyDown}
      sx={{
        viewTransitionName: isAnimating
          ? `${transitionPrefix}-shell`
          : "none",
        viewTransitionClass: "order-shell",
        gridColumn: isExpanded ? "1 / -1" : "auto",
        display: "flex",
        flexDirection: "column",
        minHeight: isExpanded ? "auto" : 235,
        p: { xs: 2.25, sm: 2.5 },
        cursor: isExpanded ? "default" : "pointer",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: isExpanded ? "primary.light" : "#DCE4ED",
        borderRadius: "20px",
        boxShadow: isExpanded ? "0 16px 38px rgba(0,71,171,0.09)" : "none",
        transition:
          "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
        ...(!isExpanded && {
          "&:hover": {
            transform: "translateY(-2px)",
            borderColor: "primary.light",
            boxShadow: "0 12px 24px rgba(15,23,42,0.06)",
          },
          "&:focus-visible": {
            outline: "3px solid",
            outlineColor: "primary.main",
            outlineOffset: 3,
          },
        }),
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&:hover": { transform: "none" },
        },
      }}
    >
      {isExpanded ? (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: { xs: 1.5, sm: 2 },
              pb: 2.5,
              borderBottom: "1px solid #EDF1F5",
            }}
          >
            <OrderVisual
              icon={order.icon}
              large
              transitionName={`${transitionPrefix}-icon`}
              isAnimating={isAnimating}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                component="h3"
                sx={{
                  viewTransitionName: isAnimating
                    ? `${transitionPrefix}-title`
                    : "none",
                  viewTransitionClass: "order-shared",
                  mb: 1,
                  fontSize: { xs: 20, sm: 24 },
                  fontWeight: 700,
                  lineHeight: 1.25,
                }}
              >
                {order.title}
              </Typography>
              <Chip
                label={order.status}
                size="small"
                sx={{
                  viewTransitionName: isAnimating
                    ? `${transitionPrefix}-status-expanded`
                    : "none",
                  viewTransitionClass: "order-status-in",
                  ...statusStyles[order.status],
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
            </Box>
            <Tooltip title="Свернуть">
              <Box
                sx={{
                  viewTransitionName: isAnimating
                    ? `${transitionPrefix}-toggle`
                    : "none",
                  viewTransitionClass: "order-shared",
                }}
              >
                <IconButton
                  type="button"
                  aria-label="Свернуть запись"
                  onClick={onToggle}
                >
                  <CloseFullscreenRoundedIcon />
                </IconButton>
              </Box>
            </Tooltip>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(0, 1.7fr) minmax(260px, 1fr)",
              },
              gap: { xs: 3, md: 4 },
              pt: 2.5,
            }}
          >
            <Box
              sx={{
                viewTransitionName: isAnimating
                  ? `${transitionPrefix}-description`
                  : "none",
                viewTransitionClass: "order-enter-late",
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  mb: 1,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "text.secondary",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Описание
              </Typography>
              <Typography
                sx={{
                  color: order.description ? "text.primary" : "text.secondary",
                  fontSize: 15,
                  lineHeight: 1.75,
                  whiteSpace: "pre-wrap",
                }}
              >
                {order.description || "Автор не добавил описание к этой записи."}
              </Typography>
              <Box sx={{ mt: { xs: 3, md: 4 } }}>
                <Author
                  order={order}
                  withDate
                  transitionPrefix={transitionPrefix}
                  isAnimating={isAnimating}
                />
              </Box>
            </Box>

            <Box
              sx={{
                viewTransitionName: isAnimating
                  ? `${transitionPrefix}-actions`
                  : "none",
                viewTransitionClass: "order-enter-right",
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                minWidth: 0,
                pl: { md: 3 },
                borderLeft: { md: "1px solid #EDF1F5" },
              }}
            >
              <Box>
                <Typography
                  sx={{
                    mb: 1,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Ссылка
                </Typography>
                {order.href ? (
                  <Link
                    href={order.href}
                    target="_blank"
                    rel="noreferrer"
                    underline="hover"
                    onClick={stopPropagation}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      maxWidth: "100%",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sourceName}
                    </Box>
                    <OpenInNewRoundedIcon sx={{ flexShrink: 0, fontSize: 16 }} />
                  </Link>
                ) : (
                  <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                    Ссылка не добавлена
                  </Typography>
                )}
              </Box>
              <Box onClick={stopPropagation} sx={{ mt: "auto" }}>
                <OrderActions order={order} />
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            <OrderVisual
              icon={order.icon}
              transitionName={`${transitionPrefix}-icon`}
              isAnimating={isAnimating}
            />
            <Chip
              label={order.status}
              size="small"
              sx={{
                viewTransitionName: isAnimating
                  ? `${transitionPrefix}-status-compact`
                  : "none",
                viewTransitionClass: "order-status-out",
                ...statusStyles[order.status],
                height: 29,
                borderRadius: "999px",
                fontSize: 12,
                fontWeight: 700,
                "& .MuiChip-label": { px: 1.25 },
              }}
            />
          </Box>
          <Typography
            component="h3"
            sx={{
              viewTransitionName: isAnimating
                ? `${transitionPrefix}-title`
                : "none",
              viewTransitionClass: "order-shared",
              mt: 2.25,
              mb: 0.75,
              fontSize: 17,
              fontWeight: 700,
              lineHeight: 1.35,
            }}
          >
            {order.title}
          </Typography>
          <Typography
            sx={{
              viewTransitionName: isAnimating
                ? `${transitionPrefix}-date`
                : "none",
              viewTransitionClass: "order-shared",
              color: "text.secondary",
              fontSize: 13,
            }}
          >
            {formatDate(order.createdAt)}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: "auto",
              pt: 2.25,
              borderTop: "1px solid #EDF1F5",
            }}
          >
            <Author
              order={order}
              transitionPrefix={transitionPrefix}
              isAnimating={isAnimating}
            />
            <Box
              sx={{
                viewTransitionName: isAnimating
                  ? `${transitionPrefix}-toggle`
                  : "none",
                viewTransitionClass: "order-shared",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.25,
                ml: "auto",
                color: "primary.main",
              }}
            >
              <Typography
                sx={{
                  display: { xs: "none", sm: "block" },
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Подробнее
              </Typography>
              <ExpandMoreRoundedIcon sx={{ fontSize: 19 }} />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
});

export default OrderCard;
