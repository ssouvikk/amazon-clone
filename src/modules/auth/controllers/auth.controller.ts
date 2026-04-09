import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponse<unknown>> {
    const user = await this.authService.register(registerDto);
    return {
      success: true,
      message: 'User registered successfully',
      data: user,
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<unknown>> {
    const user = await this.authService.validateUser(loginDto);
    const tokens = await this.authService.login(user);
    return {
      success: true,
      message: 'Login successful',
      data: tokens,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: { user: { email: string; userId: string; role: string } },
  ): Promise<ApiResponse<unknown>> {
    const tokens = await this.authService.refreshToken(req.user);
    return {
      success: true,
      message: 'Token refreshed successfully',
      data: tokens,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }
}
