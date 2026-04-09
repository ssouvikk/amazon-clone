import { Order, OrderDocument, OrderStatus } from '../schemas/order.schema';

export interface IOrderRepository {
  create(order: Partial<Order>): Promise<OrderDocument>;
  findById(id: string): Promise<OrderDocument | null>;
  findByUserId(userId: string): Promise<OrderDocument[]>;
  findAll(): Promise<OrderDocument[]>;
  updateStatus(id: string, status: OrderStatus): Promise<OrderDocument | null>;
}
