import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  //<--this strategy depends from Guard: export class JwtUserGuard extends AuthGuard('jwt-user') {}
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.access_token ?? null;
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

// With no second argument, Passport registers every one of them under the same name, 'jwt'. When two strategies share a name, the last one registered overwrites the other. JwtAuthGuard (AuthGuard('jwt')) then uses whichever strategy happened to load last, based on module and provider order.
