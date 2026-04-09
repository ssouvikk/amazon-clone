import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TOKENS } from '../../../shared/constants/tokens';
import { ICartRepository } from '../interfaces/cart.repository.interface';
import { IProductService } from '../../product/interfaces/product.service.interface';
import { ICartService } from '../interfaces/cart.service.interface';
import { CartDocument } from '../schemas/cart.schema';
import { Types } from 'mongoose';

@Injectable()
export class CartService implements ICartService {
  constructor(
    @Inject(TOKENS.CART_REPOSITORY)
    private readonly cartRepository: ICartRepository,
    @Inject(TOKENS.PRODUCT_SERVICE)
    private readonly productService: IProductService,
  ) {}

  async getCart(userId: string): Promise<CartDocument> {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.create(userId);
    }
    return cart;
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<CartDocument> {
    const [product, cart] = await Promise.all([
      this.productService.findProductById(productId),
      this.getCart(userId),
    ]);

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].priceSnapshot = product.price;
    } else {
      cart.items.push({
        productId: new Types.ObjectId(productId),
        quantity,
        priceSnapshot: product.price,
      });
    }

    this.calculateTotal(cart);
    return (await this.cartRepository.update(userId, {
      items: cart.items,
      totalAmount: cart.totalAmount,
    }))!;
  }

  async removeFromCart(userId: string, productId: string): Promise<CartDocument> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    this.calculateTotal(cart);
    return (await this.cartRepository.update(userId, {
      items: cart.items,
      totalAmount: cart.totalAmount,
    }))!;
  }

  async updateQuantity(userId: string, productId: string, quantity: number): Promise<CartDocument> {
    const cart = await this.getCart(userId);
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      this.calculateTotal(cart);
      return (await this.cartRepository.update(userId, {
        items: cart.items,
        totalAmount: cart.totalAmount,
      }))!;
    }
    throw new NotFoundException('Item not found in cart');
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartRepository.clear(userId);
  }

  private calculateTotal(cart: CartDocument): void {
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.quantity * item.priceSnapshot,
      0,
    );
  }
}
