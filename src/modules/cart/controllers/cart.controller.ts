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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { TOKENS } from '../../../shared/constants/tokens';
import { ICartService } from '../interfaces/cart.service.interface';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import {
  ApiSuccessResponse,
  ApiErrorResponses,
} from '../../../shared/decorators/swagger.decorator';
import { CartResponseDto } from '../dto/cart-response.dto';
import { AddToCartDto, UpdateCartItemDto } from '../dto/cart.dto';
import { BaseResponseDto } from '../../../shared/dto/api-response.dto';

@ApiTags('Cart')
@ApiBearerAuth('JWT-auth')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    @Inject(TOKENS.CART_SERVICE)
    private readonly cartService: ICartService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get current user shopping cart' })
  @ApiSuccessResponse(CartResponseDto, 'Cart retrieved successfully')
  @ApiErrorResponses()
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

  @Post('items')
  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiBody({ type: AddToCartDto })
  @ApiSuccessResponse(CartResponseDto, 'Item added to cart successfully', true)
  @ApiErrorResponses()
  async addToCart(
    @Req() req: { user: { userId: string } },
    @Body() body: AddToCartDto,
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
  @ApiOperation({ summary: 'Update quantity of an item in the cart' })
  @ApiParam({ name: 'productId', description: 'ID of the product in the cart' })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiSuccessResponse(CartResponseDto, 'Cart item quantity updated successfully')
  @ApiErrorResponses()
  async updateQuantity(
    @Req() req: { user: { userId: string } },
    @Param('productId') productId: string,
    @Body() body: UpdateCartItemDto,
  ): Promise<ApiResponse<unknown>> {
    const cart = await this.cartService.updateQuantity(req.user.userId, productId, body.quantity);
    return {
      success: true,
      message: 'Cart item quantity updated successfully',
      data: cart,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiParam({ name: 'productId', description: 'ID of the product to remove' })
  @ApiSuccessResponse(CartResponseDto, 'Item removed from cart successfully')
  @ApiErrorResponses()
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
  @ApiOperation({ summary: 'Clear the entire shopping cart' })
  @ApiSuccessResponse(BaseResponseDto, 'Cart cleared successfully')
  @ApiErrorResponses()
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
