import express from "express";

import {
  addWishlistRequest,
  getGroupWishlistRequest,
} from "./wishlists.controller.js";

const wishlistRouter = express.Router();

wishlistRouter.get("/:groupID", getGroupWishlistRequest);
wishlistRouter.post("/", addWishlistRequest);

export default wishlistRouter;
