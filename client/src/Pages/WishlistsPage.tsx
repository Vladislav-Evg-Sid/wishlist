import { Box, Button, Grid, Typography } from "@mui/material";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import { ArrowBack } from "@mui/icons-material";
import ViewListIcon from "@mui/icons-material/ViewList";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { observer } from "mobx-react-lite/src/observer.js";

import GridElement from "../components/elements/GridElement";
import { useNavigate, useParams } from "react-router-dom";
import { useStoreWishlists } from "../hooks/useStore";
import SideBar from "../components/elements/Sidebar";
import { WishlistStoreProvider } from "../providers/storeProvider";

const WishlistGrid = observer(() => {
  const wislistStore = useStoreWishlists();
  const navigate = useNavigate();

  return (
    <Grid container spacing={2.5}>
      {wislistStore.wishlists.map(({ id, title }) => (
        <GridElement
          key={id}
          Icon={ViewListIcon}
          name={title}
          onClick={() => navigate(`/group/wishlist/${id}`)}
        />
      ))}
    </Grid>
  );
});

const WishlistPage = observer(() => {
  const { groupID } = useParams();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        minHeight: "100svh",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "clamp(220px, 20vw, 300px)" },
          flexShrink: 0,
          "@media (max-width: 599.95px)": {
            "& > div": { height: "auto", p: 2, gap: 2 },
            "& > div > div:first-of-type": {
              display: "flex",
              alignItems: "center",
              gap: 2,
            },
            "& img": { maxWidth: "48px !important" },
            "& h4": { fontSize: 24 },
          },
        }}
      >
        <SideBar />
      </Box>
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          px: { xs: 2.5, md: 5, lg: 7 },
          py: { xs: 4, md: 6 },
        }}
      >
        <WishlistStoreProvider groupID={groupID ?? ""}>
          <Box sx={{ maxWidth: 1360, mx: "auto" }}>
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
                  Сюда вставить название группы
                </Typography>
                <Button
                  type="button"
                  variant="contained"
                  disableElevation
                  // onClick={() => setIsCreateGroupOpen(true)}
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
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}
            >
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
            <WishlistGrid />
            {/* <CreateGroupDialog
              open={isCreateGroupOpen}
              onClose={() => setIsCreateGroupOpen(false)}
            /> */}
          </Box>
        </WishlistStoreProvider>
      </Box>
    </Box>
  );
});

export default WishlistPage;
