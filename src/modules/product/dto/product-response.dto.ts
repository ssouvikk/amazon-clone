import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  _id!: string;

  @ApiProperty({ example: 'Wireless Headphones' })
  title!: string;

  @ApiProperty({ example: 'High-quality noise-canceling wireless headphones.' })
  description!: string;

  @ApiProperty({ example: 199.99 })
  price!: number;

  @ApiProperty({ example: 50 })
  stock!: number;

  @ApiProperty({ example: 'Electronics' })
  category!: string;

  @ApiProperty({ example: ['https://example.com/image.jpg'], type: [String] })
  images!: string[];

  @ApiProperty({ example: '2024-03-20T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-20T10:00:00.000Z' })
  updatedAt!: Date;
}
