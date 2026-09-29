import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { GoalsModule } from '../goals/goals.module';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [GoalsModule, ActionsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
