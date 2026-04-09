import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { OrderRepository } from './repositories/order.repository';
import { Order, OrderSchema } from './schemas/order.schema';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';

import { TOKENS } from '../../shared/constants/tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: TOKENS.ORDER_REPOSITORY,
      useClass: OrderRepository,
    },
    {
      provide: TOKENS.ORDER_SERVICE,
      useClass: OrderService,
    },
  ],
  exports: [TOKENS.ORDER_SERVICE, TOKENS.ORDER_REPOSITORY],
})
export class OrderModule {}
