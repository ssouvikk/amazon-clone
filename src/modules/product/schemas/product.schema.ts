import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, trim: true })
  description!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, min: 0 })
  stock!: number;

  @Prop({ required: true, trim: true, index: true })
  category!: string;

  @Prop({ type: [String], default: [] })
  images!: string[];

  @Prop({ default: false })
  isDeleted!: boolean;

  @Prop()
  deletedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Full-text search index
ProductSchema.index({ title: 'text', description: 'text' });

// Stock validation hook
ProductSchema.pre('save', function (this: ProductDocument) {
  if (this.stock < 0) {
    throw new Error('Stock cannot be negative');
  }
});
