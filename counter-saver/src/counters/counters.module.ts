import { Module } from '@nestjs/common';
import { CounterService } from './service/counter/counter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Counter } from 'src/typeorm/entities/counter.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { CountersController } from './controller/counters/counters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Counter])],
  controllers: [CountersController],
  providers: [CounterService]
})
export class CountersModule {}
