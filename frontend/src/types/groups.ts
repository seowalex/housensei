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
  Color1 = '#e6261f', // 1
  Color2 = '#e96a20', // 7
  Color3 = '#f6cd28', // 3
  Color4 = '#9fde3f', // 5
  Color5 = '#3fa02c', // 8
  Color6 = '#25b8e4', // 2
  Color7 = '#3145d8', // 4
  Color8 = '#b319c8', // 6
}
