import { IsString, IsNumber, IsInt, IsOptional, Min, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    example: 'Wireless Headphones',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality noise-canceling wireless headphones.',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'Product price',
    example: 199.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({
    description: 'Available stock count',
    example: 50,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  stock!: number;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
  })
  @IsString()
  category!: string;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Updated product title',
    example: 'Updated Wireless Headphones',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated product description',
    example: 'Updated description for wireless headphones.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated product price',
    example: 179.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Updated stock count',
    example: 45,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({
    description: 'Updated category',
    example: 'Audio',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Updated image URL',
    example: 'https://example.com/new-image.jpg',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}

export class ProductQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Search string (matches title or description)',
    example: 'headphones',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by category',
    example: 'Electronics',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    example: 500,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  maxPrice?: number;
}
