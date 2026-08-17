import { type Response } from "express";

import {
  type GroupData,
  type GetUserRequst as GetUserGroupsRequest,
} from "./groups.types.js";

export function getUserGroups(
  req: GetUserGroupsRequest,
  res: Response<GroupData[]>,
): void {
  res.json([
    {
      id: "123",
      name: "Группа 1",
    },
    {
      id: "124",
      name: "Группа 2",
    },
    {
      id: "125",
      name: "Группа 3",
    },
    {
      id: "126",
      name: "Группа 4",
    },
    {
      id: "127",
      name: "Группа 5",
    },
    {
      id: "128",
      name: "Группа 6",
    },
  ]);
}
