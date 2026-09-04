import type { Response } from "express";

import type { GroupData } from "./groups.types.js";
import type { GetUserGroupsRequstDTO } from "./groups.dto.js";
import { getGroupsByUserId } from "./groups.repository.js";

export async function getUserGroups(
  req: GetUserGroupsRequstDTO,
  res: Response<GroupData[]>,
): Promise<void> {
  res.json(await getGroupsByUserId(req.params.userID));
}
