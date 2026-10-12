import { Module } from "@nestjs/common";

import { OrderController } from "./orders.controller.js";
import { OrdersRepository } from "./orders.repository.js";
import { OrdersService } from "./orders.service.js";
import { ORDERS_REPOSITORY, ORDERS_SERVICE } from "./orders.di.js";

@Module({
  controllers: [OrderController],
  providers: [
    { provide: ORDERS_SERVICE, useClass: OrdersService },
    { provide: ORDERS_REPOSITORY, useClass: OrdersRepository },
  ],
})
export class OrdersModule {}
