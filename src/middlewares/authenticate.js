import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const header = req.get('Authorization');

  if (!header) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const bearer = header.split(' ')[0];
  const token = header.split(' ')[1];

  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await SessionCollection.findOne({
    accessToken: token,
  });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isExpired = new Date() > session.accessTokenValidUntil;

  if (isExpired) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await UserCollection.findOne(session.userId);

  if (!user) {
    next(createHttpError(401));
    return;
  }

  req.user = user;

  next();
};
