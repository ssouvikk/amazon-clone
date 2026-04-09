import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export type OrderDocument = Order & Document;

@Schema()
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  titleSnapshot!: string;

  @Prop({ required: true, min: 1 })
  quantity!: number;

  @Prop({ required: true, min: 0 })
  priceSnapshot!: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], default: [] })
  items!: OrderItem[];

  @Prop({ required: true, min: 0 })
  totalAmount!: number;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status!: OrderStatus;

  @Prop({ default: false })
  isDeleted!: boolean;

  @Prop()
  deletedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
