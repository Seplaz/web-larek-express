import { CookieOptions } from 'express';
import ms, { StringValue } from 'ms';

const accessExpiry = (process.env.AUTH_ACCESS_TOKEN_EXPIRY || '1m') as StringValue;
const refreshExpiry = (process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d') as StringValue;

const authConfig = {
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
    accessExpiry,
    refreshExpiry,
  },
  cookie: {
    name: 'refreshToken',
    options: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms(refreshExpiry),
      path: '/',
    } as CookieOptions,
  },
};

export default authConfig;
