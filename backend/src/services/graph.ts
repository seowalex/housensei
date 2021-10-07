import {
  Between,
  FindConditions,
  getRepository,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Raw,
} from 'typeorm';
import { QueryResale } from '../utils/resaleRecord';
import Resale from '../models/resale';

const getResales = async (queries: QueryResale): Promise<Resale[]> => {
  const conditions: FindConditions<Resale> = {};
  if (queries.towns) {
    conditions.town =
      queries.towns instanceof Array ? In(queries.towns) : queries.towns;
  }

  if (queries.flatTypes) {
    conditions.flatType =
      queries.flatTypes instanceof Array
        ? In(queries.flatTypes)
        : queries.flatTypes;
  }

  // Return all units where the [minStorey, maxStorey] overlaps with the query [minStorey, maxStorey]
  if (queries.minStorey) {
    conditions.maxStorey = MoreThanOrEqual(queries.minStorey);
  }

  if (queries.maxStorey) {
    conditions.minStorey = LessThanOrEqual(queries.maxStorey);
  }

  if (queries.minFloorArea && queries.maxFloorArea) {
    conditions.floorArea = Between(queries.minFloorArea, queries.maxFloorArea);
  } else if (queries.maxFloorArea) {
    conditions.floorArea = LessThanOrEqual(queries.maxFloorArea);
  } else if (queries.minFloorArea) {
    conditions.floorArea = MoreThanOrEqual(queries.minFloorArea);
  }

  const hdbLease = 99;

  if (queries.minLeasePeriod && queries.maxLeasePeriod) {
    const currentDate = new Date();
    const targetLeaseStart = new Date(
      currentDate.getFullYear() - hdbLease + Number(queries.minLeasePeriod),
      currentDate.getMonth()
    );

    const targetLeaseEnd = new Date(
      currentDate.getFullYear() - hdbLease + Number(queries.maxLeasePeriod),
      currentDate.getMonth()
    );
    conditions.leaseCommenceYear = Raw(
      (leaseStart) => `${leaseStart} >= :minDate AND ${leaseStart} <= :maxDate`,
      { minDate: targetLeaseStart, maxDate: targetLeaseEnd }
    );
  } else if (queries.minLeasePeriod) {
    const currentDate = new Date();
    const targetLeaseCommence = new Date(
      currentDate.getFullYear() - hdbLease + Number(queries.minLeasePeriod),
      currentDate.getMonth()
    )
      .toISOString()
      .split('T')[0];
    conditions.leaseCommenceYear = Raw(
      (leaseStart) => `${leaseStart} >= :minDate`,
      { minDate: targetLeaseCommence }
    );
  } else if (queries.maxLeasePeriod) {
    const currentDate = new Date();
    const targetLeaseCommence = new Date(
      currentDate.getFullYear() - hdbLease + Number(queries.maxLeasePeriod),
      currentDate.getMonth()
    );
    conditions.leaseCommenceYear = Raw(
      (leaseStart) => `${leaseStart} <= :maxDate`,
      { maxDate: targetLeaseCommence }
    );
  }

  if (queries.startYear && queries.endYear) {
    const endYear = (Number(queries.endYear) + 1).toString();
    conditions.transactionDate = Raw(
      (transaction) => `${transaction} >= :start AND ${transaction} < :end`,
      {
        start: new Date(queries.startYear),
        end: new Date(endYear),
      }
    );
  } else if (queries.startYear) {
    conditions.transactionDate = Raw(
      (transaction) => `${transaction} >= :start`,
      { start: new Date(queries.startYear) }
    );
  } else if (queries.endYear) {
    const endYear = (Number(queries.endYear) + 1).toString();
    conditions.transactionDate = Raw((transaction) => `${transaction} < :end`, {
      end: new Date(endYear),
    });
  }

  return getRepository(Resale).find({
    where: conditions,
    cache: true,
    order: {
      transactionDate: 'ASC',
    },
    // take: 20,
  });
};

export default {
  getResales,
};
