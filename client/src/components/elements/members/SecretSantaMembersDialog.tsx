import { useState } from "react";
import { observer } from "mobx-react-lite";

import type { UserInfo } from "../../../types/shared";
import type { SecretSantaTeamDetails } from "../../../types/secretSantaTeam";
import ConfirmDialog from "../ConfirmDialog";
import InviteSecretSantaMemberDialog from "../invites/InviteSecretSantaMemberDialog";
import MembersDialog from "./MembersDialog";

interface SecretSantaMembersDialogProps {
  open: boolean;
  team: SecretSantaTeamDetails;
  onClose: () => void;
  onRemoveMember: (member: UserInfo) => void;
  onLeaveTeam: () => void;
}

const SecretSantaMembersDialog = observer(
  ({
    open,
    team,
    onClose,
    onRemoveMember,
    onLeaveTeam,
  }: SecretSantaMembersDialogProps) => {
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isLeaveConfirmationOpen, setIsLeaveConfirmationOpen] =
      useState(false);
    const [memberToRemove, setMemberToRemove] = useState<UserInfo | null>(null);
    const canRemoveMembers =
      team.isCreator && (team.stage === 1 || team.stage === 4);
    const canCreateInvite = team.isCreator && team.stage === 1;
    const canLeaveTeam =
      !team.isCreator && (team.stage === 1 || team.stage === 4);

    const handleClose = () => {
      setIsInviteOpen(false);
      setIsLeaveConfirmationOpen(false);
      setMemberToRemove(null);
      onClose();
    };

    const handleLeaveConfirm = () => {
      setIsLeaveConfirmationOpen(false);
      onLeaveTeam();
    };

    const handleRemoveConfirm = () => {
      if (!memberToRemove) return;
      onRemoveMember(memberToRemove);
      setMemberToRemove(null);
    };

    return (
      <>
        <MembersDialog
          open={open}
          title="Участники команды"
          description="Создатель и все участники этой команды"
          creator={team.members.creator}
          members={team.members.members}
          creatorTitle="Создатель команды"
          emptyMembersMessage="В команде пока нет других участников"
          unavailableMessage="Данные появятся здесь после загрузки информации о команде."
          showAvatars={false}
          onClose={handleClose}
          onInvite={canCreateInvite ? () => setIsInviteOpen(true) : undefined}
          onLeave={
            canLeaveTeam ? () => setIsLeaveConfirmationOpen(true) : undefined
          }
          leaveLabel="Выйти из команды"
          onRemoveMember={canRemoveMembers ? setMemberToRemove : undefined}
        />
        <InviteSecretSantaMemberDialog
          open={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
        />
        {isLeaveConfirmationOpen && (
          <ConfirmDialog
            open
            title="Выйти из команды?"
            informationMessage="Вы уверены, что хотите выйти из команды Тайного Санты?"
            confirmButtonColor="error"
            onClose={() => setIsLeaveConfirmationOpen(false)}
            onConfirm={handleLeaveConfirm}
          />
        )}
        {memberToRemove && (
          <ConfirmDialog
            open
            title="Удалить участника?"
            informationMessage={`Вы уверены, что хотите удалить участника ${memberToRemove.name} из команды Тайного Санты?`}
            confirmButtonColor="error"
            onClose={() => setMemberToRemove(null)}
            onConfirm={handleRemoveConfirm}
          />
        )}
      </>
    );
  },
);

export default SecretSantaMembersDialog;
