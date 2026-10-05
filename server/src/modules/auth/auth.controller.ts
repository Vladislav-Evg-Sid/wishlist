import type { Request, Response } from "express";

import type {
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  GetUserDataRequestDTO,
  GetUserDataResponseDTO,
  LoginUserRequestDTO,
  LoginUserResponseDTO,
} from "./auth.dto.js";
import {
  getUserData,
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
  revokeAllUserRefresh,
} from "./auth.service.js";
import { config } from "../../config/env.js";

export async function registerUserRequest(
  req: CreateUserRequestDTO,
  res: CreateUserResponseDTO,
): Promise<void> {
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

  res.status(201).send(accessToken);
}

export async function loginUserRequest(
  req: LoginUserRequestDTO,
  res: LoginUserResponseDTO,
): Promise<void> {
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

  res.status(200).send(accessToken);
}

export async function refreshTokensRequest(
  req: Request,
  res: LoginUserResponseDTO,
): Promise<void> {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).send("Refresh token not found");
    return;
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshTokens(refreshToken);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
  });

  res.status(200).send(accessToken);
}

export async function logoutUserRequest(
  req: Request,
  res: Response,
): Promise<void> {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await logoutUser(refreshToken);
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
  });

  res.status(204).send();
}

export async function revokeAllUserRefreshRequest(
  req: Request,
  res: Response,
): Promise<void> {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await revokeAllUserRefresh(refreshToken);
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
  });

  res.status(204).send();
}

export async function getUserDataRequest(
  req: GetUserDataRequestDTO,
  res: GetUserDataResponseDTO,
): Promise<void> {
  const userID = req.userId;

  if (!userID) {
    res.status(401).send("Access token not found");
    return;
  }

  const user = await getUserData(userID);
  res.status(200).json(user);
}
