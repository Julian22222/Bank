import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-user.strategy'; // or ./jwt.strategy if same folder
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { EmailVerificationModule } from '../email-verification/email-verification.module';

@Module({
  imports: [
    UsersModule,
    EmailVerificationModule,
    PassportModule,
    DatabaseModule,
    JwtModule.register({
      // secret: process.env.JWT_SECRET || 'dev_secret',
      // signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
