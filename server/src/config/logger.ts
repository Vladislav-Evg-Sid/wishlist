import pino from "pino";
import { config } from "./env.js";

export const logger = pino({
  level: config.logLevel,

  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      'res.headers["set-cookie"]',

      "password",
      "accessToken",
      "refreshToken",
    ],
    censor: "[REDACTED]",
  },

  ...(config.nodeEnv === "dev"
    ? {
        transport: {
          target: "pino-pretty",

          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        },
      }
    : {}),
});
