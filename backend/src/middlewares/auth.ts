import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';
import { UnauthorizedError } from '../errors';

export interface ITokenPayload {
  _id: string;
}

const auth = (req: Request, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(
      token,
      authConfig.jwt.accessSecret
    ) as ITokenPayload;
    req.user = payload;
    return next();
  } catch {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
};

export default auth;
