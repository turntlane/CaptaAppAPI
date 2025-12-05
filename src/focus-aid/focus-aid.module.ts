import { Module } from '@nestjs/common';
import { FocusAidService } from './focus-aid.service';
import { FocusAidController } from './focus-aid.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FocusAidController],
  providers: [FocusAidService],
  exports: [FocusAidService],
})
export class FocusAidModule {}






