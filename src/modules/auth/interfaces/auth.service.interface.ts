import { UserDocument } from '../../user/schemas/user.schema';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

export interface IAuthService {
  register(registerDto: RegisterDto): Promise<UserDocument>;
  validateUser(loginDto: LoginDto): Promise<UserDocument>;
  login(user: UserDocument): Promise<unknown>;
  refreshToken(user: { userId: string; email: string; role: string }): Promise<unknown>;
}
