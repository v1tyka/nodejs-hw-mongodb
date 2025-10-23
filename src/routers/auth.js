import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  loginWithGoogleOAuthSchema,
} from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  logOutController,
  refreshUserSessionController,
  requestResetEmailController,
  resetPasswordController,
  generateAuthUrlController,
  loginOrSignupWithGoogleController,
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
authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController)
);
authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController)
);
authRouter.get('/get-oauth-url', ctrlWrapper(generateAuthUrlController));
authRouter.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginOrSignupWithGoogleController)
);
export default authRouter;
