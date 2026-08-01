import type { ComponentType } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";

export interface GridElementProps {
  Icon: ComponentType<SvgIconProps>;
  name: string;
  onClick?: () => void;
}
