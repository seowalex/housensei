import { GroupFilters } from '../types/groups';
import { constructQueryString } from '../utils/api';
import api from './base';

type ResaleGraphDataQueryParams = Partial<GroupFilters> & { id: string };

interface ResaleGraphDataPoint {
  date: string;
  price: number;
}

export interface ResaleGraphDataResponse {
  id: string;
  data: ResaleGraphDataPoint[];
}

type BTOGroupFilters = Partial<
  Omit<
    GroupFilters,
    'minStory' | 'maxStorey' | 'minLeasePeriod' | 'maxLeasePeriod'
  >
>;
type BTOGraphDataQueryParams = Partial<BTOGroupFilters> & { id: string };

interface BTOGraphDataPoint {
  name: string;
  price: number;
  date: string;
}

export interface BTOGraphDataResponse {
  id: string;
  data: BTOGraphDataPoint[];
}

const historyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getResaleGraph: builder.query<
      ResaleGraphDataResponse,
      ResaleGraphDataQueryParams
    >({
      query: (queryParams) => ({
        url: `resale/graph/${constructQueryString(queryParams)}`,
      }),
      transformResponse: (response: { data: ResaleGraphDataResponse }) =>
        response.data,
    }),
    getBTOGraph: builder.query<BTOGraphDataResponse, BTOGraphDataQueryParams>({
      query: (queryParams) => ({
        url: `bto/graph/${constructQueryString(queryParams)}`,
      }),
      transformResponse: (response: { data: BTOGraphDataResponse }) =>
        response.data,
    }),
  }),
});

export const { useGetResaleGraphQuery, useGetBTOGraphQuery } = historyApi;

export const {
  endpoints: { getResaleGraph, getBTOGraph },
} = historyApi;
