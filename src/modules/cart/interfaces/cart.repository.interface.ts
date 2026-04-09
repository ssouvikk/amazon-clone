import { Cart, CartDocument } from '../schemas/cart.schema';

export interface ICartRepository {
  create(userId: string): Promise<CartDocument>;
  findByUserId(userId: string): Promise<CartDocument | null>;
  update(userId: string, cart: Partial<Cart>): Promise<CartDocument | null>;
  clear(userId: string): Promise<void>;
}
