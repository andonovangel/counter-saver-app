import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthParams } from 'src/utils/type';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, username: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await this.hashData(rt);
    await this.userRepository.update({ id: userId }, { refresh_token: hash });
  }

  async signup(data: AuthParams): Promise<Tokens> {
    const hash = await this.hashData(data.password);
    const newUser = this.userRepository.create({
      username: data.username,
      password: hash,
      createdAt: new Date(),
    });
    await this.userRepository.save(newUser);

    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async login(data: AuthParams): Promise<Tokens> {
    const user = await this.userRepository.findOneBy({
      username: data.username,
    });
    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
      refresh_token: Not(IsNull()),
    });

    if (user) {
      user.refresh_token = null;
      await this.userRepository.save(user);
    }
  }

  async refreshTokens(userId: number, refresh_token: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !user.refresh_token)
      throw new ForbiddenException('Access Denied');

    Logger.log(user.refresh_token);
    const rtMatches = await bcrypt.compare(refresh_token, user.refresh_token);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
}
