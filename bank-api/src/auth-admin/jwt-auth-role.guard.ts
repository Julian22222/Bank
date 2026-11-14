import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class JwtAuthRole implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    //JwtAuthGuard verifies that the user has a valid JWT.
    //JWTAuthRole checks whether request.user.role === 'superAdmin'.
    //If both pass, the controller method executes.
    if (!user || user.role !== 'superAdmin') {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
