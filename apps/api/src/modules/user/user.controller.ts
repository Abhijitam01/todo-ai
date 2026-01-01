import { Body, Controller, Get, Patch } from '@nestjs/common';
import { updateUserSchema } from '@todoai/types';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@CurrentUser('sub') userId: string) {
    return this.userService.findById(userId);
  }

  @Patch('me')
  async updateMe(
    @CurrentUser('sub') userId: string,
    @Body(new ZodValidationPipe(updateUserSchema)) body: unknown
  ) {
    return this.userService.update(userId, body as Parameters<typeof this.userService.update>[1]);
  }

  @Get('me/stats')
  async getStats(@CurrentUser('sub') userId: string) {
    return this.userService.getStats(userId);
  }

  @Patch('preferences')
  async updatePreferences(
    @CurrentUser('sub') userId: string,
    @Body(new ZodValidationPipe(updateUserSchema.shape.preferences)) body: unknown
  ) {
    return this.userService.update(userId, { preferences: body as Record<string, unknown> });
  }
}

