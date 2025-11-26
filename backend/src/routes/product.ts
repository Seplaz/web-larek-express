import { Router } from 'express';
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/products';
import {
  validateProductBody,
  validateProductUpdateBody,
  validateObjId,
} from '../middlewares/validation';
import auth from '../middlewares/auth';

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.get('/:productId', validateObjId, getProductById);

productRouter.post('/', auth, validateProductBody, createProduct);
productRouter.patch('/:productId', auth, validateObjId, validateProductUpdateBody, updateProduct);
productRouter.delete('/:productId', auth, validateObjId, deleteProduct);

export default productRouter;
