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

const getQueryId = (town: Town): string => {
  switch (town) {
    case Town.CEN:
      return 'htcentral';
    case Town.KAL:
      return 'htkallang_whampoa';
    default:
      return `ht${town.toLowerCase().replaceAll(' ', '_')}`;
  }
};

export const get99CoLink = (filters: GroupFilters): string => {
  const baseUrl = '//www.99.co/singapore/sale';
  const town = filters.towns[0];
  const flatType = filters.flatTypes[0];
  const queryParams: Record<string, unknown> = {
    listing_type: 'sale',
    main_category: 'hdb',
    name: `${town} (HDB Town)`,
    query_ids: getQueryId(town),
    query_limit: 'radius',
    query_type: 'hdb_town',
    rooms: FLAT_TYPE_TO_ROOMS[flatType],
  };

  if (filters.minFloorArea != null && filters.maxFloorArea != null) {
    queryParams.floorarea_min = Math.floor(
      filters.minFloorArea * SQM_TO_SQFT_RATIO
    );
    queryParams.floorarea_max = Math.floor(
      filters.maxFloorArea * SQM_TO_SQFT_RATIO
    );
  }

  return `${baseUrl}${constructQueryString(queryParams)}`;
};
