import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/roles.enum';
import { getMetadataArgsStorage } from 'typeorm';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const user = context.switchToHttp().getRequest().clientUser;
    const hasRequiredRoles = requiredRoles.some((role) => user.role === role);
    if (!hasRequiredRoles)
      throw new UnauthorizedException(
        'You dont have the permissions to access this route',
      );
    return true;
  }
}
