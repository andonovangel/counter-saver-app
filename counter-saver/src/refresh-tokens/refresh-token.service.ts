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

  findOneByUserId(userId: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  findOne(token: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });
  }

  save(refreshToken: RefreshToken): void {
    this.refreshTokenRepository.save(refreshToken);
  }

  create(newRefreshToken: string, user: User): RefreshToken {
    return this.refreshTokenRepository.create({
      token: newRefreshToken,
      user: user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  delete(token: string): void {
    this.refreshTokenRepository.delete({ token });
  }
}
