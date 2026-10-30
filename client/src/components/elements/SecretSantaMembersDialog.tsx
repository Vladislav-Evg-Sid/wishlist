import { useState } from "react";
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
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";

import ConfirmDialog from "./ConfirmDialog";
import InviteSecretSantaMemberDialog from "./InviteSecretSantaMemberDialog";
import { observer } from "mobx-react-lite";
import type { SecretSantaTeamDetails } from "../../types/secretSantaTeam";
import type { UserInfo } from "../../types/shared";

interface SecretSantaMembersDialogProps {
  open: boolean;
  team: SecretSantaTeamDetails;
  onClose: () => void;
  onRemoveMember: (member: UserInfo) => void;
  onLeaveTeam: () => void;
}

interface MemberRowProps {
  member: UserInfo;
  isCreator?: boolean;
  canRemove?: boolean;
  onRemove?: () => void;
}

function MemberRow({
  member,
  isCreator = false,
  canRemove = false,
  onRemove,
}: MemberRowProps) {
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
      <Avatar
        aria-hidden="true"
        sx={{
          width: 42,
          height: 42,
          flexShrink: 0,
          bgcolor: isCreator ? "primary.main" : "#EDF2F7",
          color: isCreator ? "primary.contrastText" : "text.primary",
          fontSize: 17,
          fontWeight: 700,
        }}
      >
        del
      </Avatar>
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
            {member.name}
          </Typography>
          {isCreator && (
            <Box
              component="span"
              title="Создатель команды"
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
          #{member.hash}
        </Typography>
      </Box>
      {canRemove && !isCreator && (
        <IconButton
          type="button"
          aria-label={`Удалить участника ${member.name}`}
          title="Удалить участника"
          onClick={onRemove}
          sx={{ flexShrink: 0, color: "error.main" }}
        >
          <DeleteOutlineRoundedIcon />
        </IconButton>
      )}
    </Box>
  );
}

const SecretSantaMembersDialog = observer(
  ({
    open,
    team,
    onClose,
    onRemoveMember,
    onLeaveTeam,
  }: SecretSantaMembersDialogProps) => {
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isLeaveConfirmationOpen, setIsLeaveConfirmationOpen] =
      useState(false);
    const [memberToRemove, setMemberToRemove] = useState<UserInfo | null>(null);
    const canRemoveMembers =
      team.isCreator && (team.stage === 1 || team.stage === 4);
    const canCreateInvite = team.isCreator && team.stage === 1;
    const canLeaveTeam =
      !team.isCreator && (team.stage === 1 || team.stage === 4);
    const creator = team.members.creator;
    const members = team.members.members;

    const handleClose = () => {
      setIsInviteOpen(false);
      setIsLeaveConfirmationOpen(false);
      setMemberToRemove(null);
      onClose();
    };

    const handleLeaveConfirm = () => {
      setIsLeaveConfirmationOpen(false);
      onLeaveTeam();
    };

    const handleRemoveConfirm = () => {
      if (!memberToRemove) return;
      onRemoveMember(memberToRemove);
      setMemberToRemove(null);
    };

    return (
      <>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
          aria-labelledby="secret-santa-members-title"
          aria-describedby="secret-santa-members-description"
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
            id="secret-santa-members-title"
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
                  Участники команды
                </Typography>
                <Typography
                  id="secret-santa-members-description"
                  component="span"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    color: "text.secondary",
                    fontSize: 14,
                  }}
                >
                  Создатель и все участники этой команды
                </Typography>
              </Box>
              <IconButton
                type="button"
                aria-label="Закрыть"
                onClick={handleClose}
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
                <MemberRow member={creator} isCreator />
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
                  {canCreateInvite && (
                    <Button
                      type="button"
                      size="small"
                      startIcon={<AddRoundedIcon />}
                      onClick={() => setIsInviteOpen(true)}
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
                        member={member}
                        canRemove={canRemoveMembers}
                        onRemove={() => setMemberToRemove(member)}
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
                    В команде пока нет других участников
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
                  Данные появятся здесь после загрузки информации о команде.
                </Typography>
              </Box>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              px: { xs: 2.5, sm: 3.5 },
              pt: 2,
              pb: { xs: 2.5, sm: 3.5 },
              justifyContent: canLeaveTeam ? "space-between" : "flex-end",
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
            {canLeaveTeam && (
              <Button
                type="button"
                color="error"
                startIcon={<LogoutRoundedIcon />}
                onClick={() => setIsLeaveConfirmationOpen(true)}
              >
                Выйти из команды
              </Button>
            )}
            <Button type="button" variant="outlined" onClick={handleClose}>
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
        <InviteSecretSantaMemberDialog
          open={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
        />
        {isLeaveConfirmationOpen && (
          <ConfirmDialog
            open
            title="Выйти из команды?"
            informationMessage="Вы уверены, что хотите выйти из команды Тайного Санты?"
            confirmButtonColor="error"
            onClose={() => setIsLeaveConfirmationOpen(false)}
            onConfirm={handleLeaveConfirm}
          />
        )}
        {memberToRemove && (
          <ConfirmDialog
            open
            title="Удалить участника?"
            informationMessage={`Вы уверены, что хотите удалить участника ${memberToRemove.name} из команды Тайного Санты?`}
            confirmButtonColor="error"
            onClose={() => setMemberToRemove(null)}
            onConfirm={handleRemoveConfirm}
          />
        )}
      </>
    );
  },
);

export default SecretSantaMembersDialog;
