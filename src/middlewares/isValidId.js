import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

function isValidId(req, res, next) {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    throw new createHttpError(400, 'Id is not valid');
  }

  next();
}

export default isValidId;
