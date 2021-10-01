import { createDatabase } from 'pg-god';
import config from '../config/index';

const defaultDbCred = {
  user: config.user,
  database: 'postgres',
  password: config.password,
  port: config.dbPort,
  host: config.host,
};

async function createDB() {
  await createDatabase(
    { databaseName: config.dbName, errorIfExist: true },
    defaultDbCred
  );
  // eslint-disable-next-line no-console
  console.info('Created database');
}

createDB();
