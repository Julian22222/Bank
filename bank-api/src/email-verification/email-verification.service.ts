// email-verification.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { VerificationRepo } from './verification.repo';
import { EmailService } from '../email/email.service';

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly verificationRepo: VerificationRepo,
    private readonly emailService: EmailService,
  ) {}

  async creatingAndDistributingTokens(userId: number) {
    const user = await this.usersService.findOne(userId); // throws NotFound if missing

    // console.log('From EmailVerificationService', user);

    if (user.email_verified) return;

    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');

    //randomBytes(32):
    // It generates 32 bytes (256 bits) of cryptographically secure random data, and .toString('hex') turns that into a 64-character string like 9f3a...c1. This is the verification token: the secret that goes into the link you email to the user (/verify-email?token=9f3a...).
    // Don’t use Math.random() or a timestamp for this. They are predictable, so an attacker could guess other users’ tokens. randomBytes uses the operating system’s secure random source, which is what you want for anything security-related.

    //createHash('sha256') - createHash('sha256').update(token).digest('hex') produces a fixed 64-character fingerprint. You can’t reverse it to get the token back.

    // The raw token is sent to the user in the email and never stored.
    // The tokenHash is stored in the database.

    // Why SHA-256 here and not bcrypt
    // For passwords you use bcrypt because passwords are low-entropy and need a slow hash to resist brute force. This token is 256 bits of pure randomness, so it can’t be brute-forced, and a fast hash like SHA-256 is fine. It also lets you look up the row directly by hash.

    await this.verificationRepo.addingVerificationToDB({
      userId: user.customer_id,
      tokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    await this.emailService.sendVerificationEmailLink(user.email, token);
  }

  async verifyEmail(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const customerId = await this.verificationRepo.compareTokens(tokenHash);

    if (customerId !== null) {
      return { message: 'Email verified' };
    } else {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
