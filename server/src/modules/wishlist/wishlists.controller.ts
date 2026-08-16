import type { Request, Response } from "express";

export function getGroupWishlist(req: Request, res: Response): void {
  const groupID = req.params.id;

  switch (groupID) {
    case "123":
      res.json([
        {
          id: "123",
          name: "Вишлист 1 группы 1",
        },
        {
          id: "124",
          name: "Вишлист 2 группы 1",
        },
      ]);
    case "124":
      res.json([
        {
          id: "125",
          name: "Вишлист 1 группы 2",
        },
      ]);
    default:
      res.json([]);
  }
}
