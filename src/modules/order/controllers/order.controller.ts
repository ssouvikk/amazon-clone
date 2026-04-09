import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { TOKENS } from '../../../shared/constants/tokens';
import { IOrderService } from '../interfaces/order.service.interface';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { UserRole } from '../../user/schemas/user.schema';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import {
  ApiSuccessResponse,
  ApiErrorResponses,
} from '../../../shared/decorators/swagger.decorator';
import { OrderResponseDto } from '../dto/order-response.dto';
import { UpdateOrderStatusDto } from '../dto/order.dto';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(
    @Inject(TOKENS.ORDER_SERVICE)
    private readonly orderService: IOrderService,
  ) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Create an order from the current cart' })
  @ApiSuccessResponse(OrderResponseDto, 'Order placed successfully', true)
  @ApiErrorResponses()
  async checkout(@Req() req: { user: { userId: string } }): Promise<ApiResponse<unknown>> {
    const order = await this.orderService.createOrderFromCart(req.user.userId);
    return {
      success: true,
      message: 'Order placed successfully',
      data: order,
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiSuccessResponse(OrderResponseDto, 'Orders retrieved successfully')
  @ApiErrorResponses()
  async getMyOrders(@Req() req: { user: { userId: string } }): Promise<ApiResponse<unknown>> {
    const orders = await this.orderService.getUserOrders(req.user.userId);
    return {
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @ApiSuccessResponse(OrderResponseDto, 'All orders retrieved successfully')
  @ApiErrorResponses()
  async getAllOrders(): Promise<ApiResponse<unknown>> {
    const orders = await this.orderService.getAllOrders();
    return {
      success: true,
      message: 'All orders retrieved successfully',
      data: orders,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiSuccessResponse(OrderResponseDto, 'Order retrieved successfully')
  @ApiErrorResponses()
  async getOrderById(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    const order = await this.orderService.getOrderById(id);
    return {
      success: true,
      message: 'Order retrieved successfully',
      data: order,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiSuccessResponse(OrderResponseDto, 'Order status updated successfully')
  @ApiErrorResponses()
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateOrderStatusDto,
  ): Promise<ApiResponse<unknown>> {
    const order = await this.orderService.updateOrderStatus(id, body.status);
    return {
      success: true,
      message: 'Order status updated successfully',
      data: order,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }
}
