import createHttpError from 'http-errors';
import {
  createUserService,
  loginUserService,
  refreshSessionService,
  logoutUserService,
} from '../services/auth.js';

export const registerUser = async (req, res, next) => {
  try {
    const newUser = await createUserService(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await loginUserService(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw createHttpError(401, 'No refresh token provided');

    const { accessToken, refreshToken: newRefreshToken } =
      await refreshSessionService(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw createHttpError(401, 'No refresh token provided');

    await logoutUserService(refreshToken);

    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
