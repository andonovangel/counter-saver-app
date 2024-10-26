import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Counter } from 'src/typeorm/entities/counter.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import {
  CreateCounterParams,
  UpdateUserParams,
} from 'src/utils/type';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Counter) private counterRepository: Repository<Counter>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id }, relations: ['refreshToken'] });
  }

  findOneWithUsername(username: string) {
    return this.userRepository.findOne({ where: { username }, relations: ['refreshToken'] });
  }

  async create(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({ username: createUserDto.username, password: hash });
    await this.userRepository.save(user);
    const { password, ...result } = user;
    return result;
  }

  updateUser(id: number, userDetails: UpdateUserParams) {
    return this.userRepository.update({ id }, { ...userDetails });
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  async createUserCounter(id: number, userCounterDetails: CreateCounterParams) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        'User not found. Cannot create counter',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCounter = this.counterRepository.create({
      ...userCounterDetails,
      createdAt: new Date(),
      user,
    });

    return this.counterRepository.save(newCounter);
  }
}
