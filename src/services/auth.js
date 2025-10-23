import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import {
  FIFTEEN_MINUTES,
  SMTP,
  TEMPLATES_DIR,
  THIRTY_DAYS,
} from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import { sendEmail } from '../utils/sendEmail.js';
import {
  validateCode,
  getFullNameFromGoogleTokenPayload,
} from '../utils/googleOAuth2.js';
export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });

  if (user) {
    throw new createHttpError(409, 'Email in use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UserCollection.create({
    email: payload.email,
    name: payload.name,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });

  if (!user) {
    throw new createHttpError(409, 'Email not found');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw new createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionCollection.create({
    userId: user._id,
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

function createSession() {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
}

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken: refreshToken,
  });

  if (!session) {
    throw new createHttpError(409, 'Session not found');
  }

  const isExpired = new Date() > session.refreshTokenValidUntil;

  if (isExpired) {
    throw new createHttpError(401, 'Refresh token is expired');
  }

  const newSession = createSession();

  await SessionCollection.deleteOne({
    _id: sessionId,
    refreshToken: refreshToken,
  });

  return await SessionCollection.create({
    userId: session.userId,
    accessToken: newSession.accessToken,
    refreshToken: newSession.refreshToken,
    accessTokenValidUntil: newSession.accessTokenValidUntil,
    refreshTokenValidUntil: newSession.refreshTokenValidUntil,
  });
};

export const logOut = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    }
  );

  const resetPasswordTemplatePath = path.join(TEMPLATES_DIR, 'template.html');

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    if (error.status === 500) {
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.'
      );
    }
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) {
      createHttpError(401, error.message);
      throw error;
    }
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isExpired = new Date() > payload.token;

  if (isExpired) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.findByIdAndUpdate(
    { _id: user._id },
    { password: encryptedPassword }
  );

  await SessionCollection.deleteOne({ userId: user._id });
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) {
    throw createHttpError(401);
  }

  let user = await UserCollection.findOne({ email: payload.email });

  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UserCollection.create({
      email: payload.email,
      password: password,
      name: getFullNameFromGoogleTokenPayload(payload),
    });
  }

  const newSession = createSession();

  await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};
