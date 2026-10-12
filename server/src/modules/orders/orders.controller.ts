import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import type z from "zod";

import {
  getWishlistCardsParamsSchema,
  addCardBodySchema,
  updateCardBopySchema,
  updateCardParamsSchema,
} from "./orders.schemas.js";
import { ORDERS_SERVICE, type OrdersServiceInterface } from "./orders.di.js";
import { CurrentUserID } from "../auth/decorator/currentUserID.decorator.js";
import type { UUID } from "../../types/shared.js";

@Controller("orders")
export class OrderController {
  constructor(
    @Inject(ORDERS_SERVICE)
    private readonly ordersService: OrdersServiceInterface,
  ) {}

  @Get(":wishlist_id")
  async getWishlistCards(
    @Param({ schema: getWishlistCardsParamsSchema })
    params: z.output<typeof getWishlistCardsParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    return await this.ordersService.getWishlistCards(userID, params.wishlistID);
  }

  @Post()
  async addCardRequest(
    @Body({ schema: addCardBodySchema })
    cardData: z.output<typeof addCardBodySchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.ordersService.addCard({
      ...cardData,
      creatorID: userID,
    });
    return;
  }

  @Put(":order_id")
  async updateCardRequest(
    @Body({ schema: updateCardBopySchema })
    cardData: z.output<typeof updateCardBopySchema>,
    @Param({ schema: updateCardParamsSchema })
    params: z.output<typeof updateCardParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.ordersService.updateCard(userID, {
      ...cardData,
      id: params.orderID,
    });
  }

  @Delete(":order_id")
  async deleteCardRequest(
    @Param({ schema: updateCardParamsSchema })
    params: z.output<typeof updateCardParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.ordersService.deleteCard(userID, params.orderID);
  }
}
