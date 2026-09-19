import { Grid } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import { useStoreGroups } from "../../../hooks/useStore";
import GridElement from "../../elements/GridElement";

const GroupGrid = observer(() => {
  const groupStore = useStoreGroups();
  const navigate = useNavigate();

  return (
    <Grid container spacing={2.5}>
      {groupStore.groups.map(({ id, title }) => (
        <GridElement
          key={id}
          Icon={GroupsIcon}
          name={title}
          onClick={() => navigate(`/group/${id}`)}
        />
      ))}
    </Grid>
  );
});

export default GroupGrid;
