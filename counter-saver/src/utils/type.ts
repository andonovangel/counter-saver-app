import { Counter } from 'src/typeorm/entities/counter.entity';

export type AuthParams = {
  username: string;
  password: string;
};

export type CreateUserParams = {
  username: string;
  password: string;
};

export type UpdateUserParams = {
  username: string;
  password: string;
};

export type GetCountersParams = {
  counters: Counter[];
};

export type GetCounterParams = {
  clicks: number;
};

export type CreateCounterParams = {
  clicks: number;
};
