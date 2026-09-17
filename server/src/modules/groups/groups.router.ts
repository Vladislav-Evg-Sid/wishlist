import express from "express";

import {
  getUserGroupsRequest,
  createGroupRequest,
  getGroupInfoRequest,
} from "./groups.controller.js";

const groupRouter = express.Router();

groupRouter.get("/", getUserGroupsRequest);
groupRouter.post("/", createGroupRequest);
groupRouter.get("/:groupID", getGroupInfoRequest);

export default groupRouter;
