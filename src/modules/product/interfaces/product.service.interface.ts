import { ProductDocument } from '../schemas/product.schema';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from '../dto/product.dto';

export interface IProductService {
  createProduct(productData: CreateProductDto): Promise<ProductDocument>;
  findProductById(id: string): Promise<ProductDocument>;
  findAllProducts(query: ProductQueryDto): Promise<{ items: ProductDocument[]; total: number }>;
  updateProduct(id: string, updateData: UpdateProductDto): Promise<ProductDocument>;
  deleteProduct(id: string): Promise<void>;
  updateStock(id: string, quantity: number): Promise<void>;
}
