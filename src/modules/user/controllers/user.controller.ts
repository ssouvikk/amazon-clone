import { Controller, Get, Patch, Body, UseGuards, Req, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { TOKENS } from '../../../shared/constants/tokens';
import { IUserService } from '../interfaces/user.service.interface';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import {
  ApiSuccessResponse,
  ApiErrorResponses,
} from '../../../shared/decorators/swagger.decorator';
import { UserProfileDto } from '../dto/user-response.dto';
import { UpdateUserDto } from '../dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    @Inject(TOKENS.USER_SERVICE)
    private readonly userService: IUserService,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiSuccessResponse(UserProfileDto, 'Profile retrieved successfully')
  @ApiErrorResponses()
  async getProfile(@Req() req: { user: { userId: string } }): Promise<ApiResponse<unknown>> {
    const user = await this.userService.getUserById(req.user.userId);
    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiSuccessResponse(UserProfileDto, 'Profile updated successfully')
  @ApiErrorResponses()
  async updateProfile(
    @Req() req: { user: { userId: string } },
    @Body() updateData: UpdateUserDto,
  ): Promise<ApiResponse<unknown>> {
    const user = await this.userService.updateUser(req.user.userId, updateData);
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
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiSuccessResponse(UserProfileDto, 'Users retrieved successfully')
  @ApiErrorResponses()
  async getAllUsers(): Promise<ApiResponse<unknown>> {
    const users = await this.userService.getAllUsers();
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      statusCode: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
