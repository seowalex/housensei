import { getRepository } from 'typeorm';
import Resale from '../models/resale';
import { Town } from '../utils/model';

export type QueryResaleByTown = {
  years?: number[];
  town?: Town;
};

export type QueryResaleByIsland = {
  years?: number[];
};

const getResalesByIsland = async (
  queries: QueryResaleByIsland
): Promise<Array<{ town: Town; resalePrice: number }>> => {
  const queryBuilder = getRepository(Resale)
    .createQueryBuilder('resale')
    .select('resale.town', 'town')
    .addSelect('CAST(AVG(resale.resalePrice) AS int)', 'resalePrice');

  if (queries.years) {
    queryBuilder.where(
      'date_part(\'year\', "transactionDate") IN (:...years)',
      {
        years: queries.years,
      }
    );
  }
  queryBuilder.groupBy('town');

  return queryBuilder.getRawMany();
};

const getResalesByTown = async (
  queries: QueryResaleByTown
): Promise<Array<{ address: string; resalePrice: number }>> => {
  const queryBuilder = getRepository(Resale)
    .createQueryBuilder('resale')
    .select("CONCAT (resale.block, ' ', resale.streetName)", 'address')
    .addSelect('CAST(AVG(resale.resalePrice) AS int)', 'resalePrice');

  if (queries.years) {
    queryBuilder.where(
      'date_part(\'year\', "transactionDate") IN (:...years)',
      {
        years: queries.years,
      }
    );
  }

  if (queries.town) {
    queryBuilder.andWhere({ town: queries.town });
  }

  queryBuilder.groupBy('address');

  return queryBuilder.getRawMany();
};

export default {
  getResalesByIsland,
  getResalesByTown,
};
