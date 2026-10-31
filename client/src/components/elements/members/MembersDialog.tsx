import { useId } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";

import type { UserInfo } from "../../../types/shared";

interface MembersDialogProps {
  open: boolean;
  title: string;
  description: string;
  creator?: UserInfo;
  members: UserInfo[];
  creatorTitle: string;
  emptyMembersMessage: string;
  unavailableMessage: string;
  showAvatars?: boolean;
  leaveLabel?: string;
  onClose: () => void;
  onInvite?: () => void;
  onLeave?: () => void;
  onRemoveMember?: (member: UserInfo) => void;
  onChangeCreator?: (member: UserInfo) => void;
}

interface MemberRowProps {
  user: UserInfo;
  isCreator?: boolean;
  creatorTitle: string;
  showAvatar: boolean;
  onRemove?: () => void;
  onChangeCreator?: () => void;
}

function MemberRow({
  user,
  isCreator = false,
  creatorTitle,
  showAvatar,
  onRemove,
  onChangeCreator,
}: MemberRowProps) {
  const initial = user.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1.5,
        minWidth: 0,
      }}
    >
      {showAvatar && (
        <Avatar
          aria-hidden="true"
          sx={{
            width: 42,
            height: 42,
            bgcolor: isCreator ? "primary.main" : "#EDF2F7",
            color: isCreator ? "primary.contrastText" : "text.primary",
            fontSize: 17,
            fontWeight: 700,
          }}
        >
          {initial}
        </Avatar>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
          <Typography
            sx={{
              overflow: "hidden",
              fontWeight: 650,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.name}
          </Typography>
          {isCreator && (
            <Box
              component="span"
              title={creatorTitle}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                flexShrink: 0,
                color: "primary.main",
              }}
            >
              <WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
          )}
        </Stack>
        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
          #{user.hash}
        </Typography>
      </Box>
      {!isCreator && (onChangeCreator || onRemove) && (
        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
          {onChangeCreator && (
            <>
              <IconButton
                type="button"
                aria-label={`Назначить ${user.name} создателем`}
                title="Сделать создателем"
                onClick={onChangeCreator}
                sx={{
                  display: { xs: "inline-flex", sm: "none" },
                  color: "primary.main",
                }}
              >
                <PersonAddAltRoundedIcon />
              </IconButton>
              <Button
                type="button"
                size="small"
                onClick={onChangeCreator}
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  borderRadius: "10px",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Сделать создателем
              </Button>
            </>
          )}
          {onRemove && (
            <IconButton
              type="button"
              aria-label={`Удалить участника ${user.name}`}
              title="Удалить участника"
              onClick={onRemove}
              sx={{ color: "error.main" }}
            >
              <DeleteOutlineRoundedIcon />
            </IconButton>
          )}
        </Stack>
      )}
    </Box>
  );
}

export default function MembersDialog({
  open,
  title,
  description,
  creator,
  members,
  creatorTitle,
  emptyMembersMessage,
  unavailableMessage,
  showAvatars = true,
  leaveLabel = "Выйти",
  onClose,
  onInvite,
  onLeave,
  onRemoveMember,
  onChangeCreator,
}: MembersDialogProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: "20px", sm: "24px" },
            m: { xs: 1.5, sm: 2 },
            width: { xs: "calc(100% - 24px)", sm: "calc(100% - 32px)" },
            maxHeight: { xs: "calc(100% - 24px)", sm: "calc(100% - 64px)" },
            boxShadow: "0 24px 80px rgba(15,23,42,0.18)",
          },
        },
        backdrop: {
          sx: {
            bgcolor: "rgba(15,23,42,0.38)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      <DialogTitle
        id={titleId}
        sx={{ px: { xs: 2.5, sm: 3.5 }, pt: { xs: 2.5, sm: 3.5 }, pb: 1 }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Box
            aria-hidden="true"
            sx={{
              display: "grid",
              placeItems: "center",
              width: 48,
              height: 48,
              flexShrink: 0,
              bgcolor: "#EDF4FF",
              color: "primary.main",
              borderRadius: "15px",
            }}
          >
            <GroupRoundedIcon sx={{ fontSize: 27 }} />
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
              {title}
            </Typography>
            <Typography
              id={descriptionId}
              component="span"
              sx={{
                display: "block",
                mt: 0.5,
                color: "text.secondary",
                fontSize: 14,
              }}
            >
              {description}
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
        {creator ? (
          <>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Создатель
            </Typography>
            <MemberRow
              user={creator}
              isCreator
              creatorTitle={creatorTitle}
              showAvatar={showAvatars}
            />
            <Divider sx={{ my: 1.5 }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Участники · {members.length}
              </Typography>
              {onInvite && (
                <Button
                  type="button"
                  size="small"
                  startIcon={<AddRoundedIcon />}
                  onClick={onInvite}
                  sx={{ borderRadius: "10px", textTransform: "none" }}
                >
                  Добавить
                </Button>
              )}
            </Box>
            {members.length > 0 ? (
              <Stack divider={<Divider flexItem />} sx={{ mt: 0.5 }}>
                {members.map((member) => (
                  <MemberRow
                    key={member.id}
                    user={member}
                    creatorTitle={creatorTitle}
                    showAvatar={showAvatars}
                    onRemove={
                      onRemoveMember ? () => onRemoveMember(member) : undefined
                    }
                    onChangeCreator={
                      onChangeCreator
                        ? () => onChangeCreator(member)
                        : undefined
                    }
                  />
                ))}
              </Stack>
            ) : (
              <Typography
                sx={{
                  py: 3,
                  color: "text.secondary",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                {emptyMembersMessage}
              </Typography>
            )}
          </>
        ) : (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 650 }}>
              Список участников пока недоступен
            </Typography>
            <Typography
              sx={{ mt: 0.75, color: "text.secondary", fontSize: 14 }}
            >
              {unavailableMessage}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          pt: 2,
          pb: { xs: 2.5, sm: 3.5 },
          justifyContent: onLeave ? "space-between" : "flex-end",
          gap: 1,
          "& .MuiButton-root": {
            borderRadius: "12px",
            px: 2.25,
            py: 1.1,
            textTransform: "none",
            fontWeight: 600,
          },
        }}
      >
        {onLeave && (
          <Button
            type="button"
            color="error"
            startIcon={<LogoutRoundedIcon />}
            onClick={onLeave}
          >
            {leaveLabel}
          </Button>
        )}
        <Button type="button" variant="outlined" onClick={onClose}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}
