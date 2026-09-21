import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { observer } from "mobx-react-lite";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import InputAdornment from "@mui/material/InputAdornment";

import { useStoreOrders } from "../../../hooks/useStore";
import type { OrderID } from "../../../types/orders";
import OrderCard from "./OrderCard";

type Sort = "date-desc" | "date-asc" | "title-asc" | "title-desc";

function getShop(href: string) {
  if (!href) return "none";
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "other";
  }
}

const controlSx = {
  "& .MuiOutlinedInput-root": {
    height: 48,
    borderRadius: "11px",
    bgcolor: "#F8FAFC",
  },
} as const;

const OrdersBody = observer(() => {
  const orderStore = useStoreOrders();
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [shop, setShop] = useState<string>("");
  const [sort, setSort] = useState<Sort>("date-desc");
  const [expandedOrderID, setExpandedOrderID] = useState<OrderID | null>(null);
  const [transitionOrderID, setTransitionOrderID] = useState<OrderID | null>(
    null,
  );

  const authors = useMemo(
    () =>
      Array.from(
        new Set(orderStore.orders.map((order) => order.author.name)),
      ).sort((a, b) => a.localeCompare(b, "ru")),
    [orderStore.orders],
  );
  const shops = useMemo(
    () =>
      Array.from(
        new Set(orderStore.orders.map((order) => getShop(order.href))),
      ).sort(),
    [orderStore.orders],
  );
  const visibleOrders = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ru");

    return orderStore.orders
      .filter(
        (order) =>
          !query || order.title.toLocaleLowerCase("ru").includes(query),
      )
      .filter((order) => !status || order.status === status)
      .filter((order) => !author || order.author.name === author)
      .filter((order) => !shop || getShop(order.href) === shop)
      .slice()
      .sort((a, b) => {
        if (sort === "title-asc") return a.title.localeCompare(b.title, "ru");
        if (sort === "title-desc") return b.title.localeCompare(a.title, "ru");
        const aTime = new Date(a.createdAt).getTime() || 0;
        const bTime = new Date(b.createdAt).getTime() || 0;
        return sort === "date-asc" ? aTime - bTime : bTime - aTime;
      });
  }, [author, orderStore.orders, search, shop, sort, status]);

  function toggleOrder(orderID: OrderID) {
    if (transitionOrderID !== null) return;

    const update = () => {
      flushSync(() => {
        setExpandedOrderID((currentID) =>
          currentID === orderID ? null : orderID,
        );
      });
    };
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!reduceMotion && typeof document.startViewTransition === "function") {
      flushSync(() => setTransitionOrderID(orderID));
      const transition = document.startViewTransition(update);
      void transition.finished.finally(() => setTransitionOrderID(null));
      return;
    }

    update();
  }

  return (
    <>
      <Box
        component="section"
        aria-label="Фильтры записей"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "minmax(250px, 1fr) repeat(4, minmax(135px, 175px))",
          },
          gap: 1.25,
          p: 1.75,
          mb: 3,
          bgcolor: "background.paper",
          border: "1px solid #DCE4ED",
          borderRadius: "18px",
        }}
      >
        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск по названию"
          slotProps={{
            htmlInput: { "aria-label": "Поиск по названию" },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{ color: "text.secondary", fontSize: 20 }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{ ...controlSx, gridColumn: { md: "1 / -1", xl: "auto" } }}
        />
        <FormControl sx={controlSx}>
          <InputLabel id="orders-status-label">Статус</InputLabel>
          <Select
            labelId="orders-status-label"
            value={status}
            label="Статус"
            onChange={(event) => setStatus(event.target.value)}
          >
            <MenuItem value="">Все статусы</MenuItem>
            <MenuItem value="Свободно">Свободно</MenuItem>
            <MenuItem value="Забронировано">Забронировано</MenuItem>
            <MenuItem value="Подарено">Подарено</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={controlSx}>
          <InputLabel id="orders-author-label">Автор</InputLabel>
          <Select
            labelId="orders-author-label"
            value={author}
            label="Автор"
            onChange={(event) => setAuthor(event.target.value)}
          >
            <MenuItem value="">Все авторы</MenuItem>
            {authors.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={controlSx}>
          <InputLabel id="orders-shop-label">Магазин</InputLabel>
          <Select
            labelId="orders-shop-label"
            value={shop}
            label="Магазин"
            onChange={(event) => setShop(event.target.value)}
          >
            <MenuItem value="">Все магазины</MenuItem>
            {shops.map((name) => (
              <MenuItem key={name} value={name}>
                {name === "none" ? "Без магазина" : name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={controlSx}>
          <InputLabel id="orders-sort-label">Сортировка</InputLabel>
          <Select
            labelId="orders-sort-label"
            value={sort}
            label="Сортировка"
            onChange={(event) => setSort(event.target.value as Sort)}
          >
            <MenuItem value="date-desc">Сначала новые</MenuItem>
            <MenuItem value="date-asc">Сначала старые</MenuItem>
            <MenuItem value="title-asc">Название А–Я</MenuItem>
            <MenuItem value="title-desc">Название Я–А</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.25 }}>
        <Typography component="h2" sx={{ fontSize: 15, fontWeight: 700 }}>
          Записи
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          {visibleOrders.length}
        </Typography>
        <Box
          aria-hidden="true"
          sx={{ flex: 1, height: "1px", bgcolor: "#DBE3EC" }}
        />
      </Box>

      {visibleOrders.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridAutoFlow: "row dense",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2.25,
          }}
        >
          {visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrderID === order.id}
              isAnimating={transitionOrderID === order.id}
              onToggle={() => toggleOrder(order.id)}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            px: 3,
            py: 6,
            bgcolor: "background.paper",
            border: "1px dashed #B9C8D8",
            borderRadius: "18px",
            textAlign: "center",
          }}
        >
          <Typography sx={{ mb: 0.75, fontSize: 18, fontWeight: 700 }}>
            Ничего не найдено
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
            {orderStore.orders.length === 0
              ? "В этом вишлисте пока нет записей."
              : "Попробуйте изменить поиск или фильтры."}
          </Typography>
        </Box>
      )}
    </>
  );
});

export default OrdersBody;
