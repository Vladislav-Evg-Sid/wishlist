import express from "express";
import swaggerUi from "swagger-ui-express";
import { logger } from "./middleware/logger.js";
import userRouter from "./modules/users/user.router.js";
import { swaggerSpec } from "./swagger.js";

const PORT = 8000

const app = express();

app.use(
  express.json(),
  logger,
);

app.use("/user", userRouter)

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});


app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);