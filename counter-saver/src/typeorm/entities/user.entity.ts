import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Counter } from './counter.entity';
import { RefreshToken } from '../../refresh-tokens/refresh-token.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, {
    nullable: true,
    cascade: true,
  })
  refreshToken: RefreshToken;
}
