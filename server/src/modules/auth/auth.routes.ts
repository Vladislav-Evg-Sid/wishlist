import express from "express";

import { loginUserRequest, registerUserRequest } from "./auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerUserRequest);
authRouter.post("/login", loginUserRequest);
authRouter.post("/refresh", loginUserRequest);
authRouter.post("/logout", loginUserRequest);

export default authRouter;
