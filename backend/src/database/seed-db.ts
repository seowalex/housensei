import seedBTOs from './seed-bto';
import dbConnection from './connection';

async function seedDB() {
  await dbConnection;

  seedBTOs();

  // TODO seed resale

  // eslint-disable-next-line no-console
  console.info('Seeded database');
}

seedDB();
