import { BTOGroupFilters, GroupFilters } from '../types/groups';
import { constructQueryString } from '../utils/api';
import api from './base';

type ResaleGraphDataQueryParams = Partial<GroupFilters>;

interface ResaleGraphDataResponse {
  date: string;
  price: number;
}

type BTOGraphDataQueryParams = Partial<BTOGroupFilters>;

interface BTOGraphDataResponse {
  name: string;
  price: number;
  date: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getResaleGraph: builder.query<
      ResaleGraphDataResponse[],
      ResaleGraphDataQueryParams
    >({
      query: (queryParams) => ({
        url: `resale/graph/${constructQueryString(queryParams)}`,
      }),
      transformResponse: (response: { data: ResaleGraphDataResponse[] }) =>
        response.data,
    }),
    getBTOGraph: builder.query<BTOGraphDataResponse[], BTOGraphDataQueryParams>(
      {
        query: (queryParams) => ({
          url: `bto/graph/${constructQueryString(queryParams)}`,
        }),
        transformResponse: (response: { data: BTOGraphDataResponse[] }) =>
          response.data,
      }
    ),
  }),
});

export const { useGetResaleGraphQuery, useGetBTOGraphQuery } = extendedApi;
