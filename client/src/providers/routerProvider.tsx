import { Route, Routes } from "react-router-dom";
import WishlistsPage from "../Pages/WishlistsPage";
import GroupsPage from "../Pages/GroupsPage";

/*export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <>Авторизация. Доделать</>,
  },
  {
    path: "/",
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
      <Route path="/auth" element={<>Авторизация. Доделать</>} />
      <Route path="/" element={<GroupsPage />} />
      <Route path="/group/:groupID" element={<WishlistsPage />} />
    </Routes>
  );
}
