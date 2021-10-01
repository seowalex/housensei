import dbConnection from './connection';

async function seedDB() {
  await dbConnection;

  // TODO seed database

  // eslint-disable-next-line no-console
  console.info('Seeded database');
}

seedDB();
