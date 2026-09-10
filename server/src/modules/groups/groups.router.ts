import express from "express";

import {
  getUserGroupsRequest,
  createGroupRequest,
} from "./groups.controller.js";

const groupRouter = express.Router();

groupRouter.get("/", getUserGroupsRequest);
groupRouter.post("/", createGroupRequest);

export default groupRouter;
