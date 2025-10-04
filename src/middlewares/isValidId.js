import mongoose from 'mongoose';
import createError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    return next(createError(400, 'Invalid contact ID'));
  }

  next();
};
