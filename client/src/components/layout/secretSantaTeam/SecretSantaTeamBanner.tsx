import { observer } from "mobx-react-lite";
import { Box, Button, Typography } from "@mui/material";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

import type { SecretSantaTeamDetails } from "../../../types/secretSantaTeam";
import { useStore } from "../../../hooks/useStore";
import { formatDate } from "../../../shared/formatDate";

interface SecretSantaTeamBannerProps {
  onOpenMembers: () => void;
  onDraw: () => void;
  onDissolve: () => void;
}

function getDayLabel(days: number) {
  const lastTwoDigits = days % 100;
  const lastDigit = days % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "дней";
  if (lastDigit === 1) return "день";
  if (lastDigit >= 2 && lastDigit <= 4) return "дня";
  return "дней";
}

function getBannerStatus(team: SecretSantaTeamDetails) {
  switch (team.stage) {
    case 1:
      return "идёт сбор команды";
    case 2:
      return team.isSantaGiftPrepared
        ? "ваш подарок подготовлен"
        : "пары распределены";
    case 3:
      return team.isSantaGiftPrepared
        ? "подарки подготовлены"
        : "подарок подготовлен";
    case 4:
      return "вручите подарок";
  }
}

const SecretSantaTeamBanner = observer(
  ({ onOpenMembers, onDraw, onDissolve }: SecretSantaTeamBannerProps) => {
    const { secretSantaTeamStore } = useStore();
    const countdownText =
      secretSantaTeamStore.daysUntilDelivery < 0
        ? "Вручение уже прошло"
        : secretSantaTeamStore.daysUntilDelivery === 0
          ? "Сегодня вручение"
          : `До вручения ${secretSantaTeamStore.daysUntilDelivery} ${getDayLabel(secretSantaTeamStore.daysUntilDelivery)}`;
    const isTeamCreator =
      secretSantaTeamStore.currentTeamDetails &&
      secretSantaTeamStore.currentTeamDetails.isCreator;
    const teamProgressStage = secretSantaTeamStore.currentTeamDetails
      ? secretSantaTeamStore.currentTeamDetails.stage
      : -1;

    return (
      <Box
        component="header"
        sx={{
          position: "relative",
          overflow: "hidden",
          mb: 2.25,
          px: { xs: 3, md: 4.25 },
          py: { xs: 3.25, md: 3.75 },
          borderRadius: { xs: "20px", md: "23px" },
          color: "common.white",
          background:
            "linear-gradient(125deg, #083B82 0%, #0B58B3 62%, #2776D3 100%)",
          boxShadow: "0 15px 34px rgba(0,71,171,0.14)",
          "&::after": {
            content: '""',
            position: "absolute",
            right: -70,
            top: -120,
            width: 290,
            height: 290,
            boxSizing: "border-box",
            border: "48px solid rgba(255,255,255,0.05)",
            borderRadius: "50%",
            pointerEvents: "none",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                mb: 1,
                color: "#BFDBFE",
                fontSize: 11,
                fontWeight: 850,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {countdownText}
            </Typography>
            <Typography
              component="h1"
              sx={{
                overflowWrap: "anywhere",
                fontSize: { xs: 31, sm: 36, lg: 42 },
                fontWeight: 750,
                letterSpacing: "-0.045em",
                lineHeight: 1.1,
              }}
            >
              {secretSantaTeamStore.currentTeamDetails?.title ??
                "Название команды не обнаружено"}
            </Typography>
            {secretSantaTeamStore.currentTeamDetails && (
              <Typography sx={{ mt: 1, color: "rgba(255,255,255,0.72)" }}>
                {`${formatDate(secretSantaTeamStore.currentTeamDetails.deliveryDate)} · ${getBannerStatus(secretSantaTeamStore.currentTeamDetails)}`}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: { xs: "100%", md: "auto" },
              display: "flex",
              flexWrap: "wrap",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.1,
            }}
          >
            <Button
              type="button"
              startIcon={<GroupsRoundedIcon />}
              onClick={onOpenMembers}
              sx={{
                minHeight: 43,
                px: 2,
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: "11px",
                color: "common.white",
                bgcolor: "rgba(255,255,255,0.08)",
                textTransform: "none",
                fontSize: 13,
                fontWeight: 750,
                whiteSpace: "nowrap",
                "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
              }}
            >
              Все участники ·{" "}
              {secretSantaTeamStore.currentTeamDetails
                ? secretSantaTeamStore.currentTeamDetails.members.members
                    .length + 1
                : "нет данных"}
            </Button>
            {isTeamCreator &&
              (teamProgressStage === 1 ? (
                <Button
                  type="button"
                  variant="contained"
                  disableElevation
                  startIcon={<CasinoRoundedIcon />}
                  onClick={onDraw}
                  sx={{
                    minHeight: 43,
                    px: 2,
                    borderRadius: "11px",
                    color: "primary.main",
                    bgcolor: "common.white",
                    textTransform: "none",
                    fontSize: 13,
                    fontWeight: 750,
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "#F1F6FD" },
                  }}
                >
                  Провести жеребьёвку
                </Button>
              ) : (
                teamProgressStage === 4 && (
                  <Button
                    type="button"
                    startIcon={<DeleteSweepRoundedIcon />}
                    onClick={onDissolve}
                    sx={{
                      minHeight: 43,
                      px: 2,
                      border: "1px solid rgba(255,255,255,0.45)",
                      borderRadius: "11px",
                      color: "common.white",
                      bgcolor: "rgba(255,255,255,0.08)",
                      textTransform: "none",
                      fontSize: 13,
                      fontWeight: 750,
                      whiteSpace: "nowrap",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
                    }}
                  >
                    Распустить команду
                  </Button>
                )
              ))}
          </Box>
        </Box>
      </Box>
    );
  },
);

export default SecretSantaTeamBanner;
