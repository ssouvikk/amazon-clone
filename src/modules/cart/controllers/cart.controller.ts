import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { TOKENS } from '../../../shared/constants/tokens';
import { ICartService } from '../interfaces/cart.service.interface';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    @Inject(TOKENS.CART_SERVICE)
    private readonly cartService: ICartService,
  ) {}

  @Get()
  async getCart(@Req() req: { user: { userId: string } }): Promise<ApiResponse<unknown>> {
    const cart = await this.cartService.getCart(req.user.userId);
    return {
      success: true,
      message: 'Cart retrieved successfully',
      data: cart,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('my-orders')
  async getMyOrders(@Req() req: { user: { userId: string } }): Promise<ApiResponse<unknown>> {
    const cart = await this.cartService.getCart(req.user.userId);
    return {
      success: true,
      message: 'Cart retrieved successfully',
      data: cart,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('items')
  async addToCart(
    @Req() req: { user: { userId: string } },
    @Body() body: { productId: string; quantity: number },
  ): Promise<ApiResponse<unknown>> {
    const cart = await this.cartService.addToCart(req.user.userId, body.productId, body.quantity);
    return {
      success: true,
      message: 'Item added to cart successfully',
      data: cart,
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch('items/:productId')
  async updateQuantity(
    @Req() req: { user: { userId: string } },
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ): Promise<ApiResponse<unknown>> {
    const cart = await this.cartService.updateQuantity(req.user.userId, productId, quantity);
    return {
      success: true,
      message: 'Cart item quantity updated successfully',
      data: cart,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete('items/:productId')
  async removeFromCart(
    @Req() req: { user: { userId: string } },
    @Param('productId') productId: string,
  ): Promise<ApiResponse<unknown>> {
    const cart = await this.cartService.removeFromCart(req.user.userId, productId);
    return {
      success: true,
      message: 'Item removed from cart successfully',
      data: cart,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete()
  async clearCart(@Req() req: { user: { userId: string } }): Promise<ApiResponse<unknown>> {
    await this.cartService.clearCart(req.user.userId);
    return {
      success: true,
      message: 'Cart cleared successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }
}
