import { Box, Typography } from "@mui/material";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";

import WishlistHeader from "./WishlistHeader";
import WishlistBody from "./WishlistBody";

const WishlistMain = () => {
  return (
    <Box sx={{ maxWidth: 1360, mx: "auto" }}>
      <WishlistHeader />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <FeaturedPlayListIcon
          aria-hidden="true"
          sx={{ color: "primary.main", fontSize: 20 }}
        />
        <Typography
          component="h2"
          sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}
        >
          Ваши вишлисты
        </Typography>
        <Box
          aria-hidden="true"
          sx={{ flex: 1, height: "1px", bgcolor: "#E2E8F0", ml: 1 }}
        />
      </Box>
      <WishlistBody />
    </Box>
  );
};

export default WishlistMain;
