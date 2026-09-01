import { Grid, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import { observer } from "mobx-react-lite/src/observer.js";

import GridElement from "../components/gridElement";
import { useStore } from "../hooks/useStore";

const Groups = observer(() => {
  const { groupStore } = useStore();

  return (
    <>
      <Typography variant="h3">Доступные группы</Typography>
      <Grid container>
        {groupStore.groups.map((group) => (
          <GridElement
            key={group.id}
            Icon={GroupsIcon}
            name={group.name}
            // onClick={() => {
            //   dispatchUI({
            //     type: "goForvard",
            //     parantElement: group,
            //   });
            // }}
          />
        ))}
      </Grid>
    </>
  );
});

export default Groups;
