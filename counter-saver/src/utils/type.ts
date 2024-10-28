export type SignupParams = CreateUserParams;

export type LoginParams = {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  accessToken: string;
  refreshToken: string;
};

export type ValidateUserParams = {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RefreshTokenParams = {
  accessToken: string;
  refreshToken: string;
};

export type CreateUserParams = {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GetCounterParams = {
  clicks: number;
};

export type CreateCounterParams = {
  clicks: number;
};
