import express from "express";
import { getWishlistCardsRequest } from "./orders.controller.js";

const orderRouter = express.Router();

orderRouter.get("/:wishlistID", getWishlistCardsRequest);

export default orderRouter;
