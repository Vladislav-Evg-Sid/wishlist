import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
} from "@nestjs/common";
import type z from "zod";

import {
  getWishlistCardsParamsSchema,
  addCardBodySchema,
  updateCardBopySchema,
  updateCardParamsSchema,
  reserveCardParamsSchema,
  unreserveCardParamsSchema,
  giveCardParamsSchema,
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
  async addCard(
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
  async updateCard(
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
  async deleteCard(
    @Param({ schema: updateCardParamsSchema })
    params: z.output<typeof updateCardParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.ordersService.deleteCard(userID, params.orderID);
  }

  @Patch(":order_id/reserve")
  async reserveCard(
    @Param({ schema: reserveCardParamsSchema })
    params: z.output<typeof reserveCardParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.ordersService.reserveOrder(userID, params.orderID);
  }

  @Patch(":order_id/unreserve")
  async unreserveCard(
    @Param({ schema: unreserveCardParamsSchema })
    params: z.output<typeof unreserveCardParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.ordersService.unReserveOrder(userID, params.orderID);
  }

  @Patch(":order_id/give")
  async giveCard(
    @Param({ schema: giveCardParamsSchema })
    params: z.output<typeof giveCardParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.ordersService.markOrderAsGifted(userID, params.orderID);
  }
}
