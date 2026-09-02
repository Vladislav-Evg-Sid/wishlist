import "./App.css";
import { useLayoutEffect } from "react";
import { observer } from "mobx-react-lite";
import { Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import SideBar from "./components/elements/Sidebar";
import Groups from "./Pages/GroupsPage";
import Wishlists from "./Pages/WishlistsPage";
import { useStore } from "./hooks/useStore";
import { GroupStoreProvider } from "./context/store.provider";

const App = observer(() => {
  const { authStore, userStore } = useStore();

  useLayoutEffect(() => {
    authStore.authorise();
  }, []);

  if (!authStore.isAuthInitializуed) {
    return <></>; // TODO Возвращать странуца загрузки
  }

  if (!userStore.currentUser) {
    return <Navigate to="/auth" replace />;
  }

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
          <Route path="/auth" element={<>Авторизация. Доделать</>} />
          <Route
            path="/"
            element={
              <GroupStoreProvider userID={userStore.currentUser?.id ?? ""}>
                <Groups />
              </GroupStoreProvider>
            }
          />
          <Route path="/group/:groupID" element={<Wishlists />} />
        </Routes>
      </Box>
    </Box>
  );
});

export default App;
