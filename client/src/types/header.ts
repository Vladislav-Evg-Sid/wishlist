import type { ButtonProps } from "@mui/material/Button";

interface HeaderButton {
  name: string;
  variant: NonNullable<ButtonProps["variant"]>;
  onClick: () => void;
}

export interface HeaderProp {
  userName: string;
  button?: HeaderButton;
}
