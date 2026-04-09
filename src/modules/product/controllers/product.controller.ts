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
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { UserRole } from '../../user/schemas/user.schema';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(@Query() query: any): Promise<ApiResponse<any>> {
    const { items, total } = await this.productService.findAllProducts(query);
    return {
      success: true,
      message: 'Products retrieved successfully',
      data: { items, total },
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<ApiResponse<any>> {
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
  async createProduct(@Body() productData: any): Promise<ApiResponse<any>> {
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
    @Body() updateData: any,
  ): Promise<ApiResponse<any>> {
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
  async deleteProduct(@Param('id') id: string): Promise<ApiResponse<any>> {
    await this.productService.deleteProduct(id);
    return {
      success: true,
      message: 'Product deleted successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }
}
