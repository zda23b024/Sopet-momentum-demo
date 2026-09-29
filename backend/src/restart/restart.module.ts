import { Module } from '@nestjs/common';
import { RestartService } from './restart.service';
import { RestartController } from './restart.controller';
import { GoalsModule } from '../goals/goals.module';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [GoalsModule, ActionsModule],
  controllers: [RestartController],
  providers: [RestartService],
  exports: [RestartService],
})
export class RestartModule {}
