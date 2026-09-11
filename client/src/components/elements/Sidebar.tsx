import { Box, Button } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { logoCompany } from "../../env";
import { NavButton } from "../gui/NavButton";
import { logoutUser } from "../../api/auth";

const SideBar = observer(() => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    const fetchLogout = async () => {
      await logoutUser();
      navigate("/auth");
    };
    fetchLogout();
  };

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
          onClick={() => navigate("/group")}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          width: "90%",
        }}
      >
        <NavButton to="/group" text="Группы" />
      </Box>
      <Button
        type="button"
        startIcon={<LogoutRoundedIcon />}
        onClick={handleLogoutClick}
        sx={{
          mt: "auto",
          mb: 2.5,
          width: "90%",
          justifyContent: "flex-start",
          px: 2,
          py: 1.5,
          borderRadius: "12px",
          color: "background.paper",
          border: "1px solid rgba(255,255,255,0.25)",
          textTransform: "none",
          fontSize: 15,
          fontWeight: 500,
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.12)",
            borderColor: "rgba(255,255,255,0.5)",
          },
          "&.Mui-focusVisible": {
            outline: "2px solid white",
            outlineOffset: 3,
          },
        }}
      >
        Выйти
      </Button>
    </Box>
  );
});

export default SideBar;
