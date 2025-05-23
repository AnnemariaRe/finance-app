import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  serializeUser(user: User, done: Function) {
    done(null, user.id);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async deserializeUser(id: number, done: Function) {
    const user = await this.authService.findById(id);
    done(null, user);
  }
}
