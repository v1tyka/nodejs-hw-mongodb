import { Router } from 'express';
import {
  fetchAllContacts,
  fetchContactById,
  createContact,
  patchContact,
  removeContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contactSchemas.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(fetchAllContacts));

router.get('/:contactId', isValidId, ctrlWrapper(fetchContactById));

router.post('/', validateBody(createContactSchema), ctrlWrapper(createContact));

router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContact)
);

router.delete('/:contactId', isValidId, ctrlWrapper(removeContact));

export default router;
