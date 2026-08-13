import express from "express";
import { getGroupWishlist } from "./wishlist.controller.js";

const wishlistRouter = express.Router();

/**
 * @openapi
 * /wishlists/{id}:
 *   get:
 *     summary: Получить вишлисты группы
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Группы найдены
 */
wishlistRouter.get("/:id", getGroupWishlist);

export default wishlistRouter;
