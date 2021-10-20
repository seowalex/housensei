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
  Color1,
  Color2,
  Color3,
  Color4,
  Color5,
  Color6,
  Color7,
  Color8,
}
