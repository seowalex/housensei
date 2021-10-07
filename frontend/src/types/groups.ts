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

export interface Group {
  name: string;
  color: GroupColor;
  filters: GroupFilters;
}

export enum GroupColor {
  Color1 = '#ffb74d',
  Color2 = '#ff8684',
  Color3 = '#e37ac3',
  Color4 = '#7486db',
  Color5 = '#ff9c64',
  Color6 = '#ff7aa5',
  Color7 = '#b280d6',
  Color8 = '#0288d1',
}
