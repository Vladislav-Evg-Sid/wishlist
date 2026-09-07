import type { Response } from "express";

import type { CreateUserRequestDTO } from "./auth.dto.js";
import { registerUser } from "./auth.service.js";

export async function registerUserRequest(
  req: CreateUserRequestDTO,
  res: Response,
): Promise<void> {
  try {
    await registerUser(req.body.email, req.body.username, req.body.password);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "User with this email already exists"
    ) {
      res.status(409).send(error.message);
      return;
    }
    res.status(500).send("Internal Server error");
    return;
  }
  res.status(201).send("user created");
}
