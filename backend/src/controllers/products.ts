import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import { BadRequestError, ConflictError } from '../errors';

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find({});
    res.status(200).send({
      items: products,
      total: products.length,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, image, category, description, price } = req.body;
    const product = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });
    return res.status(201).send(product);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError('Ошибка валидации данных при создании товара')
      );
    }

    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким названием уже существует'));
    }

    return next(error);
  }
};
