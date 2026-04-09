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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { TOKENS } from '../../../shared/constants/tokens';
import { IProductService } from '../interfaces/product.service.interface';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { UserRole } from '../../user/schemas/user.schema';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from '../dto/product.dto';
import {
  ApiSuccessResponse,
  ApiPaginatedResponse,
  ApiErrorResponses,
} from '../../../shared/decorators/swagger.decorator';
import { ProductResponseDto } from '../dto/product-response.dto';
import { BaseResponseDto } from '../../../shared/dto/api-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    @Inject(TOKENS.PRODUCT_SERVICE)
    private readonly productService: IProductService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of products' })
  @ApiPaginatedResponse(ProductResponseDto, 'Products retrieved successfully')
  @ApiErrorResponses()
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
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiSuccessResponse(ProductResponseDto, 'Product retrieved successfully')
  @ApiErrorResponses()
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiSuccessResponse(ProductResponseDto, 'Product created successfully', true)
  @ApiErrorResponses()
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiSuccessResponse(ProductResponseDto, 'Product updated successfully')
  @ApiErrorResponses()
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiSuccessResponse(BaseResponseDto, 'Product deleted successfully')
  @ApiErrorResponses()
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
