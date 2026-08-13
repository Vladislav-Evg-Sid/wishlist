import type { Request, Response } from "express";

export function getUserGroups(req: Request, res: Response): void {
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
