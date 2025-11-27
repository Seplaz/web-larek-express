import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';
import { UnauthorizedError } from '../errors';

interface ITokenPayload {
  _id: string;
}

interface IUser {
  email: string;
  name: string;
}

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ _id: userId }, authConfig.jwt.accessSecret, {
    expiresIn: authConfig.jwt.accessExpiry,
  });

  const refreshToken = jwt.sign({ _id: userId }, authConfig.jwt.refreshSecret, {
    expiresIn: authConfig.jwt.refreshExpiry,
  });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string): ITokenPayload => {
  try {
    return jwt.verify(token, authConfig.jwt.refreshSecret) as ITokenPayload;
  } catch {
    throw new UnauthorizedError('Токен просрочен или невалиден');
  }
};

export const formatUserResponse = (user: IUser) => ({
  email: user.email,
  name: user.name,
});
