import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

import type { UpcomingEvent } from "../../../types/secretSanta";
import { useStore } from "../../../hooks/useStore";
import { formatDate } from "../../../shared/formatDate";

interface SecretSantaCountdownProps {
  event: UpcomingEvent | null;
}

const SecretSantaCountdown = observer(
  ({ event }: SecretSantaCountdownProps) => {
    if (!event) return null;
    const { secretSantaStore } = useStore();

    return (
      <Box
        component="section"
        aria-labelledby="secret-santa-next-event"
        sx={{
          mb: 3.5,
          p: { xs: 2.5, sm: 3 },
          border: "1px solid #CFE1F8",
          borderRadius: "19px",
          bgcolor: "#F3F8FF",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "primary.main",
                fontSize: 11,
                fontWeight: 850,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Ближайшее вручение
            </Typography>
            <Typography
              id="secret-santa-next-event"
              component="h2"
              sx={{ mt: 0.75, fontSize: 20, fontWeight: 700 }}
            >
              {event.title}
            </Typography>
          </Box>
          <Box sx={{ flexShrink: 0, textAlign: { xs: "left", sm: "right" } }}>
            <Typography
              component="strong"
              sx={{
                display: "block",
                color: "primary.main",
                fontSize: 28,
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              {}
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 11 }}>
              {secretSantaStore.daysUntilUpcommingDelivery} дней до вручения
            </Typography>
          </Box>
        </Box>

        <Box
          role="progressbar"
          aria-label={`Прогресс мероприятия: ${secretSantaStore.upcomingEventProgress} процентов`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={secretSantaStore.upcomingEventProgress}
          sx={{
            position: "relative",
            height: 8,
            mt: 3,
            mb: 1.25,
            borderRadius: 99,
            bgcolor: "#DCEAFB",
          }}
        >
          <Box
            sx={{
              width: `${secretSantaStore.upcomingEventProgress}%`,
              height: "100%",
              borderRadius: "inherit",
              background: "linear-gradient(90deg, #0047AB, #55A0EE)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: `${secretSantaStore.upcomingEventProgress}%`,
              width: 16,
              height: 16,
              boxSizing: "border-box",
              border: "3px solid white",
              borderRadius: "50%",
              bgcolor: "primary.main",
              boxShadow: "0 0 0 2px #0047AB",
              transform: "translate(-50%, -50%)",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            color: "text.secondary",
          }}
        >
          <Box>
            <Typography
              sx={{ color: "text.primary", fontSize: 11, fontWeight: 700 }}
            >
              {formatDate(event.createdDate)}
            </Typography>
            <Typography sx={{ fontSize: 10 }}>команда создана</Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{ color: "text.primary", fontSize: 11, fontWeight: 700 }}
            >
              {formatDate(event.deliveryDate)}
            </Typography>
            <Typography sx={{ fontSize: 10 }}>вручение подарков</Typography>
          </Box>
        </Box>
      </Box>
    );
  },
);

export default SecretSantaCountdown;
