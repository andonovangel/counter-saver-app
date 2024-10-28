import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/typeorm/entities/user.entity';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { UsersService } from 'src/users/service/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(): Promise<User[]> {
    const users = await this.userService.findAll();
    return users;
  }
}
