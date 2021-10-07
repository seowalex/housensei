import { getRepository } from 'typeorm';
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
): Promise<Array<{ town: Town; resalePrice: number }>> =>
  getRepository(Resale)
    .createQueryBuilder('resale')
    .select('resale.town', 'town')
    .addSelect('CAST(AVG(resale.resalePrice) AS int)', 'resalePrice')
    .where('date_part(\'year\', "transactionDate") IN (:...years)', {
      years: queries.years,
    })
    .groupBy('town')
    .getRawMany();

const getResalesByTown = async (
  queries: QueryResaleByTown
): Promise<Array<{ address: string; resalePrice: number }>> =>
  getRepository(Resale)
    .createQueryBuilder('resale')
    .select("CONCAT (resale.block, ' ', resale.streetName)", 'address')
    .addSelect('CAST(AVG(resale.resalePrice) AS int)', 'resalePrice')
    .where('date_part(\'year\', "transactionDate") IN (:...years)', {
      years: queries.years,
    })
    .andWhere({ town: queries.town })
    .groupBy('address')
    .getRawMany();

export default {
  getResalesByIsland,
  getResalesByTown,
};
