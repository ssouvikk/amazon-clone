import { Product, ProductDocument } from '../schemas/product.schema';

export interface IProductRepository {
  create(product: Partial<Product>): Promise<ProductDocument>;
  findById(id: string): Promise<ProductDocument | null>;
  findAll(query: any): Promise<ProductDocument[]>;
  update(id: string, product: Partial<Product>): Promise<ProductDocument | null>;
  delete(id: string): Promise<void>;
  count(query: any): Promise<number>;
  updateStock(id: string, quantity: number): Promise<ProductDocument | null>;
}
