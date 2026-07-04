import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersService } from '../users/users.service';
import { UsersController } from '../users/users.controller';
import { JwtStrategy } from '../auth/jwt.strategy'; // or ./jwt.strategy if same folder
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    PassportModule,
    DatabaseModule,
    JwtModule.register({
      // secret: process.env.JWT_SECRET || 'dev_secret',
      // signOptions: { expiresIn: '15m' },
    }),
  ],
  // controllers: [UsersController],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
