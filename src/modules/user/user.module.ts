import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { User, UserSchema } from './schemas/user.schema';

import { TOKENS } from '../../shared/constants/tokens';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [
    {
      provide: TOKENS.USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: TOKENS.USER_SERVICE,
      useClass: UserService,
    },
  ],
  exports: [TOKENS.USER_SERVICE, TOKENS.USER_REPOSITORY],
})
export class UserModule {}
