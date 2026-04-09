import { OrderDocument, OrderStatus } from '../schemas/order.schema';

export interface IOrderService {
  createOrderFromCart(userId: string): Promise<OrderDocument>;
  getOrderById(id: string): Promise<OrderDocument>;
  getUserOrders(userId: string): Promise<OrderDocument[]>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<OrderDocument>;
  getAllOrders(): Promise<OrderDocument[]>;
}
