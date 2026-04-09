import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { CartService } from '../../cart/services/cart.service';
import { ProductService } from '../../product/services/product.service';
import { OrderDocument, OrderStatus } from '../schemas/order.schema';
import { Types } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  async createOrderFromCart(userId: string): Promise<OrderDocument> {
    const cart = await this.cartService.getCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // 1. Validate Stock & Prepare Order Items
    const orderItems = [];
    for (const item of cart.items) {
      const product = await this.productService.findProductById(
        item.productId.toString(),
      );
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product: ${product.title}`,
        );
      }
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        priceFixed: item.priceSnapshot,
      });
    }

    // 2. Reduce Stock (Simulate Transaction)
    const updatedProducts = [];
    try {
      for (const item of cart.items) {
        await this.productService.updateStock(item.productId.toString(), -item.quantity);
        updatedProducts.push({ id: item.productId.toString(), qty: item.quantity });
      }

      // 3. Create Order
      const order = await this.orderRepository.create({
        userId: new Types.ObjectId(userId) as any,
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
