import { FindConditions, getRepository, Raw } from 'typeorm';
import ResaleFlat from '../models/resale';
import { Town } from '../utils/model';

export type QueryResale = {
  years?: number[] | number;
  town?: Town;
};

const getResales = async (queries: QueryResale): Promise<Array<ResaleFlat>> => {
  const conditions: FindConditions<ResaleFlat> = {};
  if (queries.years) {
    // check that each ResaleFlat's transactionDate's year is one of years specified
    const years =
      typeof queries.years === 'string' || typeof queries.years === 'number'
        ? [Number(queries.years)]
        : queries.years.map((year) => Number(year));
    // `EXTRACT(YEAR FROM TIMESTAMP ${transactionDate}) IN (:...years)`,
    // `${transactionDate}::DATE IN (:...years)`,

    conditions.transactionDate = Raw(
      (transactionDate) =>
        `date_part('year', ${transactionDate}) IN (:...years)`,
      {
        years,
      }
    );
  }

  if (queries.town) {
    conditions.location = queries.town;
  }

  return getRepository(ResaleFlat).find({
    where: conditions,
    cache: true,
  });
};

export default {
  getResales,
};
