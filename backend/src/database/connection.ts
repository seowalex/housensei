import { createConnection, ConnectionOptions } from 'typeorm';
import config from '../config/index';

export const connectionOpts: ConnectionOptions = {
  type: 'postgres',
  host: config.host,
  port: config.dbPort,
  username: config.user,
  password: config.password,
  database: config.dbName,
  entities: [`src/models/*.ts`],
  synchronize: true,
};

export default createConnection(connectionOpts);
