import { useEffect } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import { ArrowBack } from "@mui/icons-material";

import GridElement from "../components/elements/GridElement";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../hooks/useStore";

export default function Wishlists() {
  const { groupID } = useParams();
  const { groupStore } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (groupID === undefined) {
      alert("Не обнвружена группа");
      return;
    }
    groupStore.loadGroupWishlist(groupID);
  }, [groupID]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ mr: 1 }}
        >
          Назад
        </Button>
        <Typography variant="h4">{groupStore.currentGroup?.name}</Typography>
      </Box>
      <Grid container>
        {groupStore.currentGroup?.wishlists.map((wishlist) => (
          <GridElement
            key={wishlist.id}
            Icon={FeaturedPlayListIcon}
            name={wishlist.name}
            // onClick={() =>
            //   dispatchUI({
            //     type: "goForvard",
            //     parantElement: wishlist,
            //   })
            // }
          />
        ))}
      </Grid>
    </>
  );
}
