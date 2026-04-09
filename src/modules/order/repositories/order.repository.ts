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
    return await newOrder.save();
  }

  async findById(id: string): Promise<OrderDocument | null> {
    return await this.orderModel.findById(id).populate('items.productId').exec();
  }

  async findByUserId(userId: string): Promise<OrderDocument[]> {
    return await this.orderModel
      .find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAll(): Promise<OrderDocument[]> {
    return await this.orderModel
      .find()
      .populate('items.productId')
      .populate('userId', 'email name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDocument | null> {
    return await this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }
}
