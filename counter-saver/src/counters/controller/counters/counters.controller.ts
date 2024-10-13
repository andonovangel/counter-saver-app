import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUser } from 'src/common/decorators';
import { CreateCounterDto } from 'src/counters/dtos/create-counter.dto';
import { CounterService } from 'src/counters/service/counter/counter.service';
import { Counter } from 'src/typeorm/entities/counter.entity';
import { CreateCounterParams, GetCounterParams, GetCountersParams,  } from 'src/utils/type';

@Controller('counters')
export class CountersController {
  constructor(private counterService: CounterService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  getCounters(
    @GetCurrentUser('sub') userId: number,
  ): Promise<Counter[]> {
    return this.counterService.getAll(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  getCounter(
    @GetCurrentUser('sub') userId: number,
    @Param('id') counterId: number,
  ): Promise<GetCounterParams> {
    return this.counterService.get(userId, counterId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  createCounter(
    @GetCurrentUser('sub') userId: number,
    @Body() createCounterDto: CreateCounterDto,
  ): Promise<CreateCounterParams> {
    return this.counterService.create(userId, createCounterDto);
  }
}
