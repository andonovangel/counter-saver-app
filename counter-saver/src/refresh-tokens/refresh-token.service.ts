import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/entities/user.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  findOneByUserId(userId: number) {
    return this.refreshTokenRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  findOne(token: string) {
    return this.refreshTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });
  }

  save(refreshToken: RefreshToken) {
    this.refreshTokenRepository.save(refreshToken);
  }

  create(newRefreshToken: string, user: User) {
    return this.refreshTokenRepository.create({
      token: newRefreshToken,
      user: user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  update(newRefreshToken: string, user: User) {
    return this.refreshTokenRepository.update(
      { user },
      {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    );
  }

  delete(token: string) {
    this.refreshTokenRepository.delete({ token });
  }
}
