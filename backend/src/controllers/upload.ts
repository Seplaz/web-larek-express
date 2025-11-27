import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors';

const TEMP_PATH = process.env.UPLOAD_PATH_TEMP || 'temp';

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new BadRequestError('Файл не был загружен');
    }

    const { filename, originalname } = req.file;

    return res.status(200).send({
      fileName: `/${TEMP_PATH}/${filename}`,
      originalName: originalname,
    });
  } catch (error) {
    return next(error);
  }
};

export default uploadFile;
