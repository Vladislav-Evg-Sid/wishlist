import { findGroupsByUserId } from "./groups.repository.js";
import type { GroupData } from "./groups.types.js";

export async function getGroupsByUserId(userID: string): Promise<GroupData[]> {
  return findGroupsByUserId(userID);
}
