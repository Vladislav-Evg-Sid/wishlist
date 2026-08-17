import express from "express";

import { getGroupWishlist } from "./wishlists.controller.js";

const wishlistRouter = express.Router();

wishlistRouter.get("/:id", getGroupWishlist);

export default wishlistRouter;
