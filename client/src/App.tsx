import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import SideBar from "./components/Sidebar";
import Groups from "./Pages/groups";
import Wishlists from "./Pages/wishlists";
import { useStore } from "./hooks/useStore";
import { useLayoutEffect } from "react";

function App() {
  const { authStore } = useStore();

  useLayoutEffect(() => {
    authStore.authorise();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box
        sx={{
          width: "clamp(220px, 20vw, 300px)",
          flexShrink: 0,
        }}
      >
        <SideBar />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, m: "1%" }}>
        <Routes>
          <Route path="/" element={<Groups />} />
          <Route path="/wishlist" element={<Wishlists />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
