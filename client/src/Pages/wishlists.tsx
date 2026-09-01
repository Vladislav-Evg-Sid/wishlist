import { Grid, Typography } from "@mui/material";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";

import getWishlistsByGroup from "../api/wishlists";
import GridElement from "../components/gridElement";
import { type WishlistsProps } from "../types/mainUI";
import { type Wishlist } from "../types/wishlists";
import { useEffect, useState } from "react";

export default function Wishlists({ group, dispatchUI }: WishlistsProps) {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);

  useEffect(() => {
    if (!group) {
      return;
    }
    const wishlistsData = getWishlistsByGroup(group.id);
    setWishlists(wishlistsData);
  }, [group]);

  return (
    <>
      <Typography variant="h3">
        {group ? group.name : "Неизвестная группа"}
      </Typography>
      <Grid container>
        {wishlists.map((wishlist) => (
          <GridElement
            key={wishlist.id}
            Icon={FeaturedPlayListIcon}
            name={wishlist.name}
            onClick={() =>
              dispatchUI({
                type: "goForvard",
                parantElement: wishlist,
              })
            }
          />
        ))}
      </Grid>
    </>
  );
}
