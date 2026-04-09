import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from '../schemas/cart.schema';
import { ICartRepository } from '../interfaces/cart.repository.interface';

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(@InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>) {}

  async create(userId: string): Promise<CartDocument> {
    const newCart = new this.cartModel({ userId, items: [], totalAmount: 0 });
    return newCart.save();
  }

  async findByUserId(userId: string): Promise<CartDocument | null> {
    return this.cartModel.findOne({ userId, isDeleted: false }).populate('items.productId').exec();
  }

  async update(userId: string, cart: Partial<Cart>): Promise<CartDocument | null> {
    return this.cartModel
      .findOneAndUpdate({ userId, isDeleted: false }, cart, {
        new: true,
        upsert: true,
      })
      .exec();
  }

  async clear(userId: string): Promise<void> {
    await this.cartModel
      .findOneAndUpdate({ userId, isDeleted: false }, { items: [], totalAmount: 0 })
      .exec();
  }
}
