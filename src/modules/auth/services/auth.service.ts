import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TOKENS } from '../../../shared/constants/tokens';
import { IUserService } from '../../user/interfaces/user.service.interface';
import { IAuthService } from '../interfaces/auth.service.interface';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserDocument } from '../../user/schemas/user.schema';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(TOKENS.USER_SERVICE)
    private readonly userService: IUserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });
  }

  async validateUser(loginDto: LoginDto): Promise<UserDocument> {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: UserDocument): Promise<unknown> {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return Promise.resolve({
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  }

  async refreshToken(user: { userId: string; email: string; role: string }): Promise<unknown> {
    const payload = { email: user.email, sub: user.userId, role: user.role };
    return Promise.resolve({
      access_token: this.jwtService.sign(payload),
    });
  }
}
