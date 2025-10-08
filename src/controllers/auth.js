import createError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { logoutUserService } from '../services/auth.js';

const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000; // 30 days

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw createError(401, 'Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw createError(401, 'Invalid email or password');

    await Session.deleteMany({ userId: user._id });

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );

    const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_LIFETIME);
    const refreshTokenValidUntil = new Date(
      Date.now() + REFRESH_TOKEN_LIFETIME
    );

    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true for HTTPS
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_LIFETIME,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw createError(401, 'No refresh token provided');

    await logoutUserService(refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
