import express from "express";

import { getGroupWishlistRequest } from "./wishlists.controller.js";

const wishlistRouter = express.Router();

wishlistRouter.get("/:groupID", getGroupWishlistRequest);
// wishlistRouter.post("/:groupID", addWishlist);

export default wishlistRouter;
