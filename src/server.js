import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 хв
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000; // 30 днів
const JWT_SECRET = process.env.JWT_SECRET;

// --- Створення нового користувача ---
export const createUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const plainUser = user.toObject();
  delete plainUser.password;
  return plainUser;
};

// --- Логін користувача ---
export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Invalid email or password');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw createHttpError(401, 'Invalid email or password');

  // Видаляємо стару сесію
  await Session.deleteOne({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: '30d',
  });

  const now = new Date();

  // Створюємо нову сесію
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now.getTime() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(now.getTime() + REFRESH_TOKEN_LIFETIME),
  });

  return { accessToken, refreshToken };
};

// --- Оновлення сесії (refresh) ---
export const refreshSessionService = async (oldRefreshToken) => {
  if (!oldRefreshToken) throw createHttpError(401, 'No refresh token provided');

  const oldSession = await Session.findOne({ refreshToken: oldRefreshToken });
  if (!oldSession) throw createHttpError(401, 'Invalid refresh token');

  // Видаляємо стару сесію
  await Session.deleteOne({ _id: oldSession._id });

  const decoded = jwt.verify(oldRefreshToken, JWT_SECRET);
  const userId = decoded.userId;

  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });

  const now = new Date();
  await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now.getTime() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(now.getTime() + REFRESH_TOKEN_LIFETIME),
  });

  return { accessToken, refreshToken };
};

// --- Логаут користувача ---
export const logoutUserService = async (refreshToken) => {
  if (!refreshToken) throw createHttpError(401, 'No refresh token provided');
  await Session.deleteOne({ refreshToken });
};
