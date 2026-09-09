import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import logoCompany from "../../assets/react.svg";
import { NavButton } from "../gui/NavButton";
import { useStore } from "../../hooks/useStore";
import { APP_NAME } from "../../env";

const SideBar = observer(() => {
  const navigate = useNavigate();
  const { authStore } = useStore();

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "primary.main",
        width: "100%",
        height: "100svh",
        boxSizing: "border-box",
      }}
    >
      <Box>
        <img
          src={logoCompany}
          alt="Company Logo"
          style={{ width: "100%", maxWidth: 300, cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
        <Typography variant="h4" sx={{ color: "background.paper" }}>
          {APP_NAME}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          width: "90%",
        }}
      >
        <NavButton to="/" text="Группы" />
      </Box>
      <Box
        onClick={() => authStore.authorise()}
        sx={{
          justifySelf: "end",
        }}
      >
        {authStore.isAuthorised || <Button variant="contained">Войти</Button>}
      </Box>
    </Box>
  );
});

export default SideBar;
