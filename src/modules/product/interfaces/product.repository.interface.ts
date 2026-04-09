import { Product, ProductDocument } from '../schemas/product.schema';

export interface IProductRepository {
  create(product: Partial<Product>): Promise<ProductDocument>;
  findById(id: string): Promise<ProductDocument | null>;
  findAll(query: Record<string, unknown>): Promise<ProductDocument[]>;
  update(id: string, product: Partial<Product>): Promise<ProductDocument | null>;
  delete(id: string): Promise<void>;
  count(query: Record<string, unknown>): Promise<number>;
  updateStock(id: string, quantity: number): Promise<ProductDocument | null>;
}
