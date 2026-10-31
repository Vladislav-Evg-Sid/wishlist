import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import {
  useStore,
  useStoreGroups,
  useStoreWishlists,
} from "../../../hooks/useStore";
import type { UserInfo } from "../../../types/shared";
import ConfirmDialog from "../ConfirmDialog";
import InviteMemberDialog from "../invites/InviteMemberDialog";
import MembersDialog from "./MembersDialog";

interface GroupMembersDialogProps {
  open: boolean;
  onClose: () => void;
}

const GroupMembersDialog = observer(
  ({ open, onClose }: GroupMembersDialogProps) => {
    const wishlistStore = useStoreWishlists();
    const groupsStore = useStoreGroups();
    const { userStore } = useStore();
    const users = wishlistStore.parantGroupUsers;
    const isCreator = wishlistStore.isParantGroupCreator;
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [confirmation, setConfirmation] = useState<
      { type: "leave" } | { type: "delete" | "transfer"; user: UserInfo } | null
    >(null);
    const navigate = useNavigate();

    const handleClose = () => {
      setIsInviteDialogOpen(false);
      setConfirmation(null);
      onClose();
    };

    const handleConfirm = async () => {
      if (!confirmation) return;

      setConfirmation(null);
      const groupID = wishlistStore.parantGroupID;

      switch (confirmation.type) {
        case "leave":
          await groupsStore.deleteMember(groupID, userStore.currentUser?.id);
          navigate("/group");
          break;
        case "delete":
          await groupsStore.deleteMember(groupID, confirmation.user.id);
          break;
        case "transfer":
          await groupsStore.changeCreator(groupID, confirmation.user.id);
          break;
      }
    };

    return (
      <>
        <MembersDialog
          open={open}
          title="Участники группы"
          description="Создатель и все участники этой группы"
          creator={users?.creator}
          members={users?.members ?? []}
          creatorTitle="Создатель группы"
          emptyMembersMessage="В группе пока нет других участников"
          unavailableMessage="Данные появятся здесь после загрузки информации о группе."
          onClose={handleClose}
          onInvite={isCreator ? () => setIsInviteDialogOpen(true) : undefined}
          onLeave={
            !isCreator ? () => setConfirmation({ type: "leave" }) : undefined
          }
          leaveLabel="Выйти из группы"
          onRemoveMember={
            isCreator
              ? (user) => setConfirmation({ type: "delete", user })
              : undefined
          }
          onChangeCreator={
            isCreator
              ? (user) => setConfirmation({ type: "transfer", user })
              : undefined
          }
        />
        {confirmation && (
          <ConfirmDialog
            open={open}
            title={
              confirmation.type === "leave"
                ? "Выйти из группы?"
                : confirmation.type === "delete"
                  ? "Удалить участника?"
                  : "Передать роль создателя?"
            }
            informationMessage={
              confirmation.type === "leave"
                ? "Вы уверены, что хотите выйти из группы?"
                : confirmation.type === "delete"
                  ? `Вы уверены, что хотите удалить участника ${confirmation.user.name} из группы?`
                  : `Вы уверены, что хотите передать роль создателя участнику ${confirmation.user.name}? Вы станете обычным участником группы.`
            }
            onClose={() => setConfirmation(null)}
            onConfirm={handleConfirm}
            confirmButtonColor={
              confirmation.type === "leave"
                ? "error"
                : confirmation.type === "delete"
                  ? "error"
                  : "primary"
            }
          />
        )}
        <InviteMemberDialog
          groupID={wishlistStore.parantGroupID}
          open={isInviteDialogOpen}
          onClose={() => setIsInviteDialogOpen(false)}
        />
      </>
    );
  },
);

export default GroupMembersDialog;
