import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import "./index.css";

import { theme } from "./theme/theme.js";
import { RootStoreProvider } from "./providers/storeProvider.js";
import AuthSession from "./providers/authProvider.js";
import RouteProvider from "./providers/routerProvider.js";
import BaseToastContainer from "./providers/toastProvider.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <BaseToastContainer />
        <RootStoreProvider>
          <AuthSession>
            <RouteProvider />
          </AuthSession>
        </RootStoreProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
