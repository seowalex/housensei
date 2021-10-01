import { dropDatabase } from 'pg-god';
import config from '../config/index';

const defaultDbCred = {
  user: config.user,
  database: 'postgres',
  password: config.password,
  port: config.dbPort,
  host: config.host,
};

async function dropDB() {
  await dropDatabase({ databaseName: config.dbName }, defaultDbCred);
  // eslint-disable-next-line no-console
  console.info('Dropped database');
}

dropDB();
