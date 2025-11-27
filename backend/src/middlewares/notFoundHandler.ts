import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors';

const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
};

export default notFoundHandler;
