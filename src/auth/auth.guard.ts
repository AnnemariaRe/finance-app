import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return true;
  }
}
