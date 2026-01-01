import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaClient } from '@todoai/db';

import type { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class TokenBudgetGuard implements CanActivate {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      return true; // Let other guards handle authentication
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: {
        aiTokenBudget: true,
        aiTokensUsedToday: true,
        tokenResetDate: true,
      },
    });

    if (!dbUser) {
      return true;
    }

    // Check if we need to reset daily tokens
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dbUser.tokenResetDate < today) {
      // Reset tokens for new day
      await this.prisma.user.update({
        where: { id: user.sub },
        data: {
          aiTokensUsedToday: 0,
          tokenResetDate: today,
        },
      });
      return true;
    }

    // Check if user has remaining budget
    if (dbUser.aiTokensUsedToday >= dbUser.aiTokenBudget) {
      throw new ForbiddenException({
        code: 'TOKEN_BUDGET_EXCEEDED',
        message: 'Daily AI token budget exceeded. Please try again tomorrow.',
        details: {
          used: dbUser.aiTokensUsedToday,
          budget: dbUser.aiTokenBudget,
          resetsAt: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        },
      });
    }

    return true;
  }
}

