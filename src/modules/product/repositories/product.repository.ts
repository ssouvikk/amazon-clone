import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { IProductRepository } from '../interfaces/product.repository.interface';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(product: Partial<Product>): Promise<ProductDocument> {
    const newProduct = new this.productModel(product);
    return await newProduct.save();
  }

  async findById(id: string): Promise<ProductDocument | null> {
    return await this.productModel.findById(id).exec();
  }

  async findAll(query: Record<string, unknown>): Promise<ProductDocument[]> {
    const skip = query['skip'] ?? 0;
    const limit = query['limit'] ?? 10;
    const filters = { ...query };
    delete filters['skip'];
    delete filters['limit'];
    return await this.productModel
      .find(filters)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, product: Partial<Product>): Promise<ProductDocument | null> {
    return await this.productModel.findByIdAndUpdate(id, product, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(id).exec();
  }

  async count(query: Record<string, unknown>): Promise<number> {
    const filters = { ...query };
    delete filters['skip'];
    delete filters['limit'];
    return await this.productModel.countDocuments(filters).exec();
  }

  async updateStock(id: string, quantity: number): Promise<ProductDocument | null> {
    return await this.productModel
      .findByIdAndUpdate(id, { $inc: { stock: quantity } }, { new: true, runValidators: true })
      .exec();
  }
}
