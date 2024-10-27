import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Counter } from 'src/typeorm/entities/counter.entity';
import { CreateCounterParams, GetCounterParams } from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class CounterService {
  constructor(
    @InjectRepository(Counter) private counterRepository: Repository<Counter>,
  ) {}

  async find(userId: number): Promise<Counter[]> {
    const counters = await this.counterRepository.find({
      where: { userId },
    });
    return counters;
  }

  async findOne(userId: number, counterId: string): Promise<GetCounterParams> {
    return this.counterRepository.findOne({
      where: {
        id: counterId,
        userId,
      },
    });
  }

  async create(
    userId: number,
    data: CreateCounterParams,
  ): Promise<CreateCounterParams> {
    const newCounter = this.counterRepository.create({
      ...data,
      createdAt: new Date(),
      userId,
    });
    await this.counterRepository.save(newCounter);

    return newCounter;
  }
}
