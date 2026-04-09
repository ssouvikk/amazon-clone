import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req: any): Promise<ApiResponse<any>> {
    const user = await this.userService.findById(req.user.userId);
    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch('profile')
  async updateProfile(
    @Req() req: any,
    @Body() updateData: any,
  ): Promise<ApiResponse<any>> {
    const user = await this.userService.updateProfile(req.user.userId, updateData);
    return {
      success: true,
      message: 'Profile updated successfully',
      data: user,
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers(): Promise<ApiResponse<any>> {
    const users = await this.userService.findAllUsers();
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
