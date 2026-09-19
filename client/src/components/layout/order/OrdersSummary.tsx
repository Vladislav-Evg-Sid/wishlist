import { observer } from "mobx-react-lite";
import { Box, Typography } from "@mui/material";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import { useStoreOrders } from "../../../hooks/useStore";

const items = [
  { key: "all", label: "всего записей", Icon: Inventory2OutlinedIcon },
  { key: "reserved", label: "забронировано", Icon: CardGiftcardRoundedIcon },
  { key: "gifted", label: "подарено", Icon: CheckCircleOutlineRoundedIcon },
] as const;

const OrdersSummary = observer(() => {
  const orderStore = useStoreOrders();
  const values = {
    all: orderStore.countOrders,
    reserved: orderStore.countReservedOrders,
    gifted: orderStore.countGiftedOrders,
  };

  return (
    <Box
      component="section"
      aria-label="Сводка по записям"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
        gap: 1.5,
        mb: 2.25,
      }}
    >
      {items.map(({ key, label, Icon }) => (
        <Box
          key={key}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            minWidth: 0,
            p: 2,
            bgcolor: "background.paper",
            border: "1px solid #DCE4ED",
            borderRadius: "15px",
          }}
        >
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: "11px",
              bgcolor: "#EDF4FF",
              color: "primary.main",
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography component="strong" sx={{ mr: 0.75, fontSize: 22, fontWeight: 700 }}>
              {values[key]}
            </Typography>
            <Typography component="span" sx={{ color: "text.secondary", fontSize: 13 }}>
              {label}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
});

export default OrdersSummary;
