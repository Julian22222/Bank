import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { JwtUserGuard } from './jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  test() {
    return { message: 'Auth endpoint is working!' };
  }

  // @Post('login')
  // login(@Body() loginData: LoginDto) {
  //   return this.authService.login(loginData);
  // }

  @Post('login')
  login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  //When the user logs out, we clear the cookies that store the JWT tokens. This effectively logs the user out on the client side, as they will no longer have a valid token to authenticate future requests.
  //when user logedin - JWT is stored in HttpOnly cookies, so we clear those cookies to log the user out.
  //The frontend cannot delete HttpOnly cookies directly, so we create a logout endpoint that clears the cookies from the server side.
  //"access_token" and "refresh_token" are the names of the cookies we set when the user logs in, so we clear those specific cookies to log the user out. These names should match the names used in the AuthService when setting the cookies.
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return {
      message: 'Logged out',
    };
  }

  @Post('refresh')
  refresh(@Req() req: Request) {
    return this.authService.refreshToken(req);
  }

  // RESEND email verification
  @Post('send-verification')
  @UseGuards(JwtUserGuard)
  @Throttle({ default: { limit: 3, ttl: 60_000 } }) // 3 per minute
  async sendVerification(@Req() req) {
    await this.authService.sendVerificationEmail(req.user.sub);
    return {
      message:
        'If your email is unverified, a verification link has been sent.',
    };
  }
}
