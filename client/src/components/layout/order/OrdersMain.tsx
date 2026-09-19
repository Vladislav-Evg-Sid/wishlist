import { Box } from "@mui/material";

import OrdersBody from "./OrdersBody";
import OrdersHeader from "./OrdersHeader";
import OrdersSummary from "./OrdersSummary";

export default function OrdersMain() {
  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      <OrdersHeader />
      <OrdersSummary />
      <OrdersBody />
    </Box>
  );
}
