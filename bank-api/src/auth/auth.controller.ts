import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';

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
  async login(
    @Body() loginData: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginData, res);
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
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refreshToken(req, res);
  }
}
