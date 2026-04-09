import { ProductDocument } from '../schemas/product.schema';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from '../dto/product.dto';

export interface IProductRepository {
  create(product: CreateProductDto): Promise<ProductDocument>;
  findById(id: string): Promise<ProductDocument | null>;
  findAll(query: ProductQueryDto): Promise<ProductDocument[]>;
  update(id: string, product: UpdateProductDto): Promise<ProductDocument | null>;
  delete(id: string): Promise<void>;
  count(query: ProductQueryDto): Promise<number>;
  updateStock(id: string, quantity: number): Promise<ProductDocument | null>;
}
