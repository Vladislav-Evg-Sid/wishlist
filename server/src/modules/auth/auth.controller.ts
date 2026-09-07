import type { Response } from "express";

import type {
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  LoginUserRequestDTO,
  LoginUserResponseDTO,
} from "./auth.dto.js";
import { loginUser, registerUser } from "./auth.service.js";
import { config } from "../../config/env.js";

export async function registerUserRequest(
  req: CreateUserRequestDTO,
  res: CreateUserResponseDTO,
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
      secure: config.nodeEnv === "prod",
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

export async function loginUserRequest(
  req: LoginUserRequestDTO,
  res: LoginUserResponseDTO,
): Promise<void> {
  try {
    const { accessToken, refreshToken } = await loginUser(
      req.body.email,
      req.body.password,
      req.get("user-agent"),
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "prod",
      sameSite: "strict",
    });

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Invalid email or password") {
        res.status(401).send(error.message);
        return;
      }
      res.status(500).send(error.message);
    }

    res.status(500).send("Unknown internal Server error");
  }
}
