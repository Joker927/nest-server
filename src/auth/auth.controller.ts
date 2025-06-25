import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.signUp(email, password);
  }

  @Post('signin')
  async signIn(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.signIn(email, password);
  }

  @Post('signout')
  async signOut() {
    return this.authService.signOut();
  }
}
