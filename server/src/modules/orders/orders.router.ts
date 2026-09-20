import express from "express";
import {
  addCardRequest,
  getWishlistCardsRequest,
} from "./orders.controller.js";

const orderRouter = express.Router();

orderRouter.get("/:wishlistID", getWishlistCardsRequest);
orderRouter.post("/", addCardRequest);

export default orderRouter;
