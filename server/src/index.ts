import express from "express";
import swaggerUi from "swagger-ui-express";
import { logger } from "./middleware/logger.js";
import userRouter from "./modules/users/user.router.js";
import { swaggerSpec } from "./swagger.js";

const PORT = 8000;

const app = express();

// Midlware
app.use(express.json(), logger);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routers
app.use("/user", userRouter);

// 404
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Startup
app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});
