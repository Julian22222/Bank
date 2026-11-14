import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthAdminService } from './auth-admin.service';
import { LoginAdminDto } from './dto/loginAdmin.dto';

@Controller('auth-admin')
export class AuthAdminController {
  constructor(private readonly authAdminService: AuthAdminService) {}

  @Get()
  test() {
    return { message: 'Auth Admin endpoint is working!' };
  }

  @Post('login')
  login(@Body() loginData: LoginAdminDto) {
    return this.authAdminService.login(loginData);
  }

  //When the admin logs out, we clear the cookies that store the JWT tokens. This effectively logs the user out on the client side, as they will no longer have a valid token to authenticate future requests.
  //when admin logedin - JWT is stored in HttpOnly cookies, so we clear those cookies to log the user out.
  //The frontend cannot delete HttpOnly cookies directly, so we create a logout endpoint that clears the cookies from the server side.
  //"admin_access_token" and "admin_refresh_token" are the names of the cookies we set when the user logs in, so we clear those specific cookies to log the admin out. These names should match the names used in the AuthService when setting the cookies.
  //this reset cookies if F-end and B-end use the same site
  // @Post('logout')
  // logout(@Res({ passthrough: true }) res: Response) {
  //   res.clearCookie('admin_access_token');
  //   res.clearCookie('admin_refresh_token');

  //   return {
  //     message: 'Logged out',
  //   };
  // }

  @Post('refresh')
  refresh(@Req() req: Request) {
    return this.authAdminService.refreshToken(req);
  }
}
