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
import { useStoreGroups } from "../../hooks/useStore";

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateGroupDialog({
  open,
  onClose,
}: CreateGroupDialogProps) {
  const groupStore = useStoreGroups();
  const [groupName, setGroupName] = useState("");

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setGroupName(event.target.value);
  }

  function handleClose() {
    onClose();
  }

  function handleCreate() {
    groupStore.createGroup(groupName);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="create-group-title"
      aria-describedby="create-group-description"
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
        transition: { onExited: () => setGroupName("") },
      }}
    >
      <DialogTitle
        id="create-group-title"
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
        Новая группа
      </DialogTitle>
      <DialogContent sx={{ px: 3.5, pb: 1 }}>
        <Typography
          id="create-group-description"
          sx={{ color: "text.secondary", fontSize: 14, lineHeight: 1.7, mb: 3 }}
        >
          Придумайте название, чтобы легко найти группу среди остальных.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          required
          id="create-group-name"
          name="groupName"
          label="Название группы"
          placeholder="Например, Семья"
          value={groupName}
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
          onClick={handleCreate}
          disableElevation
          disabled={!groupName.trim()}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
