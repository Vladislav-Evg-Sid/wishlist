import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite/src/observer.js";
import { Box, Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

import CreateWishlistDialog from "../../elements/CreateWishlistDialog";
import GroupMembersDialog from "../../elements/GroupMembersDialog";
import { useStoreWishlists } from "../../../hooks/useStore";

const WishlistHeader = observer(() => {
  const wishlistStore = useStoreWishlists();
  const [isCreateWishlistOpen, setIsCreateWishlistOpen] =
    useState<boolean>(false);
  const [isMembersOpen, setIsMembersOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <Box component="header" sx={{ mb: { xs: 4, md: 5 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: { xs: 2.5, md: 3 } }}>
        <Tooltip title="Вернуться назад">
          <IconButton
            type="button"
            aria-label="Назад"
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
        <Typography sx={{ color: "text.secondary", fontSize: 14, fontWeight: 600 }}>
          Мои группы
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
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
            {wishlistStore.parantGroupTitle ||
              "Не удалось загрузить название группы"}
          </Typography>
          {wishlistStore.isParantGroupCreator && (
            <Tooltip title="Изменить название группы">
              <IconButton
                type="button"
                aria-label="Изменить название группы"
                onClick={() => alert("Функция изменения названия группы пока не доступна")}
                sx={{ flexShrink: 0, color: "text.secondary" }}
              >
                <EditRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.25}
          sx={{ width: { xs: "100%", md: "auto" }, flexShrink: 0 }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={() => setIsMembersOpen(true)}
            startIcon={<GroupRoundedIcon />}
            sx={{
              borderRadius: "12px",
              px: 2.25,
              py: 1.35,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            Участники
          </Button>
          <Button
            type="button"
            variant="contained"
            disableElevation
            onClick={() => setIsCreateWishlistOpen(true)}
            startIcon={<PlaylistAddIcon />}
            sx={{
              borderRadius: "12px",
              px: 2.5,
              py: 1.35,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            Добавить вишлист
          </Button>
        </Stack>
      </Box>
      <CreateWishlistDialog
        open={isCreateWishlistOpen}
        onClose={() => setIsCreateWishlistOpen(false)}
      />
      <GroupMembersDialog
        open={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
      />
    </Box>
  );
});

export default WishlistHeader;
