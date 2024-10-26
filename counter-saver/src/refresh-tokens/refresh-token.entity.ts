import { Column, Entity , JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../typeorm/entities/user.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @OneToOne(() => User, (user) => user.refreshToken)
  @JoinColumn()
  user: User;
}
