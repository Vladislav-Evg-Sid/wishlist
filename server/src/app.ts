import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { logger } from "./middleware/logger.middleware.js";
import groupRouter from "./modules/groups/groups.router.js";
import wishlistRouter from "./modules/wishlist/wishlists.router.js";
import { swaggerDocument } from "./config/swagger.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// Midlware
app.use(express.json(), logger);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routers
app.use("/groups", groupRouter);
app.use("/wishlists", wishlistRouter);

// 404
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

export default app;
