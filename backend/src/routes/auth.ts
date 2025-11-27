import { Router } from 'express';
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
} from '../controllers/auth';
import {
  validateRegisterBody,
  validateLoginBody,
} from '../middlewares/validation';
import auth from '../middlewares/auth';

const authRouter = Router();

authRouter.post('/register', validateRegisterBody, register);
authRouter.post('/login', validateLoginBody, login);
authRouter.get('/token', refreshAccessToken);
authRouter.get('/logout', logout);
authRouter.get('/user', auth, getCurrentUser);

export default authRouter;
