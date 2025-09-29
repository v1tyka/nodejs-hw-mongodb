import { Router } from 'express';
import {
  fetchAllContacts,
  fetchContactById,
  createContact,
  patchContact,
  removeContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/', ctrlWrapper(fetchAllContacts));
router.get('/:contactId', ctrlWrapper(fetchContactById));
router.post('/', ctrlWrapper(createContact));
router.patch('/:contactId', ctrlWrapper(patchContact));
router.delete('/:contactId', ctrlWrapper(removeContact)); // ✅ DELETE route

export default router;
