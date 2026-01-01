import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { createUserSchema, loginSchema } from '@todoai/types';

import { Public } from '../../common/decorators/public.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(createUserSchema)) body: unknown
  ) {
    return this.authService.register(body as Parameters<typeof this.authService.register>[0]);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: unknown
  ) {
    return this.authService.login(body as Parameters<typeof this.authService.login>[0]);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() body: RefreshTokenDto) {
    await this.authService.logout(body.refreshToken);
  }
}

