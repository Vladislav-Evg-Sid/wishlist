import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface DeleteOrderDialogProps {
  open: boolean;
  orderTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteOrderDialog({
  open,
  orderTitle,
  onClose,
  onConfirm,
}: DeleteOrderDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="delete-order-title"
      aria-describedby="delete-order-description"
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: "20px", sm: "24px" },
            m: { xs: 1.5, sm: 2 },
            width: { xs: "calc(100% - 24px)", sm: "calc(100% - 32px)" },
            boxShadow: "0 24px 80px rgba(15,23,42,0.18)",
          },
        },
        backdrop: {
          sx: { bgcolor: "rgba(15,23,42,0.38)", backdropFilter: "blur(4px)" },
        },
      }}
    >
      <DialogTitle
        id="delete-order-title"
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          pt: { xs: 2.5, sm: 3.5 },
          pb: 1,
          fontSize: { xs: 23, sm: 26 },
          fontWeight: 700,
          letterSpacing: "-0.035em",
        }}
      >
        Удалить запись?
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2.5, sm: 3.5 }, pb: 1 }}>
        <Typography
          id="delete-order-description"
          sx={{ color: "text.secondary", fontSize: 14, lineHeight: 1.7 }}
        >
          Вы уверены, что хотите удалить {orderTitle}?
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          pt: 3,
          pb: { xs: 2.5, sm: 3.5 },
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
        <Button type="button" onClick={onClose} sx={{ color: "text.secondary" }}>
          Отмена
        </Button>
        <Button
          type="button"
          variant="contained"
          color="error"
          disableElevation
          onClick={onConfirm}
        >
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
