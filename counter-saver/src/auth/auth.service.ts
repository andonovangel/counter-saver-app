import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/typeorm/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/service/users/users.service';
import { RefreshTokenService } from 'src/refresh-tokens/refresh-token.service';
import { RefreshToken } from 'src/refresh-tokens/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneWithUsername(username);
    if (user && bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  createAccessToken(user: User) {
    const accessPayload = {
      username: user.username,
      sub: user.id,
    };
    return this.jwtService.sign(accessPayload);
  }

  createRefreshToken(user: User, jti: string) {
    const refreshPayload = {
      sub: user.id,
      jti,
    };
    return this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
    });
  }

  async login(user: User) {
    const jti = uuidv4();
    const accessToken = this.createAccessToken(user);
    const refreshToken = this.createRefreshToken(user, jti);

    const newToken = this.refreshTokenService.create(jti, user);
    this.refreshTokenService.save(newToken);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async logout(username: string) {
    const user: User = await this.userService.findOneWithUsername(username);
    const refreshToken = user.refreshTokens.find(
      (i) => !i.isRevoked && i.expiresAt > new Date(),
    );
    this.refreshTokenService.delete(refreshToken.token);
  }

  async refreshToken(oldRefreshTokenJti: string) {
    const existingToken: RefreshToken =
      await this.refreshTokenService.findOne(oldRefreshTokenJti);

    if (!existingToken || existingToken.isRevoked) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (existingToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    existingToken.isRevoked = true;
    this.refreshTokenService.save(existingToken);

    const user: User = existingToken.user;
    const jti = uuidv4();
    const accessToken = this.createAccessToken(user);
    const newRefreshToken = this.createRefreshToken(user, jti);

    const newToken = this.refreshTokenService.create(jti, user);
    this.refreshTokenService.save(newToken);

    return {
      accessToken,
      newRefreshToken,
    };
  }
}
