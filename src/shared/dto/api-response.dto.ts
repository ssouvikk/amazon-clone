import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ required: false })
  message?: string;
}

export class ErrorResponseDto extends BaseResponseDto {
  @ApiProperty({ example: false })
  declare success: boolean;

  @ApiProperty({ example: 'Something went wrong' })
  declare message: string;

  @ApiProperty({ example: 'ERROR_CODE' })
  errorCode!: string;

  @ApiProperty({ example: '2024-03-20T10:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: '/api/v1/resource' })
  path!: string;
}
