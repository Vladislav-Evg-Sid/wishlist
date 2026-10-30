import { Box, Button, Typography } from "@mui/material";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

import type { SecretSantaTeamDetails } from "../../../types/secretSantaTeam";

interface SecretSantaRecipientCardProps {
  team: SecretSantaTeamDetails;
  onViewWishes: () => void;
  onMarkPrepared: () => void;
}

const actionButtonSx = {
  minHeight: 46,
  borderRadius: "12px",
  textTransform: "none",
  fontSize: 14,
  fontWeight: 700,
} as const;

export default function SecretSantaRecipientCard({
  team,
  onViewWishes,
  onMarkPrepared,
}: SecretSantaRecipientCardProps) {
  const recipient = team.recipient;
  const recipientIsUnknown = team.stage === 1 || !recipient;

  return (
    <Box
      component="section"
      aria-labelledby="secret-santa-recipient-title"
      sx={{
        minHeight: 205,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        p: { xs: 2.5, sm: 2.75 },
        border: "1px solid #E2E8F0",
        borderRadius: "19px",
        bgcolor: "background.paper",
      }}
    >
      {recipientIsUnknown ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.75,
            my: "auto",
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              width: 58,
              height: 58,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              border: "2px dashed #BFDBFE",
              borderRadius: "18px",
              color: "primary.main",
              bgcolor: "#EDF4FF",
            }}
          >
            <HelpOutlineRoundedIcon sx={{ fontSize: 25 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                mb: 0.8,
                color: "primary.main",
                fontSize: 11,
                fontWeight: 850,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
            >
              Ваш получатель
            </Typography>
            <Typography
              id="secret-santa-recipient-title"
              component="h2"
              sx={{ fontSize: 18, fontWeight: 700 }}
            >
              Получатель не определён
            </Typography>
            <Typography sx={{ mt: 0.6, color: "text.secondary", fontSize: 11 }}>
              Имя появится после жеребьёвки
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Box sx={{ my: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.1,
                color: "primary.main",
              }}
            >
              <CardGiftcardRoundedIcon sx={{ fontSize: 17 }} />
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 850,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                }}
              >
                Ваш получатель
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                flexWrap: "wrap",
                gap: 1.1,
              }}
            >
              <Typography
                id="secret-santa-recipient-title"
                component="h2"
                sx={{ fontSize: 22, fontWeight: 750 }}
              >
                {recipient?.name}
              </Typography>
              <Typography
                sx={{ color: "#94A3B8", fontSize: 13, fontWeight: 700 }}
              >
                #{recipient?.hash}
              </Typography>
            </Box>
          </Box>

          {team.stage === 2 && !team.isOwnGiftPrepared ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1.35fr" },
                gap: 1.1,
                mt: 2.75,
              }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={onViewWishes}
                sx={actionButtonSx}
              >
                Посмотреть желания
              </Button>
              <Button
                type="button"
                variant="contained"
                disableElevation
                onClick={onMarkPrepared}
                sx={actionButtonSx}
              >
                Отметить подарок подготовленным
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                minHeight: 46,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mt: 2.75,
                borderRadius: "12px",
                color: "#16634B",
                bgcolor: "#EAF8F2",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              <CheckRoundedIcon sx={{ fontSize: 19 }} />
              Подарок подготовлен
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
