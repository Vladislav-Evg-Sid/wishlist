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
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { useStore } from "../../hooks/useStore";

interface CreateSecretSantaTeamDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateSecretSantaTeamDialog({
  open,
  onClose,
}: CreateSecretSantaTeamDialogProps) {
  const { secretSantaStore } = useStore();
  const [teamName, setTeamName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setTeamName(event.target.value);
  }

  function handleClose() {
    if (!isSubmitting) onClose();
  }

  async function handleCreate() {
    if (!teamName.trim() || !deliveryDate || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const created = await secretSantaStore.createTeam(
        teamName.trim(),
        new Date(deliveryDate + "T00:00:00"),
      );
      if (created) onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="create-secret-santa-team-title"
      aria-describedby="create-secret-santa-team-description"
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
        transition: {
          onExited: () => {
            setTeamName("");
            setDeliveryDate("");
          },
        },
      }}
    >
      <DialogTitle
        id="create-secret-santa-team-title"
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
          <GroupsRoundedIcon sx={{ fontSize: 28 }} />
        </Box>
        Новая команда
      </DialogTitle>
      <DialogContent sx={{ px: 3.5, pb: 1 }}>
        <Typography
          id="create-secret-santa-team-description"
          sx={{ color: "text.secondary", fontSize: 14, lineHeight: 1.7, mb: 3 }}
        >
          Придумайте название команды и выберите дату вручения подарков.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          required
          id="create-secret-santa-team-name"
          name="teamName"
          label="Название команды"
          placeholder="Например, Семья"
          disabled={isSubmitting}
          value={teamName}
          onChange={handleNameChange}
          sx={{
            mt: 0.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "#FBFCFE",
            },
          }}
        />
        <TextField
          fullWidth
          required
          type="date"
          id="create-secret-santa-team-date"
          name="deliveryDate"
          label="Дата вручения подарков"
          value={deliveryDate}
          onChange={(event) => setDeliveryDate(event.target.value)}
          disabled={isSubmitting}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{
            mt: 2.5,
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
          disabled={isSubmitting}
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
          disabled={!teamName.trim() || !deliveryDate || isSubmitting}
        >
          {isSubmitting ? "Создание…" : "Создать"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
