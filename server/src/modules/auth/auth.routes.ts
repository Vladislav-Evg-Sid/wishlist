import express from "express";

import {
  loginUserRequest,
  logoutUserRequest,
  refreshTokensRequest,
  registerUserRequest,
  revokeAllUserRefreshRequest,
  getUserDataRequest,
} from "./auth.controller.js";
import { requireAccessToken } from "../../middleware/require-access-token.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerUserRequest);
authRouter.post("/login", loginUserRequest);
authRouter.post("/refresh", refreshTokensRequest);
authRouter.post("/logout", logoutUserRequest);
authRouter.post("/logout/all-sessions", revokeAllUserRefreshRequest);
authRouter.get("/me", requireAccessToken, getUserDataRequest);

export default authRouter;
