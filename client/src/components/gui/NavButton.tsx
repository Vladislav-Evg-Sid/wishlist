import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";

interface NavButtonProps {
  to: string;
  text: string;
}

export function NavButton({ to, text }: NavButtonProps) {
  return (
    <Box
      component={NavLink}
      to={to}
      sx={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        minHeight: 48,
        my: 0.2,
        px: 2,
        color: "rgba(255, 255, 255, 0.82)",
        fontSize: "0.95rem",
        fontWeight: 500,
        textAlign: "left",
        textDecoration: "none",
        borderRadius: 2,
        borderLeft: "4px solid transparent",
        transition:
          "background-color 160ms ease, color 160ms ease, transform 160ms ease",
        "&:hover": {
          color: "background.paper",
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          transform: "translateX(2px)",
        },
        "&:focus-visible": {
          outline: "2px solid background.paper",
          outlineOffset: 2,
        },
        "&.active": {
          color: "primary.main",
          backgroundColor: "background.paper",
          borderLeftColor: "primary.light",
          fontWeight: 700,
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.16)",
        },
      }}
    >
      {text}
    </Box>
  );
}
