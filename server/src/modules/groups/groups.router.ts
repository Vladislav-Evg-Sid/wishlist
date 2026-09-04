import express from "express";

import { getUserGroups } from "./groups.controller.js";

const groupRouter = express.Router();

groupRouter.get("/:userID", getUserGroups);

export default groupRouter;
