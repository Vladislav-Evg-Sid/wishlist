import { randomUUID } from "node:crypto";
import { pinoHttp } from "pino-http";

import { logger } from "../config/logger.js";

export const httpLogger = pinoHttp({
  logger,

  genReqId(req, res) {
    const existingID = req.headers["x-request-id"];

    const requestID =
      typeof existingID === "string" ? existingID : randomUUID();

    res.setHeader("x-request-id", requestID);

    return requestID;
  },

  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
      };
    },

    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});
