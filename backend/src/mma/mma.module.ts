import { Module } from '@nestjs/common';
import { MmaService } from './mma.service';
import { MmaController } from './mma.controller';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [ActionsModule],
  controllers: [MmaController],
  providers: [MmaService],
  exports: [MmaService],
})
export class MmaModule {}
