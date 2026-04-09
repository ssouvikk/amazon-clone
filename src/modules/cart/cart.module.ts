import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { CartRepository } from './repositories/cart.repository';
import { Cart, CartSchema } from './schemas/cart.schema';
import { ProductModule } from '../product/product.module';
import { TOKENS } from '../../shared/constants/tokens';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]), ProductModule],
  controllers: [CartController],
  providers: [
    {
      provide: TOKENS.CART_REPOSITORY,
      useClass: CartRepository,
    },
    {
      provide: TOKENS.CART_SERVICE,
      useClass: CartService,
    },
  ],
  exports: [TOKENS.CART_SERVICE, TOKENS.CART_REPOSITORY],
})
export class CartModule {}
