import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';
import { IProductRepository } from './interfaces/product.repository.interface';
import { IProductService } from './interfaces/product.service.interface';
import { Product, ProductSchema } from './schemas/product.schema';

import { TOKENS } from '../../shared/constants/tokens';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  controllers: [ProductController],
  providers: [
    // 1. Class Provider with Token
    {
      provide: TOKENS.PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
    // 2. Factory Provider for Product Service
    {
      provide: TOKENS.PRODUCT_SERVICE,
      useFactory: (repo: IProductRepository, cacheManager: Cache): IProductService => {
        return new ProductService(repo, cacheManager);
      },
      inject: [TOKENS.PRODUCT_REPOSITORY, CACHE_MANAGER],
    },
    // 3. Existing Provider (Alias)
    {
      provide: 'LEGACY_PRODUCT_SERVICE',
      useExisting: TOKENS.PRODUCT_SERVICE,
    },
  ],
  exports: [TOKENS.PRODUCT_SERVICE, TOKENS.PRODUCT_REPOSITORY],
})
export class ProductModule {}
