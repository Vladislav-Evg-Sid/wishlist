import type {
  Request,
  Response,
} from "express";

export function getUser(
  req: Request,
  res: Response,
) {
  const id = req.params.id;

  res.json({
    id,
    name: "Vlad",
  });
}