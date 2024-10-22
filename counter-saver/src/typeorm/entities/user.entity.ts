import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Counter } from './counter.entity';
import { RefreshToken } from '../../refresh-tokens/refresh-token.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Counter, (counter) => counter.user)
  counters: Counter[];

  @OneToMany(() => RefreshToken, (refreshTokens) => refreshTokens.user, {
    nullable: true,
  })
  refreshTokens: RefreshToken[];
}
