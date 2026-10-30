import { useEffect, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import LoadingPage from "../Pages/LoadingPage";
import { useStore } from "../hooks/useStore";

export default function SecretSantaInviteProvider() {
  const { inviteCode } = useParams();
  const { secretSantaStore } = useStore();
  const navigate = useNavigate();
  const hasHandledInvite = useRef(false);

  const secretSantaTeamStore = secretSantaStore.teamStore;

  useEffect(() => {
    if (!inviteCode || hasHandledInvite.current) return;

    hasHandledInvite.current = true;
    secretSantaTeamStore.joinTeamByInviteCode(inviteCode);
    navigate("/secret-santa", { replace: true });
  }, [inviteCode, navigate, secretSantaStore]);

  if (!inviteCode) return <Navigate to="/secret-santa" replace />;

  return <LoadingPage text="Подключаем к команде Тайного Санты…" />;
}
