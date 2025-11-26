import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import path from 'path';
import fs from 'fs';
import Product from '../models/product';
import { BadRequestError, ConflictError, NotFoundError } from '../errors';

const IMAGES_PATH = process.env.UPLOAD_PATH || 'images';
const TEMP_PATH = process.env.UPLOAD_PATH_TEMP || 'temp';

const moveFileToImages = async (tempFileName: string): Promise<string> => {
  const filename = path.basename(tempFileName);
  const sourcePath = path.join(__dirname, '../public', TEMP_PATH, filename);
  const destPath = path.join(__dirname, '../public', IMAGES_PATH, filename);

  try {
    await fs.promises.copyFile(sourcePath, destPath);
    await fs.promises.unlink(sourcePath);
    return `/${IMAGES_PATH}/${filename}`;
  } catch (error) {
    throw new BadRequestError('Ошибка при сохранении изображения');
  }
};

const deleteOldImage = async (fileName: string): Promise<void> => {
  const filename = path.basename(fileName);
  const filePath = path.join(__dirname, '../public', IMAGES_PATH, filename);

  try {
    await fs.promises.unlink(filePath);
  } catch {
    console.log('Файл не существует');
  }
};

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find({});
    return res.status(200).send({
      items: products,
      total: products.length,
    });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, image, category, description, price } = req.body;

    const newFileName = await moveFileToImages(image.fileName);

    const product = await Product.create({
      title,
      image: {
        fileName: newFileName,
        originalName: image.originalName,
      },
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

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError('Товар не найден');
    }

    return res.status(200).send(product);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Некорректный ID товара'));
    }
    return next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { title, image, category, description, price } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError('Товар не найден');
    }

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;

    if (image && image.fileName) {
      await deleteOldImage(product.image.fileName);
      const newFileName = await moveFileToImages(image.fileName);
      updateData.image = {
        fileName: newFileName,
        originalName: image.originalName,
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).send(updatedProduct);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError('Ошибка валидации данных при обновлении товара')
      );
    }

    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким названием уже существует'));
    }

    return next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw new NotFoundError('Товар не найден');
    }

    return res.status(200).send(product);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Некорректный ID товара'));
    }
    return next(error);
  }
};
