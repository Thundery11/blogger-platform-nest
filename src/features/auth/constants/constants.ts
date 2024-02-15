export const jwtConstants = {
  JWT_SECRET: process.env.JWT_SECRET || '123',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_SECRET || '234',
};
export const basicConstants = {
  userName: process.env.SA_LOGIN || 'admin',
  password: process.env.SA_PASSWORD || 'qwerty',
};
