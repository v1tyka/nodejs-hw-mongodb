import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  logOutController,
  refreshUserSessionController,
} from '../controllers/auth.js';
const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerUserController)
);
authRouter.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginUserController)
);
authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));
authRouter.post('/logout', ctrlWrapper(logOutController));

export default authRouter;
