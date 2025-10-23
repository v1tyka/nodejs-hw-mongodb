import { getEnvVar } from './getEnvVar.js';
import path from 'node:path';

import { readFile } from 'fs/promises';
import { OAuth2Client } from 'google-auth-library';
import createHttpError from 'http-errors';

const PATH_JSON = path.join(process.cwd(), 'contactsOauthJson.json');

const oauthConfig = JSON.parse(await readFile(PATH_JSON));

const googleOAuthClient = new OAuth2Client({
  client_id: getEnvVar('CLIENT_ID'),
  client_secret: getEnvVar('CLIENT_SECRET'),
  redirect_uris: oauthConfig.web.redirect_uris[0],
});

export const generateAuthUrl = () => {
  return googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
};

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) {
    throw createHttpError(401, 'Unauthorized');
  }

  const ticket = googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullname = 'Guest';

  if (payload.given_name && payload.family_name) {
    fullname = `${payload.given_name}_${payload.family_name}`;
  } else if (payload.given_name) {
    fullname = payload.given_name;
  }
  return fullname;
};
