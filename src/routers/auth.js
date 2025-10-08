import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from '../controllers/auth.js';
import { validateBody } from '../utils/validateBody.js';
import { registerSchema, loginSchema } from '../validation/authSchemas.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerUser)
);
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginUser));
router.post('/refresh', ctrlWrapper(refreshSession));
router.post('/logout', ctrlWrapper(logoutUser)); // ✅ new logout route

export default router;
