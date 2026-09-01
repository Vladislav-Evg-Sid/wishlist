import { useReducer } from "react";
import "./App.css";
import { Box } from "@mui/material";
import { type CurrentUI, type ReducerUIAction } from "./types/mainUI";
import { type User } from "./types/user";
import Groups from "./Pages/groups";
import Wishlists from "./Pages/wishlists";
import { Route, Routes } from "react-router-dom";
import SideBar from "./components/Sidebar";

function getNextUI(curUI: CurrentUI, action: ReducerUIAction): CurrentUI {
  switch (curUI.page) {
    case "groups":
      return {
        ...curUI,
        page: "wishlists",
        parantElement: action.parantElement,
      };
    default:
      alert("Невозможно уйти глубже");
      return curUI;
  }
}

function getPrevUI(curUI: CurrentUI, action: ReducerUIAction): CurrentUI {
  switch (curUI.page) {
    case "wishlists":
      return {
        ...curUI,
        page: "groups",
        parantElement: action.parantElement,
      };
    default:
      alert("Невозможно подняться выше");
      return curUI;
  }
}

function App() {
  const [curUI, dispatchUI] = useReducer(reduceCurrentUI, { page: "groups" });

  const user: User = {
    id: "123",
    name: "Владислав",
  };

  function reduceCurrentUI(
    curUI: CurrentUI,
    action: ReducerUIAction,
  ): CurrentUI {
    switch (action.type) {
      case "goForvard":
        return getNextUI(curUI, action);
      case "goBack":
        return getPrevUI(curUI, action);
      default:
        alert("Неизвестное действие");
        return curUI;
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box
        sx={{
          width: "clamp(220px, 20vw, 300px)",
          flexShrink: 0,
        }}
      >
        <SideBar />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Routes>
          <Route
            path="/"
            element={<Groups user={user} dispatchUI={dispatchUI} />}
          />
          <Route
            path="/wishlist"
            element={
              <Wishlists dispatchUI={dispatchUI} group={curUI.parantElement} />
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
