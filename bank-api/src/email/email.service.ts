// email.service.ts
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.getOrThrow<string>('RESEND_API_KEY'));
  }

  //send a link via RESEND Free email service
  async sendVerificationEmailLink(userEmail: string, token: string) {
    const appUrl = this.config.getOrThrow<string>('APP_URL');
    const verifyUrl = `${appUrl}/verify-email?token=${token}`;

    const { error } = await this.resend.emails.send({
      from: this.config.getOrThrow<string>('EMAIL_FROM'),
      to: userEmail,
      subject: 'Verify your email address',
      html: `
        <p>Please confirm your email address to activate your account.</p>
        <p><a href="${verifyUrl}">Verify email</a></p>
        <p>This link expires in 15 minutes. If you didn't request this, ignore this email.</p>
      `,
    });

    if (error) {
      this.logger.error(`Resend failed: ${error.message}`);
      throw new InternalServerErrorException(
        'Could not send verification email',
      );
    }
  }
}
