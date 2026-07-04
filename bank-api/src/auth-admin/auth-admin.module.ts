import { Module } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { AuthAdminController } from './auth-admin.controller';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    DatabaseModule,
    JwtModule.register({
      // secret: process.env.JWT_SECRET || 'dev_secret',
      // signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthAdminController],
  providers: [JwtStrategy, AuthAdminService],
  exports: [JwtModule],
})
export class AuthAdminModule {}
