import type { UUID } from "../types/shared";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import LoadingPage from "../Pages/LoadingPage";
import { useStoreGroups } from "../hooks/useStore";

const pendingInviteRequests = new Map<
  string,
  Promise<UUID | undefined>
>();

const InviteGroupProvider = observer(() => {
  const groupsStore = useStoreGroups();
  const { inviteCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    const handleInvite = async () => {
      const requestKey = inviteCode ?? "";
      let inviteRequest = pendingInviteRequests.get(requestKey);

      if (!inviteRequest) {
        inviteRequest = groupsStore.inviteGroupByLink(inviteCode);
        pendingInviteRequests.set(requestKey, inviteRequest);

        void inviteRequest.then(
          () => {
            if (pendingInviteRequests.get(requestKey) === inviteRequest) {
              pendingInviteRequests.delete(requestKey);
            }
          },
          () => {
            if (pendingInviteRequests.get(requestKey) === inviteRequest) {
              pendingInviteRequests.delete(requestKey);
            }
          },
        );
      }

      const groupID = await inviteRequest;

      if (!isActive) {
        return;
      }

      if (!groupID) {
        toast.info("Не удалось подключиться к группе");
        navigate("/group");
        return;
      }
      navigate(`/group/${groupID}`);
    };

    void handleInvite();

    return () => {
      isActive = false;
    };
  }, [groupsStore, inviteCode, navigate]);

  return <LoadingPage text={"Подключение к группе"} />;
});

export default InviteGroupProvider;
