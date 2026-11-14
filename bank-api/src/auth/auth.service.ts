import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PG_POOL } from '../database/database.module';
import { Pool } from 'pg';
import { UserResponseDto } from './dto/response-user.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { randomBytes, createHash } from 'crypto';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { VerificationRepo } from '../email-verification/verification.repo';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly userService: UsersService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly verificationRepo: VerificationRepo,
  ) {}

  async login(loginData: LoginDto) {
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
      await this.pool.query(
        `UPDATE customers SET failed_login_attempts = failed_login_attempts + 1 WHERE customer_id = $1`,
        [user.customer_id],
      );

      if (user.failed_login_attempts + 1 >= 3) {
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + 15); // Lock for 15 minutes

        await this.pool.query(
          `UPDATE customers SET account_locked_until = $1 WHERE customer_id = $2`,
          [lockUntil, user.customer_id],
        );
      }
      throw new UnauthorizedException('Invalid email or password');
    }

    if (
      user.account_locked_until &&
      new Date(user.account_locked_until) > new Date()
    ) {
      throw new HttpException(
        'Account temporarily locked',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Reset failed_login_attempts and account_lock_until on successful login
    await this.pool.query(
      `UPDATE customers SET failed_login_attempts = 0, account_locked_until = NULL WHERE customer_id = $1`,
      [user.customer_id],
    );

    // 👇 JWT payload (keep it small!)
    const payload = {
      sub: user.customer_id,
      email: user.email,
      // role: user.role
      //subscription: "premium"
    };

    console.log('--- LOGIN DEBUG ---');
    console.log(
      'process.env.JWT_SECRET at request time:',
      !!process.env.JWT_SECRET,
    );
    console.log(
      'ConfigService JWT_SECRET at request time:',
      !!this.configService.get<string>('JWT_SECRET'),
    );

    // 🔐 create Access Token
    const accessToken = this.jwtService.sign(payload, {
      // secret: process.env.JWT_SECRET,
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });

    // 🔄 create Refresh Token
    const refreshToken = this.jwtService.sign(payload, {
      // secret: process.env.JWT_REFRESH_SECRET,
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    // 🍪 STORE BOTH IN HTTPONLY COOKIES
    // res.cookie('access_token', accessToken, {
    //   httpOnly: true,
    //   secure: true, // true in production (HTTPS)
    //   sameSite: 'none', //in production-  sameSite:"none", or 'lax' if you want to allow cross-site requests,
    //   // // 'lax' can block cross-site cookies in some browsers/setups
    //   maxAge: 15 * 60 * 1000,
    // });

    // res.cookie('refresh_token', refreshToken, {
    //   httpOnly: true,
    //   secure: true, // true in production (HTTPS)
    //   sameSite: 'none', //in production-  sameSite:"none", or 'lax' if you want to allow cross-site requests,
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

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
      accessToken,
      refreshToken,
    };
  }

  //refresh token should come from COOKIE, not from body or header for better security
  async refreshToken(req: Request) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        throw new UnauthorizedException('No refresh token');
      }

      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const accessToken = this.jwtService.sign(
        {
          sub: payload.sub,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      );

      return {
        accessToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  //RESEND email verification
  async sendVerificationEmail(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user || user.email_verified) return; // silent no-op

    //
    const token = randomBytes(32).toString('hex'); //create cryptographically secure random data (like 9f3a...c1)
    const tokenHash = createHash('sha256').update(token).digest('hex'); //hash the string, This is the verification token: the secret that goes into the link you email to the user (/verify-email?token=9f3a...).
    //Don’t use Math.random() or a timestamp for tokenHash, it is not secured
    //createHash('sha256') -It hashes the token one-way: createHash('sha256').update(token).digest('hex') produces a fixed 64-character fingerprint. You can’t reverse it to get the token back.
    //The raw token is sent to the user in the email and never stored.
    //Why SHA-256 here and not bcrypt? For passwords you use bcrypt because passwords are low-entropy and need a slow hash to resist brute force. This token is 256 bits of pure randomness, so it can’t be brute-forced, and a fast hash like SHA-256 is fine. It also lets you look up the row directly by hash.
    //When the user clicks the link, hash the incoming token the same way and compare it with what’s stored:

    await this.verificationRepo.invalidateOld(user.customer_id);
    await this.verificationRepo.create({
      userId: user.customer_id,
      tokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    await this.emailVerificationService.sendVerificationEmail(user.customer_id);
  }
}
