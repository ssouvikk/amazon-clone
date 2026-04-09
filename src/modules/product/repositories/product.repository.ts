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

  async findAll(query: any): Promise<ProductDocument[]> {
    const { skip = 0, limit = 10, ...filters } = query;
    return await this.productModel
      .find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    product: Partial<Product>,
  ): Promise<ProductDocument | null> {
    return await this.productModel
      .findByIdAndUpdate(id, product, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(id).exec();
  }

  async count(query: any): Promise<number> {
    const { skip, limit, ...filters } = query;
    return await this.productModel.countDocuments(filters).exec();
  }

  async updateStock(
    id: string,
    quantity: number,
  ): Promise<ProductDocument | null> {
    return await this.productModel
      .findByIdAndUpdate(
        id,
        { $inc: { stock: quantity } },
        { new: true, runValidators: true },
      )
      .exec();
  }
}
