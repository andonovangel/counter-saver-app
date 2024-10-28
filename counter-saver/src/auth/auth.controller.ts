import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/service/users/users.service';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  LoginParams,
  RefreshTokenParams,
  SignupParams,
} from 'src/utils/type';
import { User } from 'src/typeorm/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto): Promise<SignupParams> {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: AuthenticatedRequest): Promise<LoginParams> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Request() req: AuthenticatedRequest): void {
    this.authService.logout(req.user.id);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refreshToken(
    @Request() req: AuthenticatedRequest,
  ): Promise<RefreshTokenParams> {
    return this.authService.refreshToken(req.user.id);
  }
}
