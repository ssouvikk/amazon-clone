import { Product, ProductDocument } from '../schemas/product.schema';

export interface IProductService {
  createProduct(productData: Partial<Product>): Promise<ProductDocument>;
  findProductById(id: string): Promise<ProductDocument>;
  findAllProducts(
    query: Record<string, unknown>,
  ): Promise<{ items: ProductDocument[]; total: number }>;
  updateProduct(id: string, updateData: Partial<Product>): Promise<ProductDocument>;
  deleteProduct(id: string): Promise<void>;
  updateStock(id: string, quantity: number): Promise<void>;
}
