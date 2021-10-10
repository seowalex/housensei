import type { Town } from './towns';

export enum FlatType {
  ROOM_1 = '1 Room',
  ROOM_2 = '2 Room',
  ROOM_3 = '3 Room',
  ROOM_4 = '4 Room',
  ROOM_5 = '5 Room',
  GEN_3 = '3Gen',
  STUDIO = 'Studio',
}

export enum BackendFlatType {
  ROOM_1 = '1-room',
  ROOM_2 = '2-room',
  ROOM_3 = '3-room',
  ROOM_4 = '4-room',
  ROOM_5 = '5-room',
  GEN_3 = 'gen',
  STUDIO = 'studio',
}

export interface GroupFilters {
  towns: Town[];
  flatTypes: BackendFlatType[];
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
  type: 'resale' | 'bto';
  id: string;
  name: string;
  color: GroupColor;
  filters: GroupFilters;
}

export interface ResaleGroup extends Group {
  type: 'resale';
}

export interface BTOGroup extends Group {
  type: 'bto';
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
