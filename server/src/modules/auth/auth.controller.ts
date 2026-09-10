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
      if (
        ["Invalid email", "Invalid password for this email"].includes(
          error.message,
        )
      ) {
        res.status(401).send(error.message);
        return;
      }
      res.status(500).send(error.message);
    }

    res.status(500).send("Unknown internal Server error");
  }
}

export async function refreshTokensRequest(
  req: Request,
  res: LoginUserResponseDTO,
): Promise<void> {
  try {
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

    res.status(200).json({
      accessToken,
    });
  } catch {
    res.status(401).send("Invalid refresh token");
  }
}

export async function logoutUserRequest(
  req: Request,
  res: Response,
): Promise<void> {
  try {
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
  } catch {
    res.status(500).send("Internal Server Error");
  }
}

export async function revokeAllUserRefreshRequest(
  req: Request,
  res: Response,
): Promise<void> {
  try {
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
  } catch {
    res.status(500).send("Internal Server Error");
  }
}

export async function getUserDataRequest(
  req: GetUserDataRequestDTO,
  res: GetUserDataResponseDTO,
): Promise<void> {
  try {
    const userID = req.userId;

    if (!userID) {
      res.status(401).send("Access token not found");
      return;
    }

    const user = await getUserData(userID);

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Refresh token session not found") {
        res.status(401).send(error.message);
        return;
      }
      res.status(500).send(error.message);
    }

    res.status(500).send("Unknown internal Server error");
  }
}
