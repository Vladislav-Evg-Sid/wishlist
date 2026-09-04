import type { Request } from "express";

import type { GroupData } from "./groups.types.js";

export type GetUserGroupsRequstDTO = Request<{ userID: string }, GroupData[]>;
