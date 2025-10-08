import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from './models/user.js';
import { Session } from './models/session.js';

const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 хв
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000; // 30 днів

export const createUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const plainUser = user.toObject ? user.toObject() : user;
  delete plainUser.password;
  return plainUser;
};

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Invalid email or password');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw createHttpError(401, 'Invalid email or password');

  // ✅ Видаляємо стару сесію
  await Session.deleteOne({ userId: user._id });

  // ✅ Генеруємо токени
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const now = new Date();

  // ✅ Створюємо нову сесію
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now.getTime() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(now.getTime() + REFRESH_TOKEN_LIFETIME),
  });

  return { accessToken, refreshToken };
};
