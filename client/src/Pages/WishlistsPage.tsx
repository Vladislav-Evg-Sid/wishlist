import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Box } from "@mui/material";

import SideBar from "../components/elements/Sidebar";
import { WishlistStoreProvider } from "../providers/storeProvider";
import WishlistMain from "../components/layout/wishlist/WishlistMain";

const WishlistPage = observer(() => {
  const { groupID } = useParams();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        minHeight: "100svh",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "clamp(220px, 20vw, 300px)" },
          flexShrink: 0,
          "@media (max-width: 599.95px)": {
            "& > div": { height: "auto", p: 2, gap: 2 },
            "& > div > div:first-of-type": {
              display: "flex",
              alignItems: "center",
              gap: 2,
            },
            "& img": { maxWidth: "48px !important" },
            "& h4": { fontSize: 24 },
          },
        }}
      >
        <SideBar />
      </Box>
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          px: { xs: 2.5, md: 5, lg: 7 },
          py: { xs: 4, md: 6 },
        }}
      >
        <WishlistStoreProvider groupID={groupID ?? ""}>
          <WishlistMain />
        </WishlistStoreProvider>
      </Box>
    </Box>
  );
});

export default WishlistPage;
