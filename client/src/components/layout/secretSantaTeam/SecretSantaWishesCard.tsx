import { observer } from "mobx-react-lite";
import { Box, Button, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import type { SecretSantaStage } from "../../../types/secretSantaTeam";
import { useStore } from "../../../hooks/useStore";

interface SecretSantaWishesCardProps {
  onEditWishes: () => void;
}

function getWishesCountLabel(count: number) {
  if (count === 0) return "Подарки не добавлены";

  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} подарков`;
  if (lastDigit === 1) return `${count} подарок`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${count} подарка`;
  return `${count} подарков`;
}

function getWishesHint(stage: SecretSantaStage, isSantaGiftPrepared: boolean) {
  if (stage === 1) return "Ваш Санта ещё не определён";
  return isSantaGiftPrepared
    ? "Ваш Санта уже подготовил подарок"
    : "Ваш Санта уже может их посмотреть";
}

const SecretSantaWishesCard = observer(
  ({ onEditWishes }: SecretSantaWishesCardProps) => {
    const { secretSantaTeamStore } = useStore();
    const hasWishes = secretSantaTeamStore.userWishesCount > 0;

    return (
      <Box
        component="section"
        aria-labelledby="secret-santa-wishes-title"
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            mb: 2.75,
          }}
        >
          <Typography
            id="secret-santa-wishes-title"
            component="h2"
            sx={{ fontSize: 14, fontWeight: 750 }}
          >
            Ваши пожелания
          </Typography>
          <Box
            sx={{
              minHeight: 26,
              display: "inline-flex",
              alignItems: "center",
              px: 1.2,
              py: 0.5,
              borderRadius: 99,
              color: hasWishes ? "#16634B" : "text.secondary",
              bgcolor: hasWishes ? "#EAF8F2" : "#F1F5F9",
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            {getWishesCountLabel(secretSantaTeamStore.userWishesCount)}
          </Box>
        </Box>

        <Box sx={{ my: "auto", mb: 2.5 }}>
          <Typography sx={{ fontSize: 17, fontWeight: 700 }}>
            Помогите вашему Тайному Санте
          </Typography>
          <Typography
            sx={{
              maxWidth: 320,
              mt: 0.75,
              color: "text.secondary",
              fontSize: 11,
              lineHeight: 1.45,
            }}
          >
            {getWishesHint(
              secretSantaTeamStore.currentTeamDetails?.stage ?? 1,
              secretSantaTeamStore.currentTeamDetails?.isSantaGiftPrepared ??
                false,
            )}
          </Typography>
        </Box>

        <Button
          type="button"
          variant="contained"
          disableElevation
          fullWidth
          startIcon={<EditOutlinedIcon />}
          disabled={
            secretSantaTeamStore.currentTeamDetails?.isSantaGiftPrepared ??
            false
          }
          onClick={onEditWishes}
          sx={{
            minHeight: 46,
            mt: "auto",
            borderRadius: "12px",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Изменить список подарков
        </Button>
      </Box>
    );
  },
);

export default SecretSantaWishesCard;
