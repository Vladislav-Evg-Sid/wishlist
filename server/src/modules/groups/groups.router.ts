import express from "express";
import { getUserGroups } from "./groups.controller.js";

const groupRouter = express.Router();

/**
 * @openapi
 * /groups:
 *   get:
 *     summary: Получить группы пользователя
 *     responses:
 *       200:
 *         description: Грыппы найдены
 */
groupRouter.get("/", getUserGroups);

export default groupRouter;
