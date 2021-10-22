/* eslint-disable import/prefer-default-export */
import { BackendFlatType, GroupFilters } from '../../types/groups';
import { Town } from '../../types/towns';
import { constructQueryString } from '../api';

const SQM_TO_SQFT_RATIO = 10.7639;
const FLAT_TYPE_TO_ROOMS: Record<BackendFlatType, number> = {
  [BackendFlatType.STUDIO]: 0,
  [BackendFlatType.ROOM_1]: 1,
  [BackendFlatType.ROOM_2]: 2,
  [BackendFlatType.ROOM_3]: 3,
  [BackendFlatType.ROOM_4]: 4,
  [BackendFlatType.ROOM_5]: 5,
  [BackendFlatType.GEN_3]: 5,
};

const getHDBEstate = (town: Town): number => {
  const towns = Object.values(Town);
  return towns.indexOf(town) + 1;
};

export const getPropertyGuruLink = (filters: GroupFilters): string => {
  const baseUrl = '//www.propertyguru.com.sg/property-for-sale';
  const town = filters.towns[0];
  const flatType = filters.flatTypes[0];
  const queryParams: Record<string, unknown> = {
    'beds[]': FLAT_TYPE_TO_ROOMS[flatType],
    freetext: town,
    'hdb_estate[]': getHDBEstate(town),
    listing_type: 'sale',
    market: 'residential',
  };

  if (filters.minFloorArea != null && filters.maxFloorArea != null) {
    queryParams.minsize = Math.floor(filters.minFloorArea * SQM_TO_SQFT_RATIO);
    queryParams.maxsize = Math.floor(filters.maxFloorArea * SQM_TO_SQFT_RATIO);
  }

  return `${baseUrl}${constructQueryString(queryParams)}`;
};
