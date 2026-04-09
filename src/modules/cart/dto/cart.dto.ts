import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    description: 'Product ID to add to cart',
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
  })
  @IsString()
  productId!: string;

  @ApiProperty({
    description: 'Quantity to add',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'New quantity of the item',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity!: number;
}
