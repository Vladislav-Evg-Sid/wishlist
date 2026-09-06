import { Box, Grid, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import { observer } from "mobx-react-lite/src/observer.js";
import { useNavigate } from "react-router-dom";

import GridElement from "../components/elements/GridElement";
import { useStore, useStoreGroups } from "../hooks/useStore";
import { GroupStoreProvider } from "../providers/storeProvider";
import SideBar from "../components/elements/Sidebar";

const GroupGrid = observer(() => {
  const groupStore = useStoreGroups();
  const navigate = useNavigate();

  return (
    <Grid container>
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
  const { userStore } = useStore();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box
        sx={{
          width: "clamp(220px, 20vw, 300px)",
          flexShrink: 0,
        }}
      >
        <SideBar />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, m: "1%" }}>
        <GroupStoreProvider userID={userStore.currentUser?.id ?? ""}>
          <Typography variant="h3">Доступные группы</Typography>
          <GroupGrid />
        </GroupStoreProvider>
      </Box>
    </Box>
  );
});

export default GroupsPage;
