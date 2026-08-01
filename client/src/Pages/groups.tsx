import { Grid, Button } from "@mui/material"
import GroupsIcon from '@mui/icons-material/Groups';

import getUserGroups from "../api/groups"
import GridElement from "../components/gridElement"
import { type GroupsProps } from "../types/mainUI"
import { type WishlistGroup } from "../types/groups";
import { useEffect, useState } from "react";

export default function Groups({
  user,
  dispatchUI,
}: GroupsProps) {
  const [groups, setGropus] = useState<WishlistGroup[]>([])
  
  useEffect(() => {
    const groupsData = getUserGroups(user.id);
    setGropus(groupsData)
  }, [user.id])
  
  return (
    <>
      <Button onClick={() => dispatchUI({ type: "goBack" })}>Назад</Button>
      <Grid container>
        {
          groups.map(
            (group) => <GridElement
              key={group.id}
              Icon={GroupsIcon}
              name={group.name}
              onClick={() => dispatchUI({
                type: "goForvard",
                parantID: group.id,
              })}
            />
          )
        }
      </Grid>
    </>
  )
}