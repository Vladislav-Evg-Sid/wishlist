import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { logger } from "./middleware/logger.middleware.js";
import groupRouter from "./modules/groups/groups.router.js";
import wishlistRouter from "./modules/wishlist/wishlists.router.js";
import { swaggerDocument } from "./config/swagger.js";
import { config } from "./config/env.js";
import authRouter from "./modules/auth/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: `http://${config.clientHost}:${config.clientPort}`,
  }),
);

// Midlware
app.use(express.json(), logger);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routers
app.use("/groups", groupRouter);
app.use("/wishlists", wishlistRouter);
app.use("/auth", authRouter);

// 404
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

export default app;
