import { Grid, Typography } from "@mui/material"
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';

import getWishlistsByGroup from "../api/wishlists"
import GridElement from "../components/gridElement"
import { type WishlistsProps } from "../types/mainUI"
import { type Wishlist } from "../types/wishlists";
import { useEffect, useState } from "react";
import Header from "../components/header";

export default function Wishlists({
  user,
  group,
  dispatchUI,
}: WishlistsProps) {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  
  useEffect(() => {
    if (!group) {
      return
    }
    const wishlistsData = getWishlistsByGroup(group.id);
    setWishlists(wishlistsData)
  }, [group])
  
  return (
    <>
      <Header
        userName={user.name}
        button={{
          name: "Назад",
          variant: "contained",
          onClick: () => dispatchUI({ type: "goBack" })
        }}
      />
      <Typography variant="h3">{group ? group.name : "Неизвестная группа"}</Typography>
      <Grid container>
        {
          wishlists.map(
            (wishlist) => <GridElement
              key={wishlist.id}
              Icon={FeaturedPlayListIcon}
              name={wishlist.name}
              onClick={() => dispatchUI({
                type: "goForvard",
                parantElement: wishlist,
              })}
            />
          )
        }
      </Grid>
    </>
  )
}