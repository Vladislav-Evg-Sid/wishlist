import { Box, CircularProgress, Typography } from "@mui/material";
import logoCompany from "../assets/react.svg";

export default function LoadingPage() {
  return (
    <Box
      component="main"
      role="status"
      aria-live="polite"
      aria-busy="true"
      sx={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        textAlign: "center",
        px: 3,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: 88,
          height: 88,
          display: "grid",
          placeItems: "center",
          bgcolor: "primary.main",
          borderRadius: "24px",
          boxShadow: "0 12px 36px rgba(0,71,171,0.16)",
          mb: 3,
        }}
      >
        <Box component="img" src={logoCompany} alt="" sx={{ width: 58 }} />
      </Box>
      <Typography
        component="h1"
        sx={{
          fontSize: 28,
          fontWeight: 700,
          color: "text.primary",
          letterSpacing: "-0.03em",
        }}
      >
        Название
      </Typography>
      <Typography sx={{ color: "text.secondary", mt: 1, mb: 3 }}>
        Получаем данные пользователя…
      </Typography>
      <CircularProgress
        size={26}
        thickness={4}
        aria-label="Загрузка"
        sx={{
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
            "& .MuiCircularProgress-circle": { animation: "none" },
          },
        }}
      />
    </Box>
  );
}
