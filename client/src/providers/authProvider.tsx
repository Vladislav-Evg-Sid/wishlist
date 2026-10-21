import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { useStore } from "../hooks/useStore";
import LoadingPage from "../Pages/LoadingPage";

const AuthSession = observer(({ children }: { children: React.ReactNode }) => {
  const { authStore, userStore } = useStore();
  const { pathname } = useLocation();

  useEffect(() => {
    void authStore.authorise();
  }, [authStore]);

  if (!authStore.isAuthInitialized)
    return <LoadingPage text="Получаем данные пользователя…" />;

  const isPublicPage = pathname === "/auth" || pathname === "/register";
  if (!userStore.currentUser && !isPublicPage) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{
          from: location.pathname + location.search + location.hash,
        }}
      />
    );
  }

  return <>{children}</>;
});

export default AuthSession;
