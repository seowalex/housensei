import api from './base';
import type { Town } from '../types/towns';
import type { BackendFlatType } from '../types/groups';

interface IslandHeatmapRequest {
  flatTypes: BackendFlatType[];
  year: number;
}

interface IslandHeatmapResponse {
  town: string;
  resalePrice: number;
}

interface TownHeatmapRequest {
  town: Town;
  flatTypes: BackendFlatType[];
  year: number;
}

interface TownHeatmapResponse {
  address: string;
  coordinates: [number, number];
  resalePrice: number;
  transactions: FlatTransaction[];
}

export interface FlatTransaction {
  flatType: BackendFlatType;
  resalePrice: number;
  transactionMonth: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getIslandHeatmap: builder.query<
      [IslandHeatmapResponse],
      IslandHeatmapRequest
    >({
      query: ({ flatTypes, year }) => ({
        url: `resale/heatmap/island?${flatTypes
          .map((flatType) => `flatTypes=${flatType}`)
          .join('&')}`,
        params: {
          years: year,
        },
      }),
      transformResponse: (response: { data: [IslandHeatmapResponse] }) =>
        response.data,
    }),
    getTownHeatmap: builder.query<[TownHeatmapResponse], TownHeatmapRequest>({
      query: ({ town, flatTypes, year }) => ({
        url: `resale/heatmap/town?${flatTypes
          .map((flatType) => `flatTypes=${flatType}`)
          .join('&')}`,
        params: {
          years: year,
          town,
        },
      }),
      transformResponse: (response: { data: [TownHeatmapResponse] }) =>
        response.data,
    }),
  }),
});

export const { useGetIslandHeatmapQuery, useGetTownHeatmapQuery } = extendedApi;
