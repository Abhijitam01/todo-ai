import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { createGoalSchema, paginationQuerySchema, updateGoalSchema } from '@todoai/types';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

import { GoalService } from './goal.service';

@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  async create(
    @CurrentUser('sub') userId: string,
    @Body(new ZodValidationPipe(createGoalSchema)) body: unknown
  ) {
    return this.goalService.create(userId, body as Parameters<typeof this.goalService.create>[1]);
  }

  @Get()
  async findAll(
    @CurrentUser('sub') userId: string,
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: { page: number; limit: number },
    @Query('status') status?: string
  ) {
    return this.goalService.findAll(userId, {
      status,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id') goalId: string
  ) {
    return this.goalService.findById(userId, goalId);
  }

  @Patch(':id')
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id') goalId: string,
    @Body(new ZodValidationPipe(updateGoalSchema)) body: unknown
  ) {
    return this.goalService.update(userId, goalId, body as Parameters<typeof this.goalService.update>[2]);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id') goalId: string
  ) {
    await this.goalService.delete(userId, goalId);
  }
}

