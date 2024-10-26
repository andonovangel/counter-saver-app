import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Counter } from 'src/typeorm/entities/counter.entity';
import { User } from 'src/typeorm/entities/user.entity';
import {
  CreateCounterParams,
  GetCounterParams,
} from 'src/utils/type';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class CounterService {
  constructor(
    @InjectRepository(Counter) private counterRepository: Repository<Counter>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAll(userId: number): Promise<Counter[]> {
    const user = await this.userRepository.findOneBy({
      id: userId,
      refreshToken: Not(IsNull()),
    });

    if (!user) {
      throw new HttpException(
        'User not found. Cannot create counter',
        HttpStatus.BAD_REQUEST,
      );
    }
    const counters = await this.counterRepository.find();
    return counters;
  }

  async get(userId: number, counterId: number): Promise<GetCounterParams> {
    const user = await this.userRepository.findOneBy({
      id: userId,
      refreshToken: Not(IsNull()),
    });

    if (!user) {
      throw new HttpException(
        'User not found. Cannot create counter',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.counterRepository.findOneBy({ id: counterId });
  }

  async create(
    userId: number,
    data: CreateCounterParams,
  ): Promise<CreateCounterParams> {
    const user = await this.userRepository.findOneBy({
      id: userId,
      refreshToken: Not(IsNull()),
    });

    if (!user) {
      throw new HttpException(
        'User not found. Cannot create counter',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCounter = this.counterRepository.create({
      ...data,
      createdAt: new Date(),
      user,
    });

    return this.counterRepository.save(newCounter);
  }
}
