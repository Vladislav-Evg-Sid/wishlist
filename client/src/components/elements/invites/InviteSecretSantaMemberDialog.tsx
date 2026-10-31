import { observer } from "mobx-react-lite";

import { useStore } from "../../../hooks/useStore";
import InviteDialog from "./InviteDialog";

interface InviteSecretSantaMemberDialogProps {
  open: boolean;
  onClose: () => void;
}

const InviteSecretSantaMemberDialog = observer(
  ({ open, onClose }: InviteSecretSantaMemberDialogProps) => {
    const { secretSantaTeamStore } = useStore();

    return (
      <InviteDialog
        open={open}
        onClose={onClose}
        onCreateInvite={(ttl, inviteLimit) =>
          secretSantaTeamStore.createTeamInviteLink(ttl, inviteLimit)
        }
      />
    );
  },
);

export default InviteSecretSantaMemberDialog;
