import express from "express";

import {
  getUserGroupsRequest,
  addGroupRequest,
  getGroupInfoRequest,
  getGroupUsersRequest,
} from "./groups.controller.js";
import {
  validateBody,
  validateParams,
} from "../../middleware/httpValidation.middleware.js";
import {
  createGroupBodySchema,
  getGroupInfoParamsSchema,
} from "./groups.schemas.js";

const groupRouter = express.Router();

groupRouter.get("/", getUserGroupsRequest);
groupRouter.post("/", validateBody(createGroupBodySchema), addGroupRequest);
groupRouter.get(
  "/:group_id",
  validateParams(getGroupInfoParamsSchema),
  getGroupInfoRequest,
);
groupRouter.get(
  "/:group_id/users",
  validateParams(getGroupInfoParamsSchema),
  getGroupUsersRequest,
);

export default groupRouter;
