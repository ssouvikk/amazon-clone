import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TOKENS } from '../../../shared/constants/tokens';
import { IUserService } from '../../user/interfaces/user.service.interface';
import { IAuthService } from '../interfaces/auth.service.interface';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserDocument } from '../../user/schemas/user.schema';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(TOKENS.USER_SERVICE)
    private readonly userService: IUserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserDocument> {
    // Note: Password hashing is handled by the UserSchema pre-save hook
    return await this.userService.createUser(registerDto);
  }

  async validateUser(loginDto: LoginDto): Promise<UserDocument> {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (user && (await user.comparePassword(loginDto.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: UserDocument): Promise<{ accessToken: string; refreshToken: string }> {
    const userId = String(user._id);
    const payload = {
      email: user.email,
      sub: userId,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.jwtRefreshSecret'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      expiresIn: this.configService.get<string>('auth.jwtRefreshExpiresIn') as any,
    });

    // Save refresh token - Note: UserSchema pre-save hook handles hashing
    await this.userService.updateUser(userId, { refreshToken });

    return { accessToken, refreshToken };
  }

  async refreshToken(user: {
    userId: string;
    email: string;
    role: string;
  }): Promise<{ accessToken: string }> {
    const payload = { email: user.email, sub: user.userId, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return await Promise.resolve({ accessToken });
  }

  async logout(userId: string): Promise<void> {
    await this.userService.updateUser(userId, { refreshToken: undefined });
  }
}
