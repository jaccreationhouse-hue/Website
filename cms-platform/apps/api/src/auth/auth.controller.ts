import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service.js';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

class RefreshDto {
  @IsString()
  refreshToken!: string;
}

@ApiTags('auth')
@Controller('v1/auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() input: LoginDto) {
    return this.auth.login(input.email, input.password);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() input: RefreshDto) {
    return this.auth.refresh(input.refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Body() input: RefreshDto) {
    return this.auth.logout(input.refreshToken);
  }
}
