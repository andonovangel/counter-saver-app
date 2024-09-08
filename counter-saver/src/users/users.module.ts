import { Module } from '@nestjs/common';
import { UsersService } from './service/users/users.service';
import { UsersController } from './controller/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Count } from 'src/typeorm/entities/counts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Count])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
