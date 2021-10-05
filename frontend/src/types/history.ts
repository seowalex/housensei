import { FlatType, Town } from './property';

export interface GroupFilters {
  towns: Town[];
  flatTypes: FlatType[];
  minStorey?: number;
  maxStorey?: number;
  minFloorArea?: number;
  maxFloorArea?: number;
  minLeasePeriod?: number;
  maxLeasePeriod?: number;
  startYear?: number;
  endYear?: number;
}
