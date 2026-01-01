import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { paginationQuerySchema } from '@todoai/types';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findAll(
    @CurrentUser('sub') userId: string,
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: { page: number; limit: number },
    @Query('unreadOnly') unreadOnly?: string
  ) {
    return this.notificationService.findByUser(userId, {
      unreadOnly: unreadOnly === 'true',
      page: query.page,
      limit: query.limit,
    });
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser('sub') userId: string) {
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAsRead(
    @CurrentUser('sub') userId: string,
    @Param('id') notificationId: string
  ) {
    await this.notificationService.markAsRead(userId, notificationId);
  }

  @Post('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@CurrentUser('sub') userId: string) {
    await this.notificationService.markAllAsRead(userId);
  }
}

