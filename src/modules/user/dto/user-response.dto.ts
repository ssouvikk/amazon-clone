import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';

export class UserProfileDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  _id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role!: UserRole;

  @ApiProperty({ example: '2024-03-20T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-03-20T10:00:00.000Z' })
  updatedAt!: Date;
}
