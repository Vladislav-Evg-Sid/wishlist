import { observer } from "mobx-react-lite";

import { useStoreGroups } from "../../../hooks/useStore";
import type { UUID } from "../../../types/shared";
import InviteDialog from "./InviteDialog";

interface InviteMemberDialogProps {
  groupID: UUID;
  open: boolean;
  onClose: () => void;
}

const InviteMemberDialog = observer(
  ({ groupID, open, onClose }: InviteMemberDialogProps) => {
    const groupStore = useStoreGroups();

    return (
      <InviteDialog
        open={open}
        onClose={onClose}
        onCreateInvite={(ttl, inviteLimit) =>
          groupStore.createInviteLink(groupID, ttl, inviteLimit)
        }
      />
    );
  },
);

export default InviteMemberDialog;
