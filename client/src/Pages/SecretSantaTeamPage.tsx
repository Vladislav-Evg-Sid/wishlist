import { useEffect, useState } from "react";
import { Box, Link } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { observer } from "mobx-react-lite";
import {
  Link as RouterLink,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import SideBar from "../components/elements/Sidebar";
import { useStore } from "../hooks/useStore";
import { isUUID } from "../utils/uuid";
import type { SecretSantaTeamDetails } from "../types/secretSantaTeam";
import SecretSantaTeamBanner from "../components/layout/secretSantaTeam/SecretSantaTeamBanner";
import SecretSantaMembersDialog from "../components/elements/SecretSantaMembersDialog";
import ConfirmDialog from "../components/elements/ConfirmDialog";
import SecretSantaJourney from "../components/layout/secretSantaTeam/SecretSantaJourney";

type Confirmation = "draw" | "mark-prepared" | "dissolve" | null;

const confirmationContent: Record<
  Exclude<Confirmation, null>,
  { title: string; message: string; color: "primary" | "error" }
> = {
  draw: {
    title: "Провести жеребьёвку?",
    message:
      "После жеребьёвки каждому участнику будет назначен получатель. Отменить или провести распределение повторно будет нельзя.",
    color: "primary",
  },
  "mark-prepared": {
    title: "Подарок подготовлен?",
    message:
      "После подтверждения изменить этот статус будет нельзя. Убедитесь, что подарок для получателя действительно готов.",
    color: "primary",
  },
  dissolve: {
    title: "Распустить команду?",
    message:
      "Команда и связанные с ней данные будут недоступны участникам. Это действие необратимо.",
    color: "error",
  },
};

const SecretSantaTeamPage = observer(() => {
  const { teamID } = useParams();
  const navigate = useNavigate();
  const { secretSantaTeamStore } = useStore();
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation>(null);
  const [team, setTeam] = useState<SecretSantaTeamDetails>();

  useEffect(() => {
    const handleSetTeam = async () => {
      if (!isUUID(teamID)) {
        return <Navigate to="/secret-santa" replace />;
      }

      await secretSantaTeamStore.changeTeamByID(teamID);

      const currentTeam = secretSantaTeamStore.currentTeamDetails;
      if (!currentTeam) {
        return <Navigate to="/secret-santa" replace />;
      }

      setTeam(currentTeam);
    };
    handleSetTeam();
  }, [teamID]);

  const handleConfirm = () => {
    if (!confirmation) return;
    if (!team) return;

    if (confirmation === "draw") {
      secretSantaTeamStore.drawTeamMembers();
    } else if (confirmation === "mark-prepared") {
      secretSantaTeamStore.markGiftAsPrepared();
    } else if (confirmation === "dissolve") {
      secretSantaTeamStore.dleteTeam();
    }
    setConfirmation(null);
  };

  const activeConfirmation = confirmation
    ? confirmationContent[confirmation]
    : null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        minHeight: "100svh",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "clamp(220px, 20vw, 300px)" },
          flexShrink: 0,
          "@media (max-width: 599.95px)": {
            "& > div": { height: "auto", p: 2, gap: 2 },
            "& > div > div:first-of-type": {
              display: "flex",
              alignItems: "center",
              gap: 2,
            },
            "& img": { maxWidth: "48px !important" },
            "& h4": { fontSize: 24 },
          },
        }}
      >
        <SideBar />
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          px: { xs: 2.5, md: 5, lg: 7 },
          py: { xs: 3.5, md: 5.25 },
        }}
      >
        <Box sx={{ maxWidth: 1360, mx: "auto" }}>
          <Link
            component={RouterLink}
            to="/secret-santa"
            underline="none"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.1,
              mb: 2.75,
              color: "text.secondary",
              fontSize: 13,
              fontWeight: 700,
              "&:hover": { color: "primary.main" },
            }}
          >
            <Box
              component="span"
              sx={{
                width: 34,
                height: 34,
                display: "grid",
                placeItems: "center",
                border: "1px solid #E2E8F0",
                borderRadius: "50%",
                bgcolor: "background.paper",
              }}
            >
              <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
            Все команды
          </Link>

          {team ? (
            <>
              <SecretSantaTeamBanner
                onOpenMembers={() => setIsMembersOpen(true)}
                onDraw={() => setConfirmation("draw")}
                onDissolve={() => setConfirmation("dissolve")}
              />
              <SecretSantaJourney team={team} />
              {/*<Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    lg: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 2.1,
                }}
              >
                <SecretSantaRecipientCard
                  team={team}
                  onViewWishes={() =>
                    alert("Функция просмотра желаний пока не реализована")
                  }
                  onMarkPrepared={() => setConfirmation("mark-prepared")}
                />
                <SecretSantaWishesCard
                  team={team}
                  onEditWishes={() =>
                    alert("Функция изменения списка подарков пока не готова")
                  }
                />
              </Box>*/}
            </>
          ) : (
            <>Добавить анимацию загрузки</> // TODO: Добавить анимацию загрузки
          )}
        </Box>
      </Box>

      {team ? (
        <SecretSantaMembersDialog
          open={isMembersOpen}
          team={team}
          onClose={() => setIsMembersOpen(false)}
          onRemoveMember={(member) =>
            secretSantaTeamStore.removeTeamMember(member.id)
          }
          onLeaveTeam={() => {
            secretSantaTeamStore.leaveTeam();
            setIsMembersOpen(false);
            navigate("/secret-santa");
          }}
        />
      ) : null}
      {activeConfirmation && (
        <ConfirmDialog
          open
          title={activeConfirmation.title}
          informationMessage={activeConfirmation.message}
          confirmButtonColor={activeConfirmation.color}
          onClose={() => setConfirmation(null)}
          onConfirm={handleConfirm}
        />
      )}
    </Box>
  );
});

export default SecretSantaTeamPage;
