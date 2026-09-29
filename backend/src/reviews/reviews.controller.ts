import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateWeeklyReviewDto } from './dto/reviews.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@ApiTags('Weekly Review & Lessons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('reviews')
  @ApiOperation({ summary: 'List weekly momentum reviews for authenticated user' })
  @ApiQuery({ name: 'goalId', required: false })
  async getReviews(
    @CurrentUser() user: AuthenticatedUser,
    @Query('goalId') goalId?: string,
  ) {
    return await this.reviewsService.getReviews(user.id, goalId);
  }

  @Post('reviews')
  @ApiOperation({ summary: 'Submit Weekly Momentum Review (creates reflection, extracts lessons, anchors Next NMA)' })
  async createReview(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWeeklyReviewDto,
  ) {
    return await this.reviewsService.createWeeklyReview(user.id, dto);
  }

  @Get('lessons')
  @ApiOperation({ summary: 'List extracted personal lessons and concrete behavioral adjustments' })
  async getLessons(@CurrentUser() user: AuthenticatedUser) {
    return await this.reviewsService.getLessons(user.id);
  }
}
