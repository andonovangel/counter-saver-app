import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Counter } from 'src/typeorm/entities/counter.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { CreateUserParams } from 'src/utils/type';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Counter) private counterRepository: Repository<Counter>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['refreshToken'],
    });
  }

  findOneWithUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['refreshToken'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<CreateUserParams> {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      username: createUserDto.username,
      password: hash,
    });
    await this.userRepository.save(user);
    const { password, ...result } = user;
    return result;
  }
}
