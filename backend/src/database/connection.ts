import { createConnection, ConnectionOptions } from 'typeorm';
import config from '../config/index';

export const developmentConnectionOpts: ConnectionOptions = {
  type: 'postgres',
  host: config.host,
  port: config.dbPort,
  username: config.user,
  password: config.password,
  database: config.dbName,
  entities: [`src/models/*.ts`],
  synchronize: true,
};

export const productionConnectionOpts: ConnectionOptions = {
  type: 'postgres',
  url: config.dbUrl,
  entities: [`dist/models/*.js`],
  synchronize: true,
  ssl: true,
  extra: {
    ssl: {
      // https://devcenter.heroku.com/articles/heroku-postgresql
      rejectUnauthorized: false,
    },
  },
};

const connectionOpts =
  config.env === 'development'
    ? developmentConnectionOpts
    : productionConnectionOpts;

export default createConnection(connectionOpts);
