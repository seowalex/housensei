import {
  createQueryBuilder,
  FindConditions,
  getRepository,
  Raw,
} from 'typeorm';
import Resale from '../models/resale';
import { Town } from '../utils/model';

export type QueryResaleByTown = {
  years: number[];
  town: Town;
};

export type QueryResaleByIsland = {
  years: number[];
};

const getResalesByIsland = async (
  queries: QueryResaleByIsland
): Promise<Array<{ town: Town; resalePrice: number }>> => {
  const hii = 'rqwrw';
  return (
    getRepository(Resale)
      .createQueryBuilder('resale')
      // .select(['resale.town'])
      .select('resale.town', 'town')
      // .select('resale.id', 'resale.id')
      // .addSelect('resale.transactionDate', 'transaction_date')
      // .addSelect('resale.town', 'town')
      .addSelect('AVG(resale.resalePrice)', 'resalePrice')
      .where('date_part(\'year\', "transactionDate") IN (:...years)', {
        years: queries.years,
      })
      .groupBy('town')
      .getRawMany()
    // .getMany()
  );

  // .map((value: Array<Resale>, key: Town) => ({
  //   town: key,
  //   resalePrice: _.meanBy(value, (resale) => resale.resalePrice),
  // }));
};

// { address: string; resalePrice: number }
const getResalesByTown = async (
  queries: QueryResaleByTown
): Promise<Array<{ town: Town; resalePrice: number }>> => {
  const hii = 'rqwrw';
  console.log(hii);
  console.log(queries);
  return getRepository(Resale)
    .createQueryBuilder('resale')
    .select("CONCAT (resale.block, ' ', resale.streetName)", 'address')
    .addSelect('AVG(resale.resalePrice)', 'resalePrice')
    .where('date_part(\'year\', "transactionDate") IN (:...years)', {
      years: queries.years,
    })
    .andWhere({ town: queries.town })
    .groupBy('address')
    .getRawMany();
  // .getRawMany()
};

const getResales = async (
  queries: QueryResaleByTown
): Promise<Array<Resale>> => {
  const conditions: FindConditions<Resale> = {};
  if (queries.years) {
    // check that each ResaleFlat's transactionDate's year is one of years specified
    const years =
      typeof queries.years === 'string' || typeof queries.years === 'number'
        ? [Number(queries.years)]
        : queries.years.map((year) => Number(year));

    conditions.transactionDate = Raw(
      (transactionDate) =>
        `date_part('year', ${transactionDate}) IN (:...years)`,
      {
        years,
      }
    );
  }

  if (queries.town) {
    conditions.town = queries.town;
  }

  return getRepository(Resale).find({
    where: conditions,
    cache: true,
  });
};

export default {
  getResalesByIsland,
  getResalesByTown,
  getResales,
};
