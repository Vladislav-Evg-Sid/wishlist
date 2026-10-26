import { Box } from "@mui/material";
import { useState } from "react";
import { observer } from "mobx-react-lite";

import SideBar from "../components/elements/Sidebar";
import CreateSecretSantaTeamDialog from "../components/elements/CreateSecretSantaTeamDialog";
import SecretSantaBanner from "../components/layout/secretSanta/SecretSantaBanner";
import SecretSantaCountdown from "../components/layout/secretSanta/SecretSantaCountdown";
import SecretSantaTeamGrid from "../components/layout/secretSanta/SecretSantaTeamGrid";
import { useStore } from "../hooks/useStore";

const SecretSantaPage = observer(() => {
  const { secretSantaStore } = useStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
        <Box sx={{ maxWidth: 1360, mx: "auto" }}>
          <SecretSantaBanner
            onCreateTeam={() => setIsCreateDialogOpen(true)}
          />
          <SecretSantaCountdown event={secretSantaStore.upcomingEvent} />
          <SecretSantaTeamGrid teams={secretSantaStore.teams} />
          <CreateSecretSantaTeamDialog
            open={isCreateDialogOpen}
            onClose={() => setIsCreateDialogOpen(false)}
          />
        </Box>
      </Box>
    </Box>
  );
});

export default SecretSantaPage;
