import express from "express";

import {
  loginUserRequest,
  logoutUserRequest,
  refreshTokensRequest,
  registerUserRequest,
} from "./auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerUserRequest);
authRouter.post("/login", loginUserRequest);
authRouter.post("/refresh", refreshTokensRequest);
authRouter.post("/logout", logoutUserRequest);

export default authRouter;
