import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
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
    return newProduct.save();
  }

  async findById(id: string): Promise<ProductDocument | null> {
    return this.productModel
      .findOne({ _id: id, isDeleted: false })
      .lean()
      .exec() as Promise<ProductDocument | null>;
  }

  async findAll(query: Record<string, unknown>): Promise<ProductDocument[]> {
    const { skip = 0, limit = 10, search, category, ...filters } = query;

    const queryBuilder: Record<string, unknown> = {
      ...filters,
      isDeleted: false,
    };

    if (typeof search === 'string') {
      queryBuilder['$text'] = { $search: search };
    }

    if (typeof category === 'string') {
      queryBuilder['category'] = category;
    }

    // Using Parameters helper to get the correct type from Model.find
    type FilterType = Parameters<Model<ProductDocument>['find']>[0];
    const findQuery = this.productModel.find(queryBuilder as unknown as FilterType);

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

  async update(id: string, product: Partial<Product>): Promise<ProductDocument | null> {
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

  async count(query: Record<string, unknown>): Promise<number> {
    const { search, category, ...filters } = query;
    const queryBuilder: Record<string, unknown> = {
      ...filters,
      isDeleted: false,
    };

    if (typeof search === 'string') {
      queryBuilder['$text'] = { $search: search };
    }

    if (typeof category === 'string') {
      queryBuilder['category'] = category;
    }

    type CountFilterType = Parameters<Model<ProductDocument>['countDocuments']>[0];
    return this.productModel.countDocuments(queryBuilder as unknown as CountFilterType).exec();
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
