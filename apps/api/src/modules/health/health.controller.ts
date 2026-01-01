import { Controller, Get } from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator';

import { HealthService } from './health.service';

@Controller('health')
@Public()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth() {
    return this.healthService.getHealth();
  }

  @Get('live')
  async getLiveness() {
    return this.healthService.getLiveness();
  }

  @Get('ready')
  async getReadiness() {
    return this.healthService.getReadiness();
  }
}

