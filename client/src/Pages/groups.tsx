import { Grid, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import { observer } from "mobx-react-lite/src/observer.js";
import { useNavigate } from "react-router-dom";

import GridElement from "../components/elements/GridElement";
import { useStore } from "../hooks/useStore";

const Groups = observer(() => {
  const { groupStore } = useStore();
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h3">Доступные группы</Typography>
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
    </>
  );
});

export default Groups;
