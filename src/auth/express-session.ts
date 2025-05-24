import 'express-session';
import { User } from 'src/entities/user.entity';

declare module 'express-session' {
  interface Session {
    user?: User;
  }
}
