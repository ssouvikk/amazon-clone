import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import { TOKENS } from '../../../shared/constants/tokens';
import { IUserService } from '../../user/interfaces/user.service.interface';

interface RequestWithCookies extends FastifyRequest {
  cookies: { [key: string]: string | undefined };
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    @Inject(TOKENS.USER_SERVICE)
    private readonly userService: IUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: unknown): string | null => {
          const req = request as RequestWithCookies;
          return req?.cookies?.['refresh_token'] || null;
        },
      ]),
      secretOrKey: configService.get<string>('auth.jwtRefreshSecret') as string,
      passReqToCallback: true,
    });
  }

  async validate(
    req: FastifyRequest,
    payload: { sub: string; email: string; role: string },
  ): Promise<{ userId: string; email: string; role: string }> {
    const refreshToken = (req as RequestWithCookies).cookies?.['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const user = await this.userService.getUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Securely compare hashed refresh token in DB
    // Note: The comparison logic is encapsulated in the Schema
    const isTokenValid = await user.compareRefreshToken(refreshToken);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
