import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { useStoreOrders } from "../../../hooks/useStore";
import CreateOrderDialog from "../../elements/CreateOrderDialog";
import ConfirmDialog from "../../elements/ConfirmDialog";

const OrdersHeader = observer(() => {
  const orderStore = useStoreOrders();
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState<boolean>(false);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [wishlistName, setWishlistName] = useState<string>(
    orderStore.parantWishlistTitle,
  );
  const navigate = useNavigate();

  useEffect(
    () => setWishlistName(orderStore.parantWishlistTitle),
    [orderStore.parantWishlistTitle],
  );

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
          flexWrap: "wrap",
          gap: 2.5,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}
        >
          {isEditingName ? (
            <>
              <TextField
                autoFocus
                fullWidth
                required
                id="update-wishlist-name"
                name="wishlistName"
                value={wishlistName}
                onChange={(event) => setWishlistName(event.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#FBFCFE",
                    "& .MuiOutlinedInput-input": {
                      fontSize: "20px",
                      padding: "16.5px 14px",
                    },
                  },
                }}
              />
              <IconButton
                type="button"
                aria-label="Сохранить название вишлиста"
                onClick={() => {
                  setIsEditingName(false);
                  orderStore.updateParantWishlistName(wishlistName);
                }}
                sx={{ flexShrink: 0, color: "text.secondary" }}
              >
                <CheckRoundedIcon />
              </IconButton>
            </>
          ) : (
            <>
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
              {orderStore.isParantWishlistCreator && (
                <Tooltip title="Изменить название группы">
                  <IconButton
                    type="button"
                    aria-label="Изменить название группы"
                    onClick={() => setIsEditingName(true)}
                    sx={{ flexShrink: 0, color: "text.secondary" }}
                  >
                    <EditRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.25}
          sx={{ width: { xs: "100%", md: "auto" }, flexShrink: 0 }}
        >
          {orderStore.isParantWishlistCreator && (
            <>
              <Button
                type="button"
                variant="outlined"
                color="error"
                disableElevation
                startIcon={<DeleteForeverRoundedIcon />}
                onClick={() => setIsDeleteDialogOpen(true)}
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
                Удалить вишлист
              </Button>

              <ConfirmDialog
                open={isDeleteDialogOpen}
                deleteMessage={`Вы уверены, что хотите удалить ${wishlistName}?`}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={async () => {
                  await orderStore.deleteParantWishlist();
                  setIsDeleteDialogOpen(false);
                  navigate(-1);
                }}
                title="Удалить вишлист?"
              />
            </>
          )}
          <Button
            type="button"
            variant="contained"
            disableElevation
            startIcon={<AddRoundedIcon />}
            onClick={() => setIsCreateOrderOpen(true)}
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
        </Stack>
      </Box>
      <CreateOrderDialog
        open={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
      />
    </Box>
  );
});

export default OrdersHeader;
