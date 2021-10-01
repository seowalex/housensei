import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const config = {
  port: Number(process.env.PORT) || 5000,
  env: process.env.ENV ?? 'development',
  dbPort: Number(process.env.DB_PORT) || 5432,
  host: process.env.DB_HOST ?? 'localhost',
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'postgres',
  dbName: process.env.DB_NAME ?? 'housing-sensei',
};

export default config;
