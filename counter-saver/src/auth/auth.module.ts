import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { UsersService } from 'src/users/service/users/users.service';
import { Counter } from 'src/typeorm/entities/counter.entity';
import { LocalStrategy } from './strategies/local.stategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-token.strategy';
import { RefreshToken } from 'src/refresh-tokens/refresh-token.entity';
import { RefreshTokenService } from 'src/refresh-tokens/refresh-token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.jwt_secret}`,
      signOptions: { expiresIn: '15min' },
    }),
    TypeOrmModule.forFeature([User, Counter, RefreshToken]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    RefreshTokenService,
  ],
})
export class AuthModule {}
