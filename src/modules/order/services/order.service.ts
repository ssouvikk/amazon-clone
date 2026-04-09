import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { TOKENS } from '../../../shared/constants/tokens';
import { IOrderRepository } from '../interfaces/order.repository.interface';
import { ICartService } from '../../cart/interfaces/cart.service.interface';
import { IProductService } from '../../product/interfaces/product.service.interface';
import { IOrderService } from '../interfaces/order.service.interface';
import { OrderDocument, OrderStatus } from '../schemas/order.schema';
import { Types } from 'mongoose';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject(TOKENS.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(TOKENS.CART_SERVICE)
    private readonly cartService: ICartService,
    @Inject(TOKENS.PRODUCT_SERVICE)
    private readonly productService: IProductService,
  ) {}

  async createOrderFromCart(userId: string): Promise<OrderDocument> {
    const cart = await this.cartService.getCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // 1. Validate Stock & Prepare Order Items
    const orderItems = [];
    for (const item of cart.items) {
      const product = await this.productService.findProductById(item.productId.toString());
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product: ${product.title}`);
      }
      orderItems.push({
        productId: item.productId,
        titleSnapshot: product.title,
        quantity: item.quantity,
        priceSnapshot: item.priceSnapshot,
      });
    }

    // 2. Reduce Stock (Simulate Transaction)
    const updatedProducts = [];
    try {
      for (const item of cart.items) {
        await this.productService.updateStock(item.productId.toString(), -item.quantity);
        updatedProducts.push({
          id: item.productId.toString(),
          qty: item.quantity,
        });
      }

      // 3. Create Order
      const order = await this.orderRepository.create({
        userId: new Types.ObjectId(userId) as unknown as Types.ObjectId,
        items: orderItems,
        totalAmount: cart.totalAmount,
        status: OrderStatus.PENDING,
      });

      // 4. Clear Cart
      await this.cartService.clearCart(userId);

      return order;
    } catch (error) {
      // Basic Rollback for stock if order creation fails
      for (const p of updatedProducts) {
        await this.productService.updateStock(p.id, p.qty);
      }
      throw error;
    }
  }

  async getUserOrders(userId: string): Promise<OrderDocument[]> {
    return await this.orderRepository.findByUserId(userId);
  }

  async getAllOrders(): Promise<OrderDocument[]> {
    return await this.orderRepository.findAll();
  }

  async getOrderById(id: string): Promise<OrderDocument> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<OrderDocument> {
    const order = await this.orderRepository.updateStatus(id, status);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
}
