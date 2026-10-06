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
import { validateBody } from "../../middleware/httpValidation.middleware.js";
import { createUserBodySchema, loginUserBodySchema } from "./auth.schemas.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(createUserBodySchema),
  registerUserRequest,
);
authRouter.post("/login", validateBody(loginUserBodySchema), loginUserRequest);
authRouter.post("/refresh", refreshTokensRequest);
authRouter.post("/logout", logoutUserRequest);
authRouter.post("/logout/all-sessions", revokeAllUserRefreshRequest);
authRouter.get("/me", requireAccessToken, getUserDataRequest);

export default authRouter;
