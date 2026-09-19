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
import CrownRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import { observer } from "mobx-react-lite/src/observer.js";

import { useStoreWishlists } from "../../hooks/useStore";
import type { GroupUser } from "../../types/wishlists";

interface GroupMembersDialogProps {
  open: boolean;
  onClose: () => void;
}

interface UserRowProps {
  user: GroupUser;
  isCreator?: boolean;
  canManage?: boolean;
}

const unavailable = (feature: string) => () =>
  alert(`Функция ${feature} пока не доступна`);

function UserRow({ user, isCreator = false, canManage = false }: UserRowProps) {
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
              sx={{
                display: "inline-flex",
                alignItems: "center",
                flexShrink: 0,
                color: "primary.main",
              }}
              title="Создатель группы"
            >
              <CrownRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
          )}
        </Stack>
        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
          #{user.hash}
        </Typography>
      </Box>
      {canManage && !isCreator && (
        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
          <IconButton
            type="button"
            aria-label={`Назначить ${user.name} создателем`}
            title="Сделать создателем"
            onClick={unavailable("назначения пользователя создателем")}
            sx={{ display: { xs: "inline-flex", sm: "none" }, color: "primary.main" }}
          >
            <PersonAddAltRoundedIcon />
          </IconButton>
          <Button
            type="button"
            size="small"
            onClick={unavailable("назначения пользователя создателем")}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              borderRadius: "10px",
              textTransform: "none",
              whiteSpace: "nowrap",
            }}
          >
            Сделать создателем
          </Button>
          <IconButton
            type="button"
            aria-label={`Удалить участника ${user.name}`}
            title="Удалить участника"
            onClick={unavailable("удаления пользователя")}
            sx={{ color: "error.main" }}
          >
            <DeleteOutlineRoundedIcon />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
}

const GroupMembersDialog = observer(function GroupMembersDialog({
  open,
  onClose,
}: GroupMembersDialogProps) {
  const wishlistStore = useStoreWishlists();
  const users = wishlistStore.parantGroupUsers;
  const isCreator = wishlistStore.isParantGroupCreator;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="group-members-title"
      aria-describedby="group-members-description"
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
          sx: { bgcolor: "rgba(15,23,42,0.38)", backdropFilter: "blur(4px)" },
        },
      }}
    >
      <DialogTitle
        id="group-members-title"
        sx={{ px: { xs: 2.5, sm: 3.5 }, pt: { xs: 2.5, sm: 3.5 }, pb: 1 }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Box
            component="span"
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
              Участники группы
            </Typography>
            <Typography
              id="group-members-description"
              component="span"
              sx={{ display: "block", mt: 0.5, color: "text.secondary", fontSize: 14 }}
            >
              Создатель и все участники этой группы
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

      <DialogContent sx={{ px: { xs: 2.5, sm: 3.5 }, pt: "20px !important", pb: 1 }}>
        {users ? (
          <>
            <Typography sx={{ color: "text.secondary", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Создатель
            </Typography>
            <UserRow user={users.creator} isCreator />
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Typography sx={{ color: "text.secondary", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Участники · {users.members.length}
              </Typography>
              {isCreator && (
                <Button
                  type="button"
                  size="small"
                  startIcon={<AddRoundedIcon />}
                  onClick={unavailable("добавления пользователя")}
                  sx={{ borderRadius: "10px", textTransform: "none" }}
                >
                  Добавить
                </Button>
              )}
            </Box>
            {users.members.length > 0 ? (
              <Stack divider={<Divider flexItem />} sx={{ mt: 0.5 }}>
                {users.members.map((user) => (
                  <UserRow
                    key={`${user.name}-${user.hash}`}
                    user={user}
                    canManage={isCreator}
                  />
                ))}
              </Stack>
            ) : (
              <Typography sx={{ py: 3, color: "text.secondary", fontSize: 14, textAlign: "center" }}>
                В группе пока нет других участников
              </Typography>
            )}
          </>
        ) : (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 650 }}>Список участников пока недоступен</Typography>
            <Typography sx={{ mt: 0.75, color: "text.secondary", fontSize: 14 }}>
              Данные появятся здесь после загрузки информации о группе.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          pt: 2,
          pb: { xs: 2.5, sm: 3.5 },
          justifyContent: isCreator ? "flex-end" : "space-between",
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
        {!isCreator && (
          <Button
            type="button"
            color="error"
            startIcon={<LogoutRoundedIcon />}
            onClick={unavailable("выхода из группы")}
          >
            Выйти из группы
          </Button>
        )}
        <Button type="button" variant="outlined" onClick={onClose}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default GroupMembersDialog;
