import { Box, Typography } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import type {
  SecretSantaStage,
  SecretSantaTeamDetails,
} from "../../../types/secretSantaTeam";

interface SecretSantaJourneyProps {
  team: SecretSantaTeamDetails;
}

interface StepPresentation {
  title: string;
  description: string;
}

function formatShortDate(date: Date) {
  // TODO: рассмотреть вариант замены на функцию из shared
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(date);
}

function getStepPresentation(
  step: SecretSantaStage,
  team: SecretSantaTeamDetails,
): StepPresentation {
  if (step === 1) {
    if (team.stage === 1) {
      return { title: "Сбор команды", description: "Ждём всех участников" };
    }
    return { title: "Команда собрана", description: "Жеребьёвка проведена" };
  }

  if (step === 2) {
    if (team.stage < 2) {
      return {
        title: "Подготовка подарков",
        description: "Подготовьте список своих подарков",
      };
    }
    if (team.stage === 2) {
      return {
        title: "Подготовка подарков",
        description:
          "Подготовьте подарок для получателя и редактируйте свой список",
      };
    }
    return {
      title: "Подарок подготовлен",
      description: "Подарок для получателя готов",
    };
  }

  if (step === 3) {
    if (team.stage < 3) {
      return {
        title: "Подготовить подарок",
        description: "Подготовьте подарок для получателя",
      };
    }
    return {
      title: "Подарок подготовлен",
      description: "Не забывайте обновлять список желаний",
    };
  }

  return {
    title: "Вручение подарков",
    description:
      team.stage === 4 ? "Вручите подарок" : formatShortDate(team.deliveryDate),
  };
}

const steps: SecretSantaStage[] = [1, 2, 3, 4];

export default function SecretSantaJourney({ team }: SecretSantaJourneyProps) {
  return (
    <Box
      component="section"
      aria-labelledby="secret-santa-journey-title"
      sx={{
        mb: 2.25,
        px: { xs: 2.5, sm: 3.5 },
        py: 3,
        border: "1px solid #E2E8F0",
        borderRadius: "20px",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          mb: 2.75,
        }}
      >
        <Typography
          id="secret-santa-journey-title"
          component="h2"
          sx={{ fontSize: 16, fontWeight: 700 }}
        >
          Подготовка к вручению
        </Typography>
        <Typography
          sx={{ color: "primary.main", fontSize: 12, fontWeight: 800 }}
        >
          Этап {team.stage} из 4
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
        }}
      >
        {steps.map((step) => {
          const isDone = step < team.stage;
          const isCurrent = step === team.stage;
          const presentation = getStepPresentation(step, team);

          return (
            <Box
              key={step}
              sx={{
                position: "relative",
                display: { xs: "grid", md: "block" },
                gridTemplateColumns: "32px minmax(0, 1fr)",
                columnGap: 1.5,
                pb: { xs: step === 4 ? 0 : 2.25, md: 0 },
                pr: { xs: 0, md: step === 4 ? 0 : 2 },
                "&::after":
                  step === 4
                    ? undefined
                    : {
                        content: '""',
                        position: "absolute",
                        zIndex: 0,
                        bgcolor: isDone ? "primary.main" : "#DBEAFE",
                        left: { xs: 14, md: 33 },
                        top: { xs: 30, md: 14 },
                        bottom: { xs: 0, md: "auto" },
                        right: { xs: "auto", md: 0 },
                        width: { xs: 3, md: "auto" },
                        height: { xs: "auto", md: 3 },
                      },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  width: 30,
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  gridRow: { xs: "1 / span 2", md: "auto" },
                  boxSizing: "border-box",
                  border: "3px solid",
                  borderColor: isDone || isCurrent ? "primary.main" : "#DBEAFE",
                  borderRadius: "50%",
                  color: isDone
                    ? "common.white"
                    : isCurrent
                      ? "primary.main"
                      : "#94A3B8",
                  bgcolor: isDone ? "primary.main" : "background.paper",
                  boxShadow: isCurrent ? "0 0 0 5px #EDF4FF" : "none",
                  fontSize: 10,
                  fontWeight: 850,
                }}
              >
                {isDone ? <CheckRoundedIcon sx={{ fontSize: 16 }} /> : step}
              </Box>
              <Typography
                component="h3"
                sx={{
                  mt: { xs: 0.4, md: 1.6 },
                  mb: 0.5,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {presentation.title}
              </Typography>
              <Typography
                sx={{
                  gridColumn: { xs: 2, md: "auto" },
                  maxWidth: 210,
                  color: "text.secondary",
                  fontSize: 10,
                  lineHeight: 1.4,
                }}
              >
                {presentation.description}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
