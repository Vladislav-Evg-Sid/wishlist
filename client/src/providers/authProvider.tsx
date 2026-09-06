import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useStore } from "../hooks/useStore";
import { observer } from "mobx-react-lite/src/observer.js";

const AuthSession = observer(({ children }: { children: React.ReactNode }) => {
  const { authStore, userStore } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    authStore.authorise();
  }, []);

  if (!authStore.isAuthInitializуed) {
    return <></>; // TODO Возвращать страницу загрузки
  }

  if (!userStore.currentUser) {
    navigate("/auth");
  }

  return <>{children}</>;
});

export default AuthSession;
