import { Box, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import { Link as RouterLink } from "react-router-dom";

import type {
  SecretSantaTeam,
  SecretSantaTeamStatus,
} from "../../../types/secretSanta";
import { formatDate } from "../../../shared/formatDate";

interface SecretSantaTeamGridProps {
  teams: SecretSantaTeam[];
}

const statusPresentation: Record<
  SecretSantaTeamStatus,
  { label: string; color: string; backgroundColor: string }
> = {
  "pairs-ready": {
    label: "Пары готовы",
    color: "#16634B",
    backgroundColor: "#EAF8F2",
  },
  "collecting-members": {
    label: "Сбор участников",
    color: "#8B6216",
    backgroundColor: "#FFF8DF",
  },
};

function getMembersLabel(count: number) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} участников`;
  if (lastDigit === 1) return `${count} участник`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${count} участника`;
  return `${count} участников`;
}

export default function SecretSantaTeamGrid({
  teams,
}: SecretSantaTeamGridProps) {
  return (
    <Box component="section" aria-labelledby="secret-santa-teams-title">
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <Box
          aria-hidden="true"
          sx={{
            width: 34,
            height: 34,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            borderRadius: "10px",
            color: "primary.main",
            bgcolor: "#EDF4FF",
          }}
        >
          <CardGiftcardRoundedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography
          id="secret-santa-teams-title"
          component="h2"
          sx={{ fontSize: 15, fontWeight: 750 }}
        >
          Ваши команды
        </Typography>
        <Box
          aria-hidden="true"
          sx={{ flex: 1, height: 1, ml: 0.5, bgcolor: "#E2E8F0" }}
        />
      </Box>

      <Box
        aria-label="Команды Тайного Санты"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 2,
        }}
      >
        {teams.map((team) => {
          const status = statusPresentation[team.status];

          return (
            <Box
              key={team.id}
              component={RouterLink}
              to={`/secret-santa/${team.id}`}
              sx={{
                minHeight: 158,
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: 2,
                boxSizing: "border-box",
                p: 2.5,
                border: "1px solid #E2E8F0",
                borderRadius: "18px",
                color: "text.primary",
                bgcolor: "background.paper",
                textDecoration: "none",
                boxShadow: "0 3px 12px rgba(15,23,42,0.025)",
                transition:
                  "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
                "&:hover": {
                  borderColor: "primary.light",
                  boxShadow: "0 12px 28px rgba(0,71,171,0.09)",
                  transform: "translateY(-2px)",
                },
                "&:focus-visible": {
                  outline: "3px solid rgba(0,71,171,0.25)",
                  outlineOffset: 2,
                },
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Box
                  sx={{
                    minHeight: 27,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    width: "fit-content",
                    px: 1.1,
                    py: 0.5,
                    borderRadius: 99,
                    color: status.color,
                    bgcolor: status.backgroundColor,
                    fontSize: 12,
                    fontWeight: 760,
                  }}
                >
                  <Box
                    component="span"
                    aria-hidden="true"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "currentColor",
                    }}
                  />
                  {status.label}
                </Box>
                <Typography
                  component="h3"
                  sx={{ mt: 2, mb: 0.5, fontSize: 16, fontWeight: 700 }}
                >
                  {team.title}
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                  {getMembersLabel(team.membersCount)}
                </Typography>
                <Typography sx={{ mt: 1.75, fontSize: 12, fontWeight: 750 }}>
                  Вручение: {formatDate(team.deliveryDate)}
                </Typography>
              </Box>
              <Box
                aria-hidden="true"
                sx={{
                  width: 35,
                  height: 35,
                  display: "grid",
                  placeItems: "center",
                  alignSelf: "end",
                  borderRadius: "50%",
                  color: "primary.main",
                  bgcolor: "#EDF4FF",
                }}
              >
                <ArrowForwardRoundedIcon sx={{ fontSize: 19 }} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
