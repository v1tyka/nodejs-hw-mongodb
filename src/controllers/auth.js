import {
  registerUser,
  loginUser,
  refreshUserSession,
  logOut,
  requestResetToken,
  resetPassword,
  loginOrSignupWithGoogle,
} from '../services/auth.js';
import { THIRTY_DAYS } from '../constants/index.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';

export async function registerUserController(req, res) {
  const contact = await registerUser(req.body);

  res.json({
    status: 201,
    message: 'Successfully registered a user!',
    data: contact,
  });
}

export async function loginUserController(req, res) {
  const session = await loginUser(req.body);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.json({
    status: 201,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

function setupSession(res, session) {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
}

export async function refreshUserSessionController(req, res) {
  const session = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logOutController(req, res) {
  if (req.cookies.sessionId) {
    await logOut(req.cookies.sessionId);
  }

  res.status(204).send();
}

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

export const generateAuthUrlController = (req, res) => {
  const url = generateAuthUrl();

  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url: url,
    },
  });
};

export const loginOrSignupWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
