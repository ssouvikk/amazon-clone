import { Order, OrderDocument } from '../schemas/order.schema';

export interface IOrderRepository {
  create(order: Partial<Order>): Promise<OrderDocument>;
  findById(id: string): Promise<OrderDocument | null>;
  findByUserId(userId: string): Promise<OrderDocument[]>;
  updateStatus(id: string, status: string): Promise<OrderDocument | null>;
  findAll(): Promise<OrderDocument[]>;
}
