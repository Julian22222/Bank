import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.access_token;
        },
      ]),
      // secretOrKey: process.env.JWT_SECRET,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  //After JwtAuthGuard validates the token, your JwtStrategy returns:
  async validate(payload: any) {
    return payload; // this becomes req.user
  }
}
