/* eslint-disable camelcase */

import { FlatType, Town } from './model';

export type ResaleRecord = {
  month: string;
  town: string;
  flat_type: string;
  block: string;
  street_name: string;
  storey_range: string;
  floor_area_sqm: string;
  flat_model: string;
  lease_commence_date: string;
  remaining_lease: string;
  resale_price: string;
};

export type QueryResale = {
  towns?: Town[] | Town;
  flatTypes?: FlatType[] | FlatType;
  minStorey?: number;
  maxStorey?: number;
  minFloorArea?: number;
  maxFloorArea?: number;
  minLeasePeriod?: number;
  maxLeasePeriod?: number;
  startYear?: number;
  endYear?: number;
};
