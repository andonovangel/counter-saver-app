import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCounterDto } from 'src/counters/dtos/create-counter.dto';
import { CounterService } from 'src/counters/service/counter/counter.service';
import { Counter } from 'src/typeorm/entities/counter.entity';
import {
  CreateCounterParams,
  GetCounterParams,
} from 'src/utils/type';

@Controller('counters')
export class CountersController {
  constructor(private counterService: CounterService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getCounters(@Request() req): Promise<Counter[]> {
    return this.counterService.find(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getCounter(
    @Request() req,
    @Param('id') counterId: string,
  ): Promise<GetCounterParams> {
    return this.counterService.findOne(req.user.userId, counterId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createCounter(
    @Request() req,
    @Body() createCounterDto: CreateCounterDto,
  ): Promise<CreateCounterParams> {
    return this.counterService.create(req.user.userId, createCounterDto);
  }
}
