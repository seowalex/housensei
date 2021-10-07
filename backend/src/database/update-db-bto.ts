import seedBTOs from './seed-bto';
import dbConnection from './connection';

async function updateBTO() {
  await dbConnection;

  await seedBTOs();
}

updateBTO();
