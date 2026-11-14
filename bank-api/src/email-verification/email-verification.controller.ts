import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { Throttle } from '@nestjs/throttler';
import { JwtUserGuard } from '../auth/jwt-auth.guard';

// email-verification.controller.ts
@Controller('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post('verify')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  verify(@Body('token') token: string) {
    return this.emailVerificationService
      .verifyEmail(token)
      .then(() => ({ message: 'Email verified' }));
  }

  @Post('send')
  @UseGuards(JwtUserGuard)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async send(@Body('token') token: string, @Req() req) {
    await this.emailVerificationService.sendVerificationEmail(req.user.sub);
    return { message: 'If your email is unverified, a link has been sent.' };
  }
}
