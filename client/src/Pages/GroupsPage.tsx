import { Box, Button, Grid, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { observer } from "mobx-react-lite/src/observer.js";
import { useNavigate } from "react-router-dom";

import GridElement from "../components/elements/GridElement";
import { useStoreGroups } from "../hooks/useStore";
import { GroupStoreProvider } from "../providers/storeProvider";
import SideBar from "../components/elements/Sidebar";

const GroupGrid = observer(() => {
  const groupStore = useStoreGroups();
  const navigate = useNavigate();

  return (
    <Grid container spacing={2.5}>
      {Array.from(groupStore.groups).map(([groupId, groupName]) => (
        <GridElement
          key={groupId}
          Icon={GroupsIcon}
          name={groupName}
          onClick={() => navigate(`/group/${groupId}`)}
        />
      ))}
    </Grid>
  );
});

const GroupsPage = observer(() => {
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
        <GroupStoreProvider>
          <Box sx={{ maxWidth: 1360, mx: "auto" }}>
            <Box component="header" sx={{ mb: { xs: 4, md: 5 } }}>
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
                  Доступные группы
                </Typography>
                <Button
                  type="button"
                  variant="contained"
                  disableElevation
                  startIcon={<AddRoundedIcon />}
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
                  Добавить группу
                </Button>
              </Box>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}
            >
              <GroupsIcon
                aria-hidden="true"
                sx={{ color: "primary.main", fontSize: 20 }}
              />
              <Typography
                component="h2"
                sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}
              >
                Ваши группы
              </Typography>
              <Box
                aria-hidden="true"
                sx={{ flex: 1, height: "1px", bgcolor: "#E2E8F0", ml: 1 }}
              />
            </Box>
            <GroupGrid />
          </Box>
        </GroupStoreProvider>
      </Box>
    </Box>
  );
});

export default GroupsPage;
