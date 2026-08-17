import { type Request } from "express";

import { type NoParams } from "../../shared/types.js";
import { type GroupData } from "./groups.types.js";

export type GetUserGroupsRequstDTO = Request<NoParams, GroupData[]>;
