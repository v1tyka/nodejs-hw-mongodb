import path from 'node:path';
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
export const TEMP_ULOAD_DIR = path.join(process.cwd(), 'temp');
export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_USER: 'SMTP_USER',
  SMTP_FROM: 'SMTP_FROM',
};

export const CLOUDINARY = {
  API_SECRET: 'API_SECRET',
  API_KEY: 'API_KEY',
  CLOUD_NAME: 'CLOUD_NAME',
};

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
