import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";

import {
  DEFAULT_WISH_ICON,
  getWishIcon,
  WISH_ICONS,
  type WishIcon,
} from "../../constants/wishIcons";
import { useStoreOrders } from "../../hooks/useStore";

interface CreateOrderDialogProps {
  open: boolean;
  onClose: () => void;
}

function isValidHref(value: string) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: "#FBFCFE",
  },
} as const;

export default function CreateOrderDialog({
  open,
  onClose,
}: CreateOrderDialogProps) {
  const orderStore = useStoreOrders();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [href, setHref] = useState("");
  const [icon, setIcon] = useState<WishIcon>(getWishIcon(DEFAULT_WISH_ICON));
  const [hrefTouched, setHrefTouched] = useState(false);
  const hrefIsValid = isValidHref(href);

  function resetFields() {
    setTitle("");
    setDescription("");
    setHref("");
    setIcon(getWishIcon(DEFAULT_WISH_ICON));
    setHrefTouched(false);
  }

  function handleIconChange(_event: SyntheticEvent, value: WishIcon | null) {
    setIcon(value ?? getWishIcon(DEFAULT_WISH_ICON));
  }

  function handleHrefChange(event: ChangeEvent<HTMLInputElement>) {
    setHref(event.target.value);
  }

  function handleClose() {
    onClose();
  }

  async function handleCreate() {
    if (!hrefIsValid) {
      setHrefTouched(true);
      return;
    }

    await orderStore.createOrder(
      title.trim(),
      description.trim(),
      icon.value,
      href.trim(),
    );
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="create-order-title"
      aria-describedby="create-order-description"
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
        transition: { onExited: resetFields },
      }}
    >
      <DialogTitle
        id="create-order-title"
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          pt: { xs: 2.5, sm: 3.5 },
          pb: 1,
          fontSize: { xs: 23, sm: 26 },
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
          <AddShoppingCartRoundedIcon sx={{ fontSize: 28 }} />
        </Box>
        Новая запись
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2.5, sm: 3.5 }, pb: 1 }}>
        <Typography
          id="create-order-description"
          sx={{ color: "text.secondary", fontSize: 14, lineHeight: 1.7, mb: 3 }}
        >
          Добавьте желание, ссылку на него и выберите подходящую иконку.
        </Typography>
        <Box sx={{ display: "grid", gap: 2 }}>
          <TextField
            autoFocus
            fullWidth
            required
            id="create-order-name"
            name="orderName"
            label="Название"
            placeholder="Например, Беспроводные наушники"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            sx={fieldSx}
          />
          <Autocomplete
            options={WISH_ICONS}
            value={icon}
            onChange={handleIconChange}
            autoHighlight
            disableClearable
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ gap: 1.25 }}>
                <Box component="span" aria-hidden="true" sx={{ fontSize: 22 }}>
                  {option.symbol}
                </Box>
                {option.label}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Иконка"
                placeholder="Начните вводить название"
                sx={fieldSx}
                slotProps={{
                  ...params.slotProps,
                  input: {
                    ...params.slotProps.input,
                    startAdornment: (
                      <>
                        <Box
                          component="span"
                          aria-hidden="true"
                          sx={{ ml: 0.5, mr: 0.75, fontSize: 21 }}
                        >
                          {icon.symbol}
                        </Box>
                        {params.slotProps.input.startAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
            noOptionsText="Иконки не найдены"
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            id="create-order-details"
            name="description"
            label="Описание"
            placeholder="Размер, цвет или другие детали"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            sx={fieldSx}
          />
          <TextField
            fullWidth
            id="create-order-href"
            name="href"
            type="url"
            label="Ссылка"
            placeholder="https://example.com/product"
            value={href}
            onChange={handleHrefChange}
            onBlur={() => setHrefTouched(true)}
            error={hrefTouched && !hrefIsValid}
            helperText={
              hrefTouched && !hrefIsValid
                ? "Введите корректную ссылку, начинающуюся с http:// или https://"
                : "Необязательное поле"
            }
            sx={fieldSx}
          />
        </Box>
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
          onClick={handleCreate}
          disableElevation
          disabled={!title.trim() || !hrefIsValid}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
