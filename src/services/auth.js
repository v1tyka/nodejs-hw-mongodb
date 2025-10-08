import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 min
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

export const registerUserService = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  const userObject = newUser.toObject();
  delete userObject.password;
  return userObject;
};

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Invalid email or password');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw createHttpError(401, 'Invalid email or password');

  await Session.deleteMany({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: '30d',
  });

  const now = new Date();
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now.getTime() + ACCESS_TOKEN_EXPIRY),
    refreshTokenValidUntil: new Date(now.getTime() + REFRESH_TOKEN_EXPIRY),
  });

  return { accessToken, refreshToken };
};

export const refreshSessionService = async (oldRefreshToken) => {
  if (!oldRefreshToken) throw createHttpError(401, 'No refresh token provided');

  const oldSession = await Session.findOne({ refreshToken: oldRefreshToken });
  if (!oldSession) throw createHttpError(401, 'Invalid refresh token');

  await Session.deleteOne({ _id: oldSession._id });

  const decoded = jwt.verify(oldRefreshToken, JWT_SECRET);
  const userId = decoded.userId;

  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '30d',
  });

  const now = new Date();
  await Session.create({
    userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(now.getTime() + ACCESS_TOKEN_EXPIRY),
    refreshTokenValidUntil: new Date(now.getTime() + REFRESH_TOKEN_EXPIRY),
  });

  return { accessToken, refreshToken: newRefreshToken };
};

export const logoutUserService = async (token) => {
  if (!token) throw createHttpError(401, 'No token provided');

  const deleted = await Session.findOneAndDelete({
    $or: [{ accessToken: token }, { refreshToken: token }],
  });

  if (!deleted) throw createHttpError(404, 'Session not found');
};
