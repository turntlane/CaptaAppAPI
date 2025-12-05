import { Module } from '@nestjs/common';
import { BaselineService } from './baseline.service';
import { BaselineController } from './baseline.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BaselineController],
  providers: [BaselineService],
  exports: [BaselineService],
})
export class BaselineModule {}






