import {
  registerUser,
  loginUser,
  refreshUserSession,
  logOut,
} from '../services/auth.js';
import { THIRTY_DAYS } from '../constants/index.js';

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
