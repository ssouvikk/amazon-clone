import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Inject,
  Res,
} from '@nestjs/common';
import { TOKENS } from '../../../shared/constants/tokens';
import { IAuthService } from '../interfaces/auth.service.interface';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(TOKENS.AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

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
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<ApiResponse<unknown>> {
    const user = await this.authService.validateUser(loginDto);
    const { accessToken, refreshToken } = await this.authService.login(user);

    // Set Refresh Token in HTTP-only Cookie
    void res.setCookie('refresh_token', refreshToken, {
      path: '/',
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: FastifyRequest & { user: { email: string; sub: string; role: string } },
  ): Promise<ApiResponse<unknown>> {
    const { accessToken } = await this.authService.refreshToken({
      userId: req.user.sub,
      email: req.user.email,
      role: req.user.role,
    });

    return {
      success: true,
      message: 'Token refreshed successfully',
      data: { accessToken },
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: FastifyRequest & { user: { sub: string } },
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<ApiResponse<unknown>> {
    await this.authService.logout(req.user.sub);

    void res.clearCookie('refresh_token', {
      path: '/',
      httpOnly: true,
    });

    return {
      success: true,
      message: 'Logout successful',
      data: null,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }
}
