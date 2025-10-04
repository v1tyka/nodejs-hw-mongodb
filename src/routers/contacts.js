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

const router = Router();

// --- GET all contacts (with pagination) ---
router.get('/', ctrlWrapper(fetchAllContacts));

// --- GET contact by ID ---
router.get('/:contactId', isValidId, ctrlWrapper(fetchContactById));

// --- POST create a new contact ---
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContact));

// --- PATCH update a contact ---
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContact)
);

// --- DELETE remove a contact ---
router.delete('/:contactId', isValidId, ctrlWrapper(removeContact));

export default router;
