import { Box, Button, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface SecretSantaBannerProps {
  onCreateTeam: () => void;
}

export default function SecretSantaBanner({
  onCreateTeam,
}: SecretSantaBannerProps) {
  return (
    <Box
      component="header"
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: 188,
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        gap: 3,
        mb: 2.5,
        px: { xs: 3, sm: 4.5 },
        py: { xs: 3.5, sm: 4 },
        borderRadius: { xs: "20px", sm: "25px" },
        color: "common.white",
        background:
          "linear-gradient(125deg, #083B82 0%, #0047AB 56%, #2873CE 100%)",
        boxShadow: "0 16px 36px rgba(0,71,171,0.15)",
        "&::before": {
          content: '""',
          position: "absolute",
          right: -40,
          bottom: -100,
          width: 260,
          height: 260,
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "50%",
          boxShadow: "0 0 0 38px rgba(255,255,255,0.035)",
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          sx={{
            mb: 1,
            color: "#BFDBFE",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
          }}
        >
          Праздничные команды
        </Typography>
        <Typography
          component="h1"
          sx={{
            m: 0,
            fontSize: { xs: 32, sm: 38, md: 43 },
            fontWeight: 750,
            letterSpacing: "-0.05em",
            lineHeight: 1.08,
          }}
        >
          Тайный Санта
        </Typography>
        <Typography
          sx={{ mt: 1.25, color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}
        >
          Следите за подготовкой и не пропускайте важные даты.
        </Typography>
      </Box>
      <Button
        type="button"
        variant="contained"
        disableElevation
        startIcon={<AddRoundedIcon />}
        onClick={onCreateTeam}
        sx={{
          position: "relative",
          zIndex: 1,
          width: { xs: "100%", sm: "auto" },
          flexShrink: 0,
          minHeight: 46,
          px: 2.5,
          borderRadius: "12px",
          color: "primary.main",
          bgcolor: "common.white",
          textTransform: "none",
          fontSize: 14,
          fontWeight: 750,
          whiteSpace: "nowrap",
          "&:hover": { bgcolor: "#F1F6FD" },
        }}
      >
        Создать команду
      </Button>
    </Box>
  );
}
