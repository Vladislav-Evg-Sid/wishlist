import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";

import LoadingPage from "../Pages/LoadingPage";

const InviteGroupProvider = observer(() => {
  const { inviteCode } = useParams();

  return <LoadingPage text={`Подключение к группе через код: ${inviteCode}`} />;
});

export default InviteGroupProvider;
