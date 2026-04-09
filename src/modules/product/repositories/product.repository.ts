import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { ProductDocument } from '../schemas/product.schema';
import { IProductRepository } from '../interfaces/product.repository.interface';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from '../dto/product.dto';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(product: CreateProductDto): Promise<ProductDocument> {
    const newProduct = new this.productModel(product);
    return newProduct.save();
  }

  async findById(id: string): Promise<ProductDocument | null> {
    return this.productModel
      .findOne({ _id: id, isDeleted: false })
      .lean()
      .exec() as Promise<ProductDocument | null>;
  }

  async findAll(query: ProductQueryDto): Promise<ProductDocument[]> {
    const { skip = 0, limit = 10, search, category, minPrice, maxPrice } = query;

    const queryBuilder: Record<string, unknown> = {
      isDeleted: false,
    };

    if (search) {
      queryBuilder['$text'] = { $search: search };
    }

    if (category) {
      queryBuilder['category'] = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceQuery: Record<string, number> = {};
      if (minPrice !== undefined) priceQuery['$gte'] = minPrice;
      if (maxPrice !== undefined) priceQuery['$lte'] = maxPrice;
      queryBuilder['price'] = priceQuery;
    }

    const findQuery = this.productModel.find(queryBuilder);

    // Apply projection: exclude heavy fields for list view
    findQuery.select('-description -specifications -reviews');

    if (search) {
      findQuery.select({ score: { $meta: 'textScore' } });
      findQuery.sort({ score: { $meta: 'textScore' } } as unknown as
        | string
        | Record<string, SortOrder>);
    } else {
      findQuery.sort({ createdAt: -1 } as unknown as string | Record<string, SortOrder>);
    }

    return findQuery.skip(Number(skip)).limit(Number(limit)).lean().exec() as Promise<
      ProductDocument[]
    >;
  }

  async update(id: string, product: UpdateProductDto): Promise<ProductDocument | null> {
    return this.productModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, product, { new: true })
      .lean()
      .exec() as Promise<ProductDocument | null>;
  }

  async delete(id: string): Promise<void> {
    await this.productModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true, deletedAt: new Date() })
      .exec();
  }

  async count(query: ProductQueryDto): Promise<number> {
    const { search, category, minPrice, maxPrice } = query;
    const queryBuilder: Record<string, unknown> = {
      isDeleted: false,
    };

    if (search) {
      queryBuilder['$text'] = { $search: search };
    }

    if (category) {
      queryBuilder['category'] = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceQuery: Record<string, number> = {};
      if (minPrice !== undefined) priceQuery['$gte'] = minPrice;
      if (maxPrice !== undefined) priceQuery['$lte'] = maxPrice;
      queryBuilder['price'] = priceQuery;
    }

    return this.productModel.countDocuments(queryBuilder).exec();
  }

  async updateStock(id: string, quantity: number): Promise<ProductDocument | null> {
    return this.productModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $inc: { stock: quantity } },
        { new: true, runValidators: true },
      )
      .exec();
  }
}
