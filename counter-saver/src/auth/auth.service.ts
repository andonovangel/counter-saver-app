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

  async login(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const hash = await bcrypt.hash(refreshToken, 10);
    const tokenId = uuidv4();

    const newToken = this.refreshTokenService.create(tokenId, hash, user);
    this.refreshTokenService.save(newToken);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async logout(username: string) {
    const user: User = await this.userService.findOneWithUsername(username);
    const refreshToken = user.refreshTokens.find(i => !i.isRevoked && i.expiresAt > new Date());
    this.refreshTokenService.deleteByTokenId(refreshToken.tokenId);
  }

  async refreshToken(oldRefreshToken: RefreshToken) {
    const existingToken: RefreshToken =
      await this.refreshTokenService.findOne(oldRefreshToken);

    if (!existingToken || existingToken.isRevoked) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (existingToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const isValid = await bcrypt.compare(oldRefreshToken.token, existingToken.token);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    existingToken.isRevoked = true;
    this.refreshTokenService.save(existingToken);

    const tokenId = uuidv4();
    const user: User = existingToken.user;
    const payload = {
      username: user.username,
      sub: user.id,
    };
    const accessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const newToken = this.refreshTokenService.create(tokenId, newRefreshToken, user);
    const hash = await bcrypt.hash(newToken.token, 10);
    const refreshToken = newToken.token;
    newToken.token = hash;
    this.refreshTokenService.save(newToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
