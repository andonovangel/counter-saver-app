import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Counter } from './typeorm/entities/counter.entity';
import { CountersModule } from './counters/counters.module';
import { RefreshToken } from './refresh-tokens/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '2001Angel!',
      database: 'counter_saver_db',
      entities: [User, Counter, RefreshToken],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    CountersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
