import { Avatar, Box, Chip, Link, Typography } from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

import { getWishIcon } from "../../../constants/wishIcons";
import type { OrderData } from "../../../types/orders";

const statusStyles = {
  Свободно: { bgcolor: "#E8F7EF", color: "#177447" },
  Забронировано: { bgcolor: "#FFF3D7", color: "#9A6500" },
  Подарено: { bgcolor: "#E8F1FF", color: "#064DB5" },
} as const;

function formatDate(value: string | Date) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Дата не указана";

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getSourceName(href: string) {
  if (!href) return "";

  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "Источник";
  }
}

function OrderVisual({ icon }: Pick<OrderData, "icon">) {
  const wishIcon = getWishIcon(icon);

  return (
    <Box
      aria-hidden="true"
      sx={{
        display: "grid",
        placeItems: "center",
        width: 54,
        height: 54,
        flexShrink: 0,
        borderRadius: "15px",
        bgcolor: "#EDF4FF",
        color: "primary.main",
        fontSize: 27,
      }}
    >
      {wishIcon.symbol}
    </Box>
  );
}

export default function OrderCard({ order }: { order: OrderData }) {
  const sourceName = getSourceName(order.href);

  return (
    <Box
      component="article"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: 235,
        p: 2.5,
        bgcolor: "background.paper",
        border: "1px solid #DCE4ED",
        borderRadius: "20px",
        transition:
          "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "primary.light",
          boxShadow: "0 12px 24px rgba(15,23,42,0.06)",
        },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&:hover": { transform: "none" },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <OrderVisual icon={order.icon} />
        <Chip
          label={order.status}
          size="small"
          sx={{
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
          mt: 2.25,
          mb: 0.75,
          fontSize: 17,
          fontWeight: 700,
          lineHeight: 1.35,
        }}
      >
        {order.title}
      </Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
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
        <Avatar
          sx={{
            width: 30,
            height: 30,
            bgcolor: "#E8F1FF",
            color: "primary.main",
            fontSize: 10,
            fontWeight: 800,
          }}
        >
          {order.author.name}
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
            {order.author.name}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 11 }}>
            #{order.author.hash}
          </Typography>
        </Box>
        {order.href ? (
          <Link
            href={order.href}
            target="_blank"
            rel="noreferrer"
            underline="hover"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.25,
              ml: "auto",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {sourceName}
            <OpenInNewRoundedIcon sx={{ fontSize: 14 }} />
          </Link>
        ) : (
          <Typography sx={{ ml: "auto", color: "#94A3B8", fontSize: 12 }}>
            Нет ссылки
          </Typography>
        )}
      </Box>
    </Box>
  );
}
