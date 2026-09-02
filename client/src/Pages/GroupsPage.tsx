import { Grid, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import { observer } from "mobx-react-lite/src/observer.js";
import { useNavigate } from "react-router-dom";

import GridElement from "../components/elements/GridElement";
import { useStore, useStoreGroups } from "../hooks/useStore";
import { GroupStoreProvider } from "../context/store.provider";

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

const Groups = observer(() => {
  const { userStore } = useStore();

  return (
    <GroupStoreProvider userID={userStore.currentUser?.id ?? ""}>
      <Typography variant="h3">Доступные группы</Typography>
      <GroupGrid />
    </GroupStoreProvider>
  );
});

export default Groups;
