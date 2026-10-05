import express, { type Request, type Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";

import { httpLogger } from "./middleware/logger.middleware.js";
import { swaggerDocument } from "./config/swagger.js";
import { config } from "./config/env.js";
import { requireAccessToken } from "./middleware/require-access-token.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import groupRouter from "./modules/groups/groups.router.js";
import wishlistRouter from "./modules/wishlist/wishlists.router.js";
import orderRouter from "./modules/orders/orders.router.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { NotFoundError } from "./shared/errors.js";

const app = express();

app.use(
  cors({
    origin: `http://${config.clientHost}:${config.clientPort}`,
    credentials: true,
  }),
);

// Midlware
app.use(express.json(), cookieParser(), httpLogger);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routers
app.use("/auth", authRouter);
app.use("/groups", requireAccessToken, groupRouter);
app.use("/wishlists", requireAccessToken, wishlistRouter);
app.use("/orders", requireAccessToken, orderRouter);

// Errors
app.use((req, res, next) => {
  next(new NotFoundError("URL not found"));
});
app.use(errorHandler);

export default app;
