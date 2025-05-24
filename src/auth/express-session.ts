import 'express-session';
import { User } from '../entities/user.entity';

declare module 'express-session' {
  interface Session {
    user?: User;
  }
}
