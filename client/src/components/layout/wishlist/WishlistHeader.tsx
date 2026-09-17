import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite/src/observer.js";
import { Box, Button, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

import CreateWishlistDialog from "../../elements/CreateWishlistDialog";
import { useStoreWishlists } from "../../../hooks/useStore";

const WishlistHeader = observer(() => {
  const wishlistStore = useStoreWishlists();
  const [isCreateWishlistOpen, setIsCreateWishlistOpen] =
    useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <Box component="header" sx={{ mb: { xs: 4, md: 5 } }}>
      <Button
        type="button"
        variant="contained"
        disableElevation
        onClick={() => navigate(-1)}
        startIcon={<ArrowBack />}
        sx={{
          flexShrink: 0,
          borderRadius: "12px",
          px: 2.5,
          py: 1.5,
          textTransform: "none",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Назад
      </Button>
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          gap: 2.5,
        }}
      >
        <Typography
          component="h1"
          sx={{
            color: "text.primary",
            fontSize: { xs: 30, md: 40 },
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1.2,
          }}
        >
          {wishlistStore.parantGroupTitle ||
            "Не удалось загрузить название группы"}
        </Typography>
        <Button
          type="button"
          variant="contained"
          disableElevation
          onClick={() => setIsCreateWishlistOpen(true)}
          startIcon={<PlaylistAddIcon />}
          sx={{
            flexShrink: 0,
            borderRadius: "12px",
            px: 2.5,
            py: 1.5,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Добавить вишлист
        </Button>
      </Box>
      <CreateWishlistDialog
        open={isCreateWishlistOpen}
        onClose={() => setIsCreateWishlistOpen(false)}
      />
    </Box>
  );
});

export default WishlistHeader;
