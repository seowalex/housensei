import { getRepository, SelectQueryBuilder } from 'typeorm';
import hdbLease from '../utils/constants';
import Resale from '../models/resale';
import { FlatType, Town } from '../utils/model';

export type QueryResaleByTown = {
  years?: number[];
  town?: Town;
  flatTypes?: FlatType[] | FlatType;
  minStorey?: number;
  maxStorey?: number;
  minFloorArea?: number;
  maxFloorArea?: number;
  minLeasePeriod?: number;
  maxLeasePeriod?: number;
};

export type QueryResaleByIsland = {
  years?: number[];
  flatTypes?: FlatType[] | FlatType;
  minStorey?: number;
  maxStorey?: number;
  minFloorArea?: number;
  maxFloorArea?: number;
  minLeasePeriod?: number;
  maxLeasePeriod?: number;
};

const addWhereClauses = (
  queries: QueryResaleByTown | QueryResaleByIsland,
  queryBuilder: SelectQueryBuilder<Resale>
) => {
  if (queries.years) {
    queryBuilder.where(
      'date_part(\'year\', "transactionDate") IN (:...years)',
      {
        years: queries.years instanceof Array ? queries.years : [queries.years],
      }
    );
  }

  if (queries.flatTypes) {
    queryBuilder.andWhere('resale.flatType IN (:...flatTypes)', {
      flatTypes:
        queries.flatTypes instanceof Array
          ? queries.flatTypes
          : [queries.flatTypes],
    });
  }

  // as long as there is an overlap in stories
  if (queries.minStorey) {
    queryBuilder.andWhere('resale.maxStorey >= :minStorey', {
      minStorey: queries.minStorey,
    });
  }

  if (queries.maxStorey) {
    queryBuilder.andWhere('resale.minStorey <= :maxStorey', {
      maxStorey: queries.maxStorey,
    });
  }

  if (queries.minFloorArea) {
    queryBuilder.andWhere('resale.floorArea >= :minFloorArea', {
      minFloorArea: queries.minFloorArea,
    });
  }

  if (queries.maxFloorArea) {
    queryBuilder.andWhere('resale.floorArea <= :maxFloorArea', {
      maxFloorArea: queries.maxFloorArea,
    });
  }

  if (queries.minLeasePeriod) {
    const currentDate = new Date();
    const targetLeaseCommence = new Date(
      currentDate.getFullYear() - hdbLease + Number(queries.minLeasePeriod),
      currentDate.getMonth()
    );

    queryBuilder.andWhere('resale.leaseCommenceYear >= :minDate', {
      minDate: targetLeaseCommence,
    });
  }

  if (queries.maxLeasePeriod) {
    const currentDate = new Date();
    const targetLeaseCommence = new Date(
      currentDate.getFullYear() - hdbLease + Number(queries.maxLeasePeriod),
      currentDate.getMonth()
    );

    queryBuilder.andWhere('resale.leaseCommenceYear <= :maxDate', {
      maxDate: targetLeaseCommence,
    });
  }
};

const getResalesByIsland = async (
  queries: QueryResaleByIsland
): Promise<Array<{ town: Town; resalePrice: number }>> => {
  const queryBuilder = getRepository(Resale)
    .createQueryBuilder('resale')
    .select('resale.town', 'town')
    .addSelect('CAST(AVG(resale.resalePrice) AS int)', 'resalePrice');

  addWhereClauses(queries, queryBuilder);

  queryBuilder.groupBy('town');

  return queryBuilder.getRawMany();
};

const getResalesByTown = async (
  queries: QueryResaleByTown
): Promise<
  Array<{
    address: string;
    resalePrice: number;
    coordinates: [number, number];
    details: Array<{
      flatType: FlatType;
      resalePrice: number;
      transactionMonth: number;
    }>;
  }>
> => {
  const queryBuilder = getRepository(Resale)
    .createQueryBuilder('resale')
    .select('MAX(resale.coordinates)', 'coordinates')
    .addSelect(
      "json_agg(json_build_object('flatType', resale.flatType, 'resalePrice', resale.resalePrice, 'transactionMonth', date_part('month', resale.transactionDate)))",
      'transactions'
    )
    .addSelect("CONCAT(resale.block, ' ', resale.streetName)", 'address')
    .addSelect('CAST(AVG(resale.resalePrice) AS int)', 'resalePrice')
    .where('coordinates IS NOT NULL');

  addWhereClauses(queries, queryBuilder);

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
