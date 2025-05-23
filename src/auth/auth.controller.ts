import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    Body,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Get('login')
    getLogin(@Res() res) {
      res.render('login'); // views/login.hbs
    }
  
    @Post('login')
    async login(@Req() req, @Res() res) {
      const { email, password } = req.body;
      const user = await this.authService.validateUser(email, password);
      if (!user) return res.redirect('/auth/login?error=1');

      return new Promise<void>((resolve, reject) => {
        req.login(user, (err) => {
          if (err) {
            reject(new UnauthorizedException('Login failed'));
          } else {
            res.redirect('/');
            resolve();
          }
        });
      });
    }
  
    @Get('register')
    getRegister(@Res() res) {
      res.render('register');
    }
  
    @Post('register')
    async register(@Body() body, @Res() res) {
      await this.authService.register(body.email, body.name, body.password);
      res.redirect('/auth/login');
    }
  
    @Get('logout')
    logout(@Req() req, @Res() res) {
      req.session.destroy(() => res.redirect('/auth/login'));
    }
  }
  