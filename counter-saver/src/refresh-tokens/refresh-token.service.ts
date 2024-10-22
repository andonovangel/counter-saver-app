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

  findOne(refreshToken: RefreshToken) {
    return this.refreshTokenRepository.findOne({
      where: { tokenId: refreshToken.tokenId },
      relations: ['user'],
    });
  }

  save(refreshToken: RefreshToken) {
    this.refreshTokenRepository.save(refreshToken);
  }

  create(tokenId: string, newRefreshToken: string, user: User) {
    return this.refreshTokenRepository.create({
      tokenId,
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
  
  deleteByTokenId(tokenId: string) {
    this.refreshTokenRepository.delete({ tokenId });
  }
}
