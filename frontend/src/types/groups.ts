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
  Color2 = '#e37ac3',
  Color3 = '#ff9c64',
  Color4 = '#b280d6',
  Color5 = '#ff8684',
  Color6 = '#7486db',
  Color7 = '#ff7aa5',
  Color8 = '#0288d1',
}
