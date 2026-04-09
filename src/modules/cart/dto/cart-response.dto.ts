import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponseDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  productId!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ example: 199.99 })
  priceSnapshot!: number;
}

export class CartResponseDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  _id!: string;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d2' })
  userId!: string;

  @ApiProperty({ type: [CartItemResponseDto] })
  items!: CartItemResponseDto[];

  @ApiProperty({ example: 399.98 })
  totalAmount!: number;

  @ApiProperty({ example: '2024-03-20T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-20T10:00:00.000Z' })
  updatedAt!: Date;
}
