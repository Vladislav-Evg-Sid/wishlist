import "./App.css";
import { useLayoutEffect as useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import SideBar from "./components/elements/Sidebar";
import Groups from "./Pages/GroupsPage";
import Wishlists from "./Pages/WishlistsPage";
import { useStore } from "./hooks/useStore";

const App = observer(() => {
  const { authStore, userStore } = useStore();

  // TODO Вынести авторизацию в провайдер AuthSession
  useEffect(() => {
    authStore.authorise();
  }, []);

  if (!authStore.isAuthInitializуed) {
    return <></>; // TODO Возвращать странуца загрузки
  }

  if (!userStore.currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return (
    // TODO Вынести руты в провайдер рутов (смотри комментарий ниже)
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
          <Route path="/" element={<Groups />} />
          <Route path="/group/:groupID" element={<Wishlists />} />
        </Routes>
      </Box>
    </Box>
  );
});

export default App;

/*
import {createBrowserRouter} from "react-router-dom";
import {AuthPage} from "../../modules/auth/pages/AuthPage.tsx";
import {ProtectedRoute} from "./ProtectedRoute.tsx";

export const router = createBrowserRouter([
  {
    path: "/auth/*",
    element: <AuthPage />
  },
  {
    element: <ProtectedRoute />,
    children: [],
  }
])
*/
