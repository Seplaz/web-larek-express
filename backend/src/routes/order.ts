import { Router } from 'express';
import createOrder from '../controllers/order';
import { validateProductBody } from '../middlewares/validation';

const orderRouter = Router();

orderRouter.post('/', validateProductBody, createOrder);

export default orderRouter;
