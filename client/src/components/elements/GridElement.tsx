import {
  Grid,
  Button,
  Box,
  Typography,
  type SvgIconProps,
} from "@mui/material";
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
      size={{
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3,
      }}
    >
      <Button
        onClick={handleClick}
        sx={{
          width: "90%",
        }}
      >
        <Box>
          <Icon sx={{ fontSize: 100 }} />
          <Typography>{name}</Typography>
        </Box>
      </Button>
    </Grid>
  );
}
