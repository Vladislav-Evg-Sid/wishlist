import { Route, Routes } from "react-router-dom";
import WishlistsPage from "../Pages/WishlistsPage";
import GroupsPage from "../Pages/GroupsPage";
import AuthPage from "../Pages/AuthPage";
import OrdersPage from "../Pages/OrdersPage";
import InviteGroupProvider from "./inviteGroupProvider";
import { GroupStoreProvider } from "./storeProvider";
import SecretSantaPage from "../Pages/SecretSantaPage";
import SecretSantaTeamPage from "../Pages/SecretSantaTeamPage";
import SecretSantaInviteProvider from "./secretSantaInviteProvider";

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
      <Route path="/group/wishlist/:wishlistID" element={<OrdersPage />} />
      <Route
        path="/invite/:inviteCode"
        element={
          <GroupStoreProvider>
            <InviteGroupProvider />
          </GroupStoreProvider>
        }
      />
      <Route path="secret-santa" element={<SecretSantaPage />} />
      <Route
        path="secret-santa/invite/:inviteCode"
        element={<SecretSantaInviteProvider />}
      />
      <Route path="secret-santa/:teamID" element={<SecretSantaTeamPage />} />
    </Routes>
  );
}
