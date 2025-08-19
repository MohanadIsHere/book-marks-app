import dotenv from 'dotenv';

dotenv.config({
  path: './.env',
});

export const { PORT, DATABASE_URL, JWT_SECRET } = process.env;
