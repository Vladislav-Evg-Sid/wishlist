import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

const PORT = 8000

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server works",
  });
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Получить пользователя
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Пользователь найден
 */
app.get("/users/:id", (req, res) => {
  res.json({
    id: Number(req.params.id),
    name: "Vlad",
  });
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});


app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);