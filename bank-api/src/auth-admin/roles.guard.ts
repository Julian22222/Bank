import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}

//roles.decorator.ts and roles.guard.ts allow to use :
// Make the guard reusable for multiple roles

//Example of contorller
// @Get('dashboard')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('superAdmin')
// getDashboard() {
//   return 'Welcome Super Admin!';
// }

//Or allow multiple roles:
// @Get('users')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('superAdmin', 'admin')
// getUsers() {
//   return 'Users list';
// }

//(Roles decorator + RolesGuard). It is more scalable because you can protect routes with superAdmin, admin, user, or any other role without creating a new guard each time.

//jwt-aut-role.guard file chingg only superAdmin role, it is not for multiple roles
//Example in controller:
//   @UseGuards(JwtAuthGuard, JwtAuthRole)
