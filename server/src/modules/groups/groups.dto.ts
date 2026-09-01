import type { Request } from "express";

import type { NoParams } from "../../types/requests.js";
import type { GroupData } from "./groups.types.js";

export type GetUserGroupsRequstDTO = Request<NoParams, GroupData[]>;
