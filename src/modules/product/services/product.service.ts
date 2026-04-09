import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(productData: Partial<Product>): Promise<ProductDocument> {
    return await this.productRepository.create(productData);
  }

  async findProductById(id: string): Promise<ProductDocument> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findAllProducts(
    query: any,
  ): Promise<{ items: ProductDocument[]; total: number }> {
    const items = await this.productRepository.findAll(query);
    const total = await this.productRepository.count(query);
    return { items, total };
  }

  async updateProduct(
    id: string,
    updateData: Partial<Product>,
  ): Promise<ProductDocument> {
    const product = await this.productRepository.update(id, updateData);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    const product = await this.productRepository.updateStock(id, quantity);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    if (product.stock < 0) {
      // Rollback or handle insufficient stock
      await this.productRepository.updateStock(id, -quantity);
      throw new Error('Insufficient stock');
    }
  }
}
