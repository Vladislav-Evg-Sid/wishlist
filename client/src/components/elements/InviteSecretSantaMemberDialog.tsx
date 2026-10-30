import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import { toast } from "react-toastify";

import { useStore } from "../../hooks/useStore";

interface InviteSecretSantaMemberDialogProps {
  open: boolean;
  onClose: () => void;
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {}
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  if (!copied) throw new Error("Не удалось скопировать ссылку");
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: "#FBFCFE",
  },
} as const;

// TODO: Объеденить с групповым
const InviteSecretSantaMemberDialog = observer(
  ({ open, onClose }: InviteSecretSantaMemberDialogProps) => {
    const { secretSantaTeamStore } = useStore();
    const [ttl, setTtl] = useState("");
    const [inviteLimit, setInviteLimit] = useState("");
    const [inviteLink, setInviteLink] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const isValidFields =
      (Number.isInteger(Number(ttl)) && Number(ttl) > 0) ||
      (Number.isInteger(Number(inviteLimit)) && Number(inviteLimit) > 0);

    const resetFields = () => {
      setTtl("");
      setInviteLimit("");
      setInviteLink("");
      setIsCreating(false);
      setIsCopied(false);
    };

    const handleNumberChange = (
      setter: (value: string) => void,
      newValue: string,
    ) => {
      if (!newValue) {
        setter("");
      } else {
        const integerValue = Number(newValue);
        if (!Number.isInteger(integerValue)) return;
        setter(String(integerValue));
      }
      setInviteLink("");
      setIsCopied(false);
    };

    const handleCopy = async (link = inviteLink) => {
      if (!link) return;

      try {
        await copyToClipboard(link);
        setIsCopied(true);
      } catch {
        setIsCopied(false);
        toast.info("Не удалось скопировать ссылку");
      }
    };

    const handleCreate = async () => {
      if (!isValidFields || isCreating) return;

      setIsCreating(true);
      setIsCopied(false);
      try {
        const link = await secretSantaTeamStore.createTeamInviteLink(
          ttl ? Number(ttl) : undefined,
          inviteLimit ? Number(inviteLimit) : undefined,
        );
        setInviteLink(link);
        if (link) await handleCopy(link);
      } finally {
        setIsCreating(false);
      }
    };

    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="xs"
        aria-labelledby="secret-santa-invite-title"
        aria-describedby="secret-santa-invite-description"
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
          id="secret-santa-invite-title"
          sx={{ px: { xs: 2.5, sm: 3.5 }, pt: { xs: 2.5, sm: 3.5 }, pb: 1 }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box
              aria-hidden="true"
              sx={{
                width: 48,
                height: 48,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                borderRadius: "15px",
                color: "primary.main",
                bgcolor: "#EDF4FF",
              }}
            >
              <KeyRoundedIcon sx={{ fontSize: 27 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                component="span"
                sx={{
                  display: "block",
                  fontSize: { xs: 23, sm: 26 },
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                }}
              >
                Пригласить участника
              </Typography>
              <Typography
                id="secret-santa-invite-description"
                component="span"
                sx={{
                  display: "block",
                  mt: 0.5,
                  color: "text.secondary",
                  fontSize: 14,
                }}
              >
                Настройте ограничения и отправьте полученную ссылку участнику.
              </Typography>
            </Box>
            <IconButton
              type="button"
              aria-label="Закрыть"
              onClick={onClose}
              sx={{ mt: -0.75, mr: -1 }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{ px: { xs: 2.5, sm: 3.5 }, pt: "20px !important", pb: 1 }}
        >
          <Box sx={{ display: "grid", gap: 2 }}>
            <TextField
              autoFocus
              fullWidth
              type="number"
              label="Время действия, часов"
              value={ttl}
              onChange={(event) =>
                handleNumberChange(setTtl, event.target.value)
              }
              slotProps={{
                htmlInput: { min: 1, step: 1, inputMode: "numeric" },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeRoundedIcon
                        sx={{ color: "text.secondary", fontSize: 21 }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
              sx={fieldSx}
            />
            <TextField
              fullWidth
              type="number"
              label="Максимум участников"
              value={inviteLimit}
              onChange={(event) =>
                handleNumberChange(setInviteLimit, event.target.value)
              }
              slotProps={{
                htmlInput: { min: 1, step: 1, inputMode: "numeric" },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleAltRoundedIcon
                        sx={{ color: "text.secondary", fontSize: 21 }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
              sx={fieldSx}
            />

            {inviteLink && (
              <Box
                sx={{
                  mt: 0.5,
                  p: 2,
                  border: "1px solid #D8E5F5",
                  borderRadius: "14px",
                  bgcolor: "#F6F9FE",
                }}
              >
                <Typography sx={{ mb: 1, fontSize: 13, fontWeight: 650 }}>
                  Ссылка для приглашения
                </Typography>
                <TextField
                  fullWidth
                  value={inviteLink}
                  aria-label="Ссылка для приглашения в команду"
                  slotProps={{
                    htmlInput: { readOnly: true },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip
                            title={
                              isCopied
                                ? "Ссылка скопирована"
                                : "Копировать ссылку"
                            }
                          >
                            <IconButton
                              type="button"
                              edge="end"
                              aria-label="Копировать ссылку для приглашения"
                              onClick={() => void handleCopy()}
                              color={isCopied ? "success" : "default"}
                            >
                              {isCopied ? (
                                <CheckRoundedIcon />
                              ) : (
                                <ContentCopyRoundedIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    ...fieldSx,
                    "& input": { fontFamily: "monospace", fontWeight: 650 },
                  }}
                />
                <Typography
                  sx={{
                    mt: 1,
                    color: isCopied ? "success.main" : "text.secondary",
                    fontSize: 12,
                  }}
                >
                  {isCopied
                    ? "Ссылка скопирована в буфер обмена"
                    : "Скопируйте ссылку и отправьте её будущему участнику"}
                </Typography>
              </Box>
            )}
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
            onClick={onClose}
            sx={{ color: "text.secondary" }}
          >
            Закрыть
          </Button>
          <Button
            type="button"
            variant="contained"
            disableElevation
            disabled={!isValidFields || isCreating}
            onClick={() => void handleCreate()}
          >
            {isCreating
              ? "Создаём…"
              : inviteLink
                ? "Создать новую ссылку"
                : "Создать ссылку"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

export default InviteSecretSantaMemberDialog;
