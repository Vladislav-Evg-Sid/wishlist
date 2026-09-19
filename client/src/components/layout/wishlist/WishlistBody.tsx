import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";

import { useStoreWishlists } from "../../../hooks/useStore";
import GridElement from "../../elements/GridElement";

const WishlistBody = observer(() => {
  const wislistStore = useStoreWishlists();
  const navigate = useNavigate();

  return (
    <Grid container spacing={2.5}>
      {wislistStore.wishlists.map(({ id, title }) => (
        <GridElement
          key={id}
          Icon={ViewListIcon}
          name={title}
          onClick={() =>
            navigate(`/group/wishlist/${id}`, {
              state: { wishlistTitle: title },
            })
          }
        />
      ))}
    </Grid>
  );
});

export default WishlistBody;
