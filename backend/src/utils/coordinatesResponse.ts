export const COORDINATES_API = 'https://developers.onemap.sg/commonapi/search';

export type CoordinatesResponse = {
  found: number;
  totalNumPages: number;
  pageNum: number;
  results: Array<{
    SEARCHVAL: string;
    X: string;
    Y: string;
    LATITUDE: string;
    LONGITUDE: string;
    LONGTITUDE: string;
  }>;
};
