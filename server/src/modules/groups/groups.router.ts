import express from "express";

import {
  getUserGroupsRequest,
  addGroupRequest,
  getGroupInfoRequest,
  getGroupUsersRequest,
} from "./groups.controller.js";

const groupRouter = express.Router();

groupRouter.get("/", getUserGroupsRequest);
groupRouter.post("/", addGroupRequest);
groupRouter.get("/:groupID", getGroupInfoRequest);
groupRouter.get("/:groupID/users", getGroupUsersRequest);

export default groupRouter;
