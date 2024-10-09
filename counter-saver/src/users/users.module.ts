import { Module } from '@nestjs/common';
import { UsersService } from './service/users/users.service';
import { UsersController } from './controller/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Counter } from 'src/typeorm/entities/counter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Counter])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
