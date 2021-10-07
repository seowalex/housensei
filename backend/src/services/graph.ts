import {
  Between,
  FindConditions,
  getRepository,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Raw,
} from 'typeorm';
import BTO from '../models/bto';
import { QueryResale } from '../utils/resaleRecord';
import Resale from '../models/resale';
import { Town, FlatType } from '../utils/model';

export type QueryBto = {
  towns?: Town[] | Town;
  flatTypes?: FlatType[] | FlatType;
  minFloorArea?: number;
  maxFloorArea?: number;
  startDate?: number;
  endDate?: number;
};

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
  });
};

const getBtos = async (queries: QueryBto): Promise<BTO[]> => {
  const conditions: FindConditions<BTO> = {};
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

  if (queries.minFloorArea) {
    conditions.minInternalFloorArea = MoreThanOrEqual(queries.minFloorArea);
  }

  if (queries.maxFloorArea) {
    conditions.maxInternalFloorArea = LessThanOrEqual(queries.maxFloorArea);
  }

  if (queries.startDate && queries.endDate) {
    const endYear = (Number(queries.endDate) + 1).toString();
    conditions.launchDate = Raw(
      (launch) => `${launch} >= :start AND ${launch} < :end`,
      {
        start: new Date(queries.startDate),
        end: new Date(endYear),
      }
    );
  } else if (queries.startDate) {
    conditions.launchDate = Raw((launch) => `${launch} >= :start`, {
      start: new Date(queries.startDate),
    });
  } else if (queries.endDate) {
    const endYear = (Number(queries.endDate) + 1).toString();
    conditions.launchDate = Raw((launch) => `${launch} < :end`, {
      end: new Date(endYear),
    });
  }

  return getRepository(BTO).find({
    where: conditions,
    cache: true,
    order: {
      name: 'ASC',
    },
    take: 20,
  });
};

export default {
  getResales,
  getBtos,
};
