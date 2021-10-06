/* eslint-disable import/prefer-default-export */
import api from './base';

interface IslandHeatmapResponse {
  town: string;
  resalePrice: number;
}

const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getIslandHeatmap: builder.query<[IslandHeatmapResponse], number>({
      query: (year) => ({
        url: `resale/heatmap/island?${new URLSearchParams({
          years: year.toString(),
        }).toString()}`,
      }),
      transformResponse: (response: { data: [IslandHeatmapResponse] }) =>
        response.data,
    }),
  }),
});

export const { useGetIslandHeatmapQuery } = extendedApi;
