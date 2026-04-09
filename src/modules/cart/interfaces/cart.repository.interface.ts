import { Cart, CartDocument } from '../schemas/cart.schema';

export interface ICartRepository {
  findByUserId(userId: string): Promise<CartDocument | null>;
  create(userId: string): Promise<CartDocument>;
  update(userId: string, cart: Partial<Cart>): Promise<CartDocument | null>;
  clear(userId: string): Promise<void>;
}
