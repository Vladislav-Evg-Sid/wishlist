import { useState, type ChangeEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
// import { useStoreWishlists } from "../../hooks/useStore";

interface CreateWishlistDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateWishlistDialog({
  open,
  onClose,
}: CreateWishlistDialogProps) {
  // const wishlistStore = useStoreWishlists();
  const [wishlistName, setWishlistName] = useState("");

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setWishlistName(event.target.value);
  }

  function handleClose() {
    onClose();
  }

  // function handleCreate() {
  // wishlistStore.createWishlist(wishlistName);
  // onClose();
  // }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="create-wishlist-title"
      aria-describedby="create-wishlist-description"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "24px",
            m: 2,
            width: "calc(100% - 32px)",
            boxShadow: "0 24px 80px rgba(15,23,42,0.18)",
          },
        },
        backdrop: {
          sx: { bgcolor: "rgba(15,23,42,0.38)", backdropFilter: "blur(4px)" },
        },
        transition: { onExited: () => setWishlistName("") },
      }}
    >
      <DialogTitle
        id="create-wishlist-title"
        sx={{
          px: 3.5,
          pt: 3.5,
          pb: 1,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "-0.035em",
        }}
      >
        <Box
          component="span"
          sx={{
            display: "grid",
            placeItems: "center",
            width: 52,
            height: 52,
            mb: 2.5,
            bgcolor: "#EDF4FF",
            color: "primary.main",
            borderRadius: "16px",
          }}
        >
          <ViewListRoundedIcon sx={{ fontSize: 28 }} />
        </Box>
        Новый вишлист
      </DialogTitle>
      <DialogContent sx={{ px: 3.5, pb: 1 }}>
        <Typography
          id="create-wishlist-description"
          sx={{ color: "text.secondary", fontSize: 14, lineHeight: 1.7, mb: 3 }}
        >
          Придумайте название, чтобы легко найти вишлист среди остальных.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          required
          id="create-wishlist-name"
          name="wishlistName"
          label="Название вишлиста"
          placeholder="Например, Подарки"
          value={wishlistName}
          onChange={handleNameChange}
          sx={{
            mt: 0.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "#FBFCFE",
            },
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          px: 3.5,
          pt: 3,
          pb: 3.5,
          gap: 1,
          "& .MuiButton-root": {
            borderRadius: "12px",
            px: 2.5,
            py: 1.25,
            textTransform: "none",
            fontWeight: 600,
          },
        }}
      >
        <Button
          type="button"
          onClick={handleClose}
          sx={{ color: "text.secondary" }}
        >
          Отмена
        </Button>
        <Button
          type="button"
          variant="contained"
          // onClick={handleCreate}
          disableElevation
          disabled={!wishlistName.trim()}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
