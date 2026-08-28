// async refreshToken(refreshTokenDto: { refreshToken: string }) {
//   try {
//     const { refreshToken } = refreshTokenDto;

//     if (!refreshToken) {
//       throw new UnauthorizedException('No refresh token');
//     }

//     const payload = this.jwtService.verify(refreshToken, {
//       secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
//     });

//     const accessToken = this.jwtService.sign(
//       { sub: payload.sub, email: payload.email },
//       {
//         secret: this.configService.get<string>('JWT_SECRET'),
//         expiresIn: '15m',
//       },
//     );

//     return { accessToken };
//   } catch {
//     throw new UnauthorizedException('Invalid refresh token');
//   }
// }
