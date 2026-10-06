import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import type z from "zod";

import { UnauthorizedError } from "../../shared/errors.js";
import type { addCardBodySchema } from "./orders.schemas.js";
import type { UUID } from "../../types/shared.js";
import { ORDERS_SERVICE, type OrdersServiceInterface } from "./orders.di.js";

@Controller("orders")
export class OrderController {
  constructor(
    @Inject(ORDERS_SERVICE)
    private readonly ordersService: OrdersServiceInterface,
  ) {}
  // validateParams(getWishlistCardsParamsSchema),
  @Get(":wishlist_id")
  async getWishlistCards(@Param("wishlist_id") wishlistID: UUID) {
    const userID = req.userId;
    if (!userID) {
      throw new UnauthorizedError("");
    }

    return await this.ordersService.getWishlistCards(userID, wishlistID);
  }

  //validateBody(addCardBodySchema)
  @Post()
  async addCardRequest(@Body() cardData: z.output<typeof addCardBodySchema>) {
    const userID = req.userId;
    if (!userID) {
      throw new UnauthorizedError("");
    }

    await this.ordersService.addCard({
      ...cardData,
      creatorID: userID,
    });
    return;
  }
}
