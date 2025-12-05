import { Module } from '@nestjs/common';
import { SignalDataService } from './signal-data.service';
import { SignalDataController } from './signal-data.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SignalDataController],
  providers: [SignalDataService],
  exports: [SignalDataService],
})
export class SignalDataModule {}






