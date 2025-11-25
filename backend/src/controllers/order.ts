import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import { BadRequestError } from '../errors';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { total, items } = req.body;
    const uniqueItems = [...new Set(items)];
    const products = await Product.find({ _id: { $in: uniqueItems } });

    if (products.length !== uniqueItems.length) {
      throw new BadRequestError('Некоторые товары не найдены в базе данных');
    }

    const nullPriceProduct = products.find((p) => p.price === null);
    if (nullPriceProduct) {
      throw new BadRequestError(
        `Товар "${nullPriceProduct.title}" не продается`
      );
    }

    const calculatedTotal = items.reduce((acc: number, itemId: string) => {
      const product = products.find((p) => p._id.toString() === itemId);
      return acc + (product?.price || 0);
    }, 0);

    if (total !== calculatedTotal) {
      throw new BadRequestError(
        `Неверная сумма заказа. Ожидалось: ${calculatedTotal}`
      );
    }

    return res.status(201).send({
      id: faker.string.uuid(),
      total: calculatedTotal,
    });
  } catch (error) {
    return next(error);
  }
};

export default createOrder;
