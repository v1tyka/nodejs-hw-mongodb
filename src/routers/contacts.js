import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import {
  allContactsController,
  contactByIdController,
  createContactController,
  deleContactController,
  upsertContactController,
} from '../controllers/contacts.js';
import { schemaCreate, schemaUpdate } from '../validation/contacts.js';
import { upload } from '../middlewares/multer.js';
const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(allContactsController));
contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactByIdController)
);
contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(schemaCreate),
  ctrlWrapper(createContactController)
);
contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleContactController)
);
contactsRouter.patch(
  '/:contactId',
  upload.single('photo'),
  isValidId,
  validateBody(schemaUpdate),
  ctrlWrapper(upsertContactController)
);
export default contactsRouter;
