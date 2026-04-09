import { CartDocument } from '../schemas/cart.schema';

export interface ICartService {
  getCart(userId: string): Promise<CartDocument>;
  addToCart(userId: string, productId: string, quantity: number): Promise<CartDocument>;
  removeFromCart(userId: string, productId: string): Promise<CartDocument>;
  updateQuantity(userId: string, productId: string, quantity: number): Promise<CartDocument>;
  clearCart(userId: string): Promise<void>;
}
