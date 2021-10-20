import api from './base';
import type { Town } from '../types/towns';
import type { BackendFlatType } from '../types/groups';

interface IslandHeatmapResponse {
  town: string;
  resalePrice: number;
}

interface TownHeatmapRequest {
  year: number;
  town: Town;
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
    getIslandHeatmap: builder.query<[IslandHeatmapResponse], number>({
      query: (year) => ({
        url: 'resale/heatmap/island',
        params: {
          years: year,
        },
      }),
      transformResponse: (response: { data: [IslandHeatmapResponse] }) =>
        response.data,
    }),
    getTownHeatmap: builder.query<[TownHeatmapResponse], TownHeatmapRequest>({
      query: ({ year, town }) => ({
        url: 'resale/heatmap/town',
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
