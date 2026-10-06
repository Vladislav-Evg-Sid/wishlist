import express from "express";

import {
  addWishlistRequest,
  getGroupWishlistRequest,
} from "./wishlists.controller.js";
import {
  validateBody,
  validateParams,
} from "../../middleware/httpValidation.middleware.js";
import {
  createWishlistBodySchema,
  getGroupWishlistsParamsSchema,
} from "./wishlists.schemas.js";

const wishlistRouter = express.Router();

wishlistRouter.get(
  "/:group_id",
  validateParams(getGroupWishlistsParamsSchema),
  getGroupWishlistRequest,
);
wishlistRouter.post(
  "/",
  validateBody(createWishlistBodySchema),
  addWishlistRequest,
);

export default wishlistRouter;
