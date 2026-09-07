import type { Response } from "express";

import type { CreateUserRequestDTO } from "./auth.dto.js";
import { registerUser } from "./auth.service.js";

export async function registerUserRequest(
  req: CreateUserRequestDTO,
  res: Response,
): Promise<void> {
  try {
    const { accessToken, refreshToken } = await registerUser(
      req.body.email,
      req.body.username,
      req.body.password,
      req.get("user-agent"),
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(201).json({
      accessToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User with this email already exists") {
        res.status(409).send(error.message);
        return;
      }
      res.status(500).send(error.message);
    }
    res.status(500).send("Unknown internal Server error");
    return;
  }
}
