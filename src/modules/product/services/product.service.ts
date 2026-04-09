import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TOKENS } from '../../../shared/constants/tokens';
import { IProductRepository } from '../interfaces/product.repository.interface';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @Inject(TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private readonly LIST_CACHE_KEY = 'products:list';
  private getProductKey(id: string): string {
    return `products:item:${id}`;
  }

  async createProduct(productData: Partial<Product>): Promise<ProductDocument> {
    const product = await this.productRepository.create(productData);
    await this.invalidateListCache();
    return product;
  }

  async findProductById(id: string): Promise<ProductDocument> {
    const cacheKey = this.getProductKey(id);
    const cached = await this.cacheManager.get<ProductDocument>(cacheKey);
    if (cached) return cached;

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.cacheManager.set(cacheKey, product);
    return product;
  }

  async findAllProducts(
    query: Record<string, unknown>,
  ): Promise<{ items: ProductDocument[]; total: number }> {
    const cacheKey = `${this.LIST_CACHE_KEY}:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get<{ items: ProductDocument[]; total: number }>(
      cacheKey,
    );
    if (cached) return cached;

    const [items, total] = await Promise.all([
      this.productRepository.findAll(query),
      this.productRepository.count(query),
    ]);
    const result = { items, total };
    await this.cacheManager.set(cacheKey, result);
    return result;
  }

  async updateProduct(id: string, updateData: Partial<Product>): Promise<ProductDocument> {
    const product = await this.productRepository.update(id, updateData);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await Promise.all([this.invalidateListCache(), this.cacheManager.del(this.getProductKey(id))]);
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
    await Promise.all([this.invalidateListCache(), this.cacheManager.del(this.getProductKey(id))]);
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
    await Promise.all([this.invalidateListCache(), this.cacheManager.del(this.getProductKey(id))]);
  }

  private async invalidateListCache(): Promise<void> {
    // In cache-manager v7 (Keyv based), we don't have store.keys() by default
    // We can either use a separate cache instance for lists, or use clear() if the cache is dedicated.
    // Given the global nature, we'll use clear() for now, or we could implement a smarter way.
    // For small/medium scale, clear() is often acceptable for high-frequency updates.
    await this.cacheManager.clear();
  }
}
