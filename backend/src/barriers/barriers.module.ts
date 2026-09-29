import { Module } from '@nestjs/common';
import { BarriersService } from './barriers.service';
import { BarriersController } from './barriers.controller';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [ActionsModule],
  controllers: [BarriersController],
  providers: [BarriersService],
  exports: [BarriersService],
})
export class BarriersModule {}
