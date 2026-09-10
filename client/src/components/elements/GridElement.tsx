import {
  Grid,
  Button,
  Box,
  Typography,
  type SvgIconProps,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import type { ComponentType } from "react";

export interface GridElementProps {
  Icon: ComponentType<SvgIconProps>;
  name: string;
  onClick?: () => void;
}

export default function GridElement({ Icon, name, onClick }: GridElementProps) {
  function handleClick() {
    if (!onClick) {
      return;
    }
    onClick();
  }

  return (
    <Grid
      size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 3 }}
      sx={{ display: "flex" }}
    >
      <Button
        onClick={handleClick}
        sx={{
          width: "100%",
          minWidth: 0,
          minHeight: 208,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "space-between",
          gap: 3,
          p: 3,
          textAlign: "left",
          textTransform: "none",
          color: "text.primary",
          bgcolor: "background.paper",
          border: "1px solid #E2E8F0",
          borderRadius: "20px",
          boxShadow: "0 3px 12px rgba(15,23,42,0.025)",
          transition:
            "border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
          "&:hover": {
            bgcolor: "background.paper",
            borderColor: "primary.light",
            boxShadow: "0 12px 28px rgba(0,71,171,0.09)",
            transform: "translateY(-3px)",
            "& .group-arrow": { bgcolor: "primary.main", color: "white" },
          },
          "&.Mui-focusVisible": {
            outline: "3px solid",
            outlineColor: "primary.main",
            outlineOffset: 4,
          },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
            "&:hover": { transform: "none" },
          },
        }}
      >
        <Box
          component="span"
          sx={{
            width: 56,
            height: 56,
            display: "grid",
            placeItems: "center",
            borderRadius: "16px",
            bgcolor: "#EDF4FF",
            color: "primary.main",
          }}
        >
          <Icon sx={{ fontSize: 30 }} />
        </Box>
        <Box
          component="span"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: 18,
              fontWeight: 650,
              lineHeight: 1.4,
              letterSpacing: "-0.02em",
              overflowWrap: "anywhere",
            }}
          >
            {name}
          </Typography>
          <Box
            component="span"
            className="group-arrow"
            aria-hidden="true"
            sx={{
              width: 34,
              height: 34,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              bgcolor: "#F1F5F9",
              color: "text.secondary",
            }}
          >
            <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </Button>
    </Grid>
  );
}
