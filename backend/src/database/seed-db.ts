import seedBTOs from './seed-bto';
import seedResale from './seed-resale';
import dbConnection from './connection';

async function seedDB() {
  await dbConnection;

  await seedBTOs();

  await seedResale();

  // eslint-disable-next-line no-console
  console.info('Seeded database');
}

seedDB();
