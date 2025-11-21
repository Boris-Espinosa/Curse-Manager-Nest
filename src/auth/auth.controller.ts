import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body(new ValidationPipe()) user: CreateUserDto) {
    return this.authService.register(user);
  }

  @Post('/login')
  login(@Body(new ValidationPipe()) user: LoginDto) {
    return this.authService.login(user);
  }
}
