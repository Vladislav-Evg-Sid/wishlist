import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Button, Typography } from '@mui/material';

import { type HeaderProp } from '../types/header';

export default function Header({
  userName,
  button,
}: HeaderProp) {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "MidnightBlue",
          padding: "1%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "end",
        }}
      >
        {
          button && <Button
            variant={button.variant}
            onClick={button.onClick}
          >{button.name}</Button>
        }
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "end",
            width: "100%",
          }}
        >
          <AccountCircleIcon fontSize='large'/>
          <Typography>{userName}</Typography>
        </Box>
      </Box>
    </>
  )
}