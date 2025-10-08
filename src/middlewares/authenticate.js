import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization header missing or invalid');
    }

    const accessToken = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(accessToken, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid access token');
    }

    const session = await Session.findOne({ accessToken });
    if (!session) {
      throw createHttpError(401, 'Session not found or invalid');
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    req.session = session;

    next();
  } catch (error) {
    next(error);
  }
};
