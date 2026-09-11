import type { ReactNode } from "react";
import { Box } from "@mui/material";

import { logoCompany } from "../env";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100svh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: 220, md: "100svh" },
          p: 4,
          boxSizing: "border-box",
        }}
      >
        {[380, 620, 860].map((size) => (
          <Box
            key={size}
            aria-hidden="true"
            sx={{
              position: "absolute",
              width: size,
              height: size,
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
        ))}
        <Box sx={{ position: "relative", textAlign: "center" }}>
          <Box
            component="img"
            src={logoCompany}
            alt=""
            sx={{ width: { xs: 70, md: 300 }, mb: 2 }}
          />
        </Box>
      </Box>
      <Box
        component="main"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 3, sm: 6 },
          py: { xs: 5, md: 8 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>{children}</Box>
      </Box>
    </Box>
  );
}
