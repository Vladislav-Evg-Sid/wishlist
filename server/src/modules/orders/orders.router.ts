import express from "express";

import {
  addCardRequest,
  getWishlistCardsRequest,
} from "./orders.controller.js";
import {
  validateBody,
  validateParams,
} from "../../middleware/httpValidation.js";
import {
  addCardBodySchema,
  getWishlistCardsParamsSchema,
} from "./orders.schemas.js";

const orderRouter = express.Router();

orderRouter.get(
  "/:wishlist_id",
  validateParams(getWishlistCardsParamsSchema),
  getWishlistCardsRequest,
);
orderRouter.post("/", validateBody(addCardBodySchema), addCardRequest);

export default orderRouter;
