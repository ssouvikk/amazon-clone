import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from '../schemas/order.schema';
import { IOrderRepository } from '../interfaces/order.repository.interface';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>) {}

  async create(order: Partial<Order>): Promise<OrderDocument> {
    const newOrder = new this.orderModel(order);
    return newOrder.save();
  }

  async findById(id: string): Promise<OrderDocument | null> {
    return this.orderModel
      .findOne({ _id: id, isDeleted: false })
      .populate('items.productId')
      .exec();
  }

  async findByUserId(userId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ userId, isDeleted: false })
      .populate('items.productId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAll(): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ isDeleted: false })
      .populate('items.productId')
      .populate('userId', 'email name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDocument | null> {
    return this.orderModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, { status }, { new: true })
      .exec();
  }
}
