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
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { CreateCounterDto } from 'src/counters/dtos/create-counter.dto';
import { CounterService } from 'src/counters/service/counter/counter.service';
import { Counter } from 'src/typeorm/entities/counter.entity';
import { CreateCounterParams, GetCounterParams, GetCountersParams,  } from 'src/utils/type';

@Controller('counters')
export class CountersController {
  constructor(private counterService: CounterService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  getCounters(
    @Request() req,
  ): Promise<Counter[]> {
    return this.counterService.find(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getCounter(
    @Request() req,
    @Param('id') counterId: number,
  ): Promise<GetCounterParams> {
    return this.counterService.findOne(req.user.userId, counterId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createCounter(
    @Request() req,
    @Body() createCounterDto: CreateCounterDto,
  ): Promise<CreateCounterParams> {
    return this.counterService.create(req.user.userId, createCounterDto);
  }
}
