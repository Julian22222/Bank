import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { PG_POOL } from '../database/database.module';
import { Pool } from 'pg';
import { UserResponseDto } from './dto/response-user.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginData: LoginDto, res: Response) {
    const { email, password } = loginData;

    const result = await this.pool.query(
      `SELECT * FROM customers WHERE email = $1`,
      [email],
    );

    const user = result.rows[0];

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 👇 JWT payload (keep it small!)
    const payload = {
      sub: user.customer_id,
      email: user.email,
      // user: user.role
    };

    // 🔐 Access Token
    const accessToken = this.jwtService.sign(payload, {
      // secret: process.env.JWT_SECRET,
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });

    // 🔄 Refresh Token
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // 🍪 STORE BOTH IN HTTPONLY COOKIES
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userResponse: UserResponseDto = {
      //returning user data with no password
      customer_id: user.customer_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      customer_address: user.customer_address,
      dob: user.dob,
      created_at: user.created_at,
    };

    return {
      userResponse,
    };
  }

  //refresh token should come from COOKIE, not from body or header for better security
  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        throw new UnauthorizedException('No refresh token');
      }

      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const accessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          // email: payload.email,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '15m',
        },
      );

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });

      // res.cookie('refresh_token', refreshToken, {
      //   httpOnly: true,
      //   secure: false,
      //   sameSite: 'lax',
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // });

      return { message: 'token refreshed' };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
