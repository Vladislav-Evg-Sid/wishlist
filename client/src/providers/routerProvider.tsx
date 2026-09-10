import { Route, Routes } from "react-router-dom";
import WishlistsPage from "../Pages/WishlistsPage";
import GroupsPage from "../Pages/GroupsPage";
import AuthPage from "../Pages/AuthPage";

/*export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <>Авторизация. Доделать</>,
  },
  {
    path: "/group",
    element: <GroupsPage />,
  },
  {
    path: "/group/:groupID",
    element: <WishlistsPage />,
  },
  // {
  //   element: <ProtectedRoute />,
  //   children: [],
  // },
]);*/ // TODO Понять, что это

export default function RouteProvider() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage key="login" mode="login" />} />
      <Route
        path="/register"
        element={<AuthPage key="register" mode="register" />}
      />
      <Route path="/group" element={<GroupsPage />} />
      <Route path="/group/:groupID" element={<WishlistsPage />} />
    </Routes>
  );
}
