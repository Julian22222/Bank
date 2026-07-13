import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { PG_POOL } from '../database/database.module';
import { Pool } from 'pg';
import { AdminResponseDto } from './dto/response-admin.dto';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthAdminService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginData: LoginAdminDto, res: Response) {
    const { email, password, rememberMe } = loginData;

    const result = await this.pool.query(
      `SELECT * FROM admins WHERE email = $1`,
      [email],
    );

    const admin = result.rows[0];

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 👇 JWT payload (keep it small!)
    const payload = {
      sub: admin.customer_id,
      email: admin.email,
      role: admin.role,
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

    const adminResponse: AdminResponseDto = {
      //returning user data with no password
      admin_id: admin.customer_id,
      role: admin.role,
      admin_name: admin.first_name,
      email: admin.email,
      phone: admin.phone,
      customer_address: admin.customer_address,
      dob: admin.dob,
      created_at: admin.created_at,
    };

    return {
      adminResponse,
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
          // secret: process.env.JWT_SECRET,
          secret: this.configService.get<string>('JWT_SECRET'),
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
