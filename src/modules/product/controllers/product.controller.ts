import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { TOKENS } from '../../../shared/constants/tokens';
import { IProductService } from '../interfaces/product.service.interface';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { UserRole } from '../../user/schemas/user.schema';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from '../dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(
    @Inject(TOKENS.PRODUCT_SERVICE)
    private readonly productService: IProductService,
  ) {}

  @Get()
  async getProducts(@Query() query: ProductQueryDto): Promise<ApiResponse<unknown>> {
    const { items, total } = await this.productService.findAllProducts(query);
    return {
      success: true,
      message: 'Products retrieved successfully',
      data: {
        items,
        total,
        page: Math.floor((query.skip || 0) / (query.limit || 10)) + 1,
        limit: query.limit || 10,
      },
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    const product = await this.productService.findProductById(id);
    return {
      success: true,
      message: 'Product retrieved successfully',
      data: product,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createProduct(@Body() productData: CreateProductDto): Promise<ApiResponse<unknown>> {
    const product = await this.productService.createProduct(productData);
    return {
      success: true,
      message: 'Product created successfully',
      data: product,
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateData: UpdateProductDto,
  ): Promise<ApiResponse<unknown>> {
    const product = await this.productService.updateProduct(id, updateData);
    return {
      success: true,
      message: 'Product updated successfully',
      data: product,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteProduct(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    await this.productService.deleteProduct(id);
    return {
      success: true,
      message: 'Product deleted successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }
}
