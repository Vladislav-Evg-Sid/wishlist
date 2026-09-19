import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import { useStoreOrders } from "../../../hooks/useStore";

const OrdersHeader = observer(() => {
  const orderStore = useStoreOrders();
  const navigate = useNavigate();

  return (
    <Box component="header" sx={{ mb: 3.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: { xs: 2.5, md: 3 },
        }}
      >
        <Tooltip title="Вернуться к вишлистам">
          <IconButton
            type="button"
            aria-label="Назад к вишлистам"
            onClick={() => navigate(-1)}
            sx={{
              width: 40,
              height: 40,
              ml: -1,
              color: "text.secondary",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              "&:hover": { color: "primary.main", bgcolor: "#F4F7FB" },
            }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>
        </Tooltip>
        <Typography
          sx={{ color: "text.secondary", fontSize: 14, fontWeight: 600 }}
        >
          Вишлисты
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "flex-end" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              mb: 0.75,
              color: "text.secondary",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Вишлист
          </Typography>
          <Typography
            component="h1"
            sx={{
              color: "text.primary",
              fontSize: { xs: 30, md: 40 },
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 1.2,
              overflowWrap: "anywhere",
            }}
          >
            {orderStore.parantWishlistTitle || "Записи вишлиста"}
          </Typography>
        </Box>
        <Button
          type="button"
          variant="contained"
          disableElevation
          startIcon={<AddRoundedIcon />}
          onClick={() => alert("Функция добавления записи пока не доступна")}
          sx={{
            width: { xs: "100%", sm: "auto" },
            flexShrink: 0,
            borderRadius: "12px",
            px: 2.5,
            py: 1.4,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Добавить запись
        </Button>
      </Box>
    </Box>
  );
});

export default OrdersHeader;
