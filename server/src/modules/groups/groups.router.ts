import express from "express";

import {
  getUserGroupsRequest,
  addGroupRequest,
  getGroupInfoRequest,
} from "./groups.controller.js";

const groupRouter = express.Router();

groupRouter.get("/", getUserGroupsRequest);
groupRouter.post("/", addGroupRequest);
groupRouter.get("/:groupID", getGroupInfoRequest);

export default groupRouter;
