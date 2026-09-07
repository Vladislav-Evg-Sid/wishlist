import express from "express";

import { registerUserRequest } from "./auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerUserRequest);

export default authRouter;
