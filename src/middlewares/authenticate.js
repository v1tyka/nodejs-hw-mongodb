import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization') || '';
    const [type, token] = authHeader.split(' ');

    if (!token || type !== 'Bearer') {
      throw createHttpError(401, 'Not authorized');
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid access token');
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    // додаємо user в req
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
