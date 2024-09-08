import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Count } from 'src/typeorm/entities/counts.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { CreateUserCounterParams, CreateUserParams, UpdateUserParams } from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Count) private counterRepository: Repository<Count>,
  ) {}

  findUsers() {
    return this.userRepository.find({ relations: ['counts'] });
  }

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });

    return this.userRepository.save(newUser);
  }

  updateUser(id: number, userDetails: UpdateUserParams) {
    return this.userRepository.update({ id }, { ...userDetails });
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  async createUserCounter(id: number, userCounterDetails: CreateUserCounterParams) {
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
