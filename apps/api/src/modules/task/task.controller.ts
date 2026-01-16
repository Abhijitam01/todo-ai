import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { completeTaskInstanceSchema } from '@todoai/types';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('today')
  async getTodayTasks(@CurrentUser('sub') userId: string) {
    return this.taskService.getTodayTasks(userId);
  }

  @Get('calendar')
  async getCalendarTasks(
    @CurrentUser('sub') userId: string,
    @Query('start') startDate?: string,
    @Query('end') endDate?: string
  ) {
    return this.taskService.getCalendarTasks(userId, startDate, endDate);
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  async startTask(
    @CurrentUser('sub') userId: string,
    @Param('id') instanceId: string
  ) {
    return this.taskService.startTask(userId, instanceId);
  }

  @Patch(':id/complete')
  async completeTask(
    @CurrentUser('sub') userId: string,
    @Param('id') instanceId: string,
    @Body(new ZodValidationPipe(completeTaskInstanceSchema)) body: unknown
  ) {
    return this.taskService.completeTask(
      userId,
      instanceId,
      body as Parameters<typeof this.taskService.completeTask>[2]
    );
  }

  @Post(':id/skip')
  @HttpCode(HttpStatus.OK)
  async skipTask(
    @CurrentUser('sub') userId: string,
    @Param('id') instanceId: string
  ) {
    return this.taskService.skipTask(userId, instanceId);
  }
}

