import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import authConfig from '../config/auth';
import { UnauthorizedError, ConflictError, NotFoundError } from '../errors';
import {
  generateTokens,
  verifyRefreshToken,
  formatUserResponse,
} from '../utils/authHelpers';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      tokens: [],
    });

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    await User.findByIdAndUpdate(user._id, {
      $push: { tokens: { token: refreshToken } },
    });

    res.cookie(authConfig.cookie.name, refreshToken, authConfig.cookie.options);

    return res.status(201).send({
      success: true,
      user: formatUserResponse(user),
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    await User.findByIdAndUpdate(user._id, {
      $push: { tokens: { token: refreshToken } },
    });

    res.cookie(authConfig.cookie.name, refreshToken, authConfig.cookie.options);

    return res.status(200).send({
      success: true,
      user: formatUserResponse(user),
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken: oldRefreshToken } = req.cookies;

    if (!oldRefreshToken) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const payload = verifyRefreshToken(oldRefreshToken);

    const user = await User.findOne({
      _id: payload._id,
      'tokens.token': oldRefreshToken,
    });

    if (!user) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    await User.findByIdAndUpdate(user._id, [
      {
        $set: {
          tokens: {
            $filter: {
              input: '$tokens',
              cond: { $ne: ['$$this.token', oldRefreshToken] },
            },
          },
        },
      },
      {
        $set: {
          tokens: { $concatArrays: ['$tokens', [{ token: refreshToken }]] },
        },
      },
    ]);

    res.cookie(authConfig.cookie.name, refreshToken, authConfig.cookie.options);

    return res.status(200).send({
      success: true,
      user: formatUserResponse(user),
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const payload = verifyRefreshToken(refreshToken);

    const user = await User.findById(payload._id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    await User.findByIdAndUpdate(payload._id, {
      $pull: { tokens: { token: refreshToken } },
    });

    res.clearCookie(authConfig.cookie.name, {
      ...authConfig.cookie.options,
      maxAge: 0,
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    return res.status(200).send({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error) {
    return next(error);
  }
};
