import { MatchSorterOptions } from 'match-sorter';

import type { CreateGroupFormValues } from '../components/history/CreateGroupForm';
import type { UpdateGroupFormValues } from '../components/history/UpdateGroupForm';
import {
  BackendFlatType,
  FlatType,
  Group,
  GroupColor,
  GroupFilters,
} from '../types/groups';
import { BTOProject } from '../types/history';

const convertFlatTypeToBackend = (flatType: FlatType): BackendFlatType => {
  switch (flatType) {
    case FlatType.ROOM_1:
      return BackendFlatType.ROOM_1;
    case FlatType.ROOM_2:
      return BackendFlatType.ROOM_2;
    case FlatType.ROOM_3:
      return BackendFlatType.ROOM_3;
    case FlatType.ROOM_4:
      return BackendFlatType.ROOM_4;
    case FlatType.ROOM_5:
      return BackendFlatType.ROOM_5;
    case FlatType.GEN_3:
      return BackendFlatType.GEN_3;
    case FlatType.STUDIO:
      return BackendFlatType.STUDIO;
    default:
      return BackendFlatType.STUDIO;
  }
};

export const convertFlatTypeToFrontend = (
  flatType: BackendFlatType
): FlatType => {
  switch (flatType) {
    case BackendFlatType.ROOM_1:
      return FlatType.ROOM_1;
    case BackendFlatType.ROOM_2:
      return FlatType.ROOM_2;
    case BackendFlatType.ROOM_3:
      return FlatType.ROOM_3;
    case BackendFlatType.ROOM_4:
      return FlatType.ROOM_4;
    case BackendFlatType.ROOM_5:
      return FlatType.ROOM_5;
    case BackendFlatType.GEN_3:
      return FlatType.GEN_3;
    case BackendFlatType.STUDIO:
      return FlatType.STUDIO;
    default:
      return FlatType.STUDIO;
  }
};

export const isSameBTOProject = (a: BTOProject, b: BTOProject) =>
  a.name === b.name &&
  a.date === b.date &&
  a.price === b.price &&
  a.flatType === b.flatType;

export const btoProjectsSorter: MatchSorterOptions<BTOProject>['sorter'] = (
  rankedItems
) => [...rankedItems].sort((a, b) => -a.item.date.localeCompare(b.item.date));

export const mapGroupToUpdateFormValues = (
  group: Group
): UpdateGroupFormValues => {
  const { type, name, filters, color } = group;

  const groupFormValues: UpdateGroupFormValues = {
    name,
    type,
    color,
    towns: filters.towns[0],
    flatTypes: convertFlatTypeToFrontend(filters.flatTypes[0]),
    isStoreyRangeEnabled:
      filters.minStorey != null && filters.maxStorey != null,
    isFloorAreaRangeEnabled:
      filters.minFloorArea != null && filters.maxFloorArea != null,
    isLeasePeriodRangeEnabled:
      filters.minLeasePeriod != null && filters.maxLeasePeriod != null,
    isYearRangeEnabled: filters.startYear != null && filters.endYear != null,
  };

  if (filters.minFloorArea != null && filters.maxFloorArea != null) {
    groupFormValues.floorAreaRange = {
      lower: filters.minFloorArea,
      upper: filters.maxFloorArea,
    };
  }
  if (filters.startYear != null && filters.endYear != null) {
    groupFormValues.yearRange = {
      lower: filters.startYear,
      upper: filters.endYear,
    };
  }
  if (type === 'resale') {
    if (filters.minStorey != null && filters.maxStorey != null) {
      groupFormValues.storeyRange = {
        lower: filters.minStorey,
        upper: filters.maxStorey,
      };
    }
    if (filters.minLeasePeriod != null && filters.maxLeasePeriod != null) {
      groupFormValues.leasePeriodRange = {
        lower: filters.minLeasePeriod,
        upper: filters.maxLeasePeriod,
      };
    }
  }

  return groupFormValues;
};

export const mapCreateFormValuesToGroupFilters = (
  data: CreateGroupFormValues
): GroupFilters[] => {
  const baseFilters: GroupFilters = {
    towns: [],
    flatTypes: [],
  };

  if (data.isFloorAreaRangeEnabled && data.floorAreaRange != null) {
    baseFilters.minFloorArea = data.floorAreaRange.lower;
    baseFilters.maxFloorArea = data.floorAreaRange.upper;
  }

  if (data.isYearRangeEnabled && data.yearRange != null) {
    baseFilters.startYear = data.yearRange.lower;
    baseFilters.endYear = data.yearRange.upper;
  }

  if (data.type === 'resale') {
    if (data.isStoreyRangeEnabled && data.storeyRange != null) {
      baseFilters.minStorey = data.storeyRange.lower;
      baseFilters.maxStorey = data.storeyRange.upper;
    }

    if (data.isLeasePeriodRangeEnabled && data.leasePeriodRange != null) {
      baseFilters.minLeasePeriod = data.leasePeriodRange.lower;
      baseFilters.maxLeasePeriod = data.leasePeriodRange.upper;
    }
  }

  const groupFilters: GroupFilters[] = [];

  data.towns.forEach((town) => {
    data.flatTypes.forEach((flatType) => {
      groupFilters.push({
        ...baseFilters,
        towns: [town],
        flatTypes: [convertFlatTypeToBackend(flatType)],
      });
    });
  });

  return groupFilters;
};

export const mapUpdateFormValuesToGroupFilters = (
  data: UpdateGroupFormValues
): GroupFilters => {
  const groupFilters: GroupFilters = {
    towns: data.towns ? [data.towns] : [],
    flatTypes: data.flatTypes ? [convertFlatTypeToBackend(data.flatTypes)] : [],
  };

  if (data.isFloorAreaRangeEnabled && data.floorAreaRange != null) {
    groupFilters.minFloorArea = data.floorAreaRange.lower;
    groupFilters.maxFloorArea = data.floorAreaRange.upper;
  }

  if (data.isYearRangeEnabled && data.yearRange != null) {
    groupFilters.startYear = data.yearRange.lower;
    groupFilters.endYear = data.yearRange.upper;
  }

  if (data.type === 'resale') {
    if (data.isStoreyRangeEnabled && data.storeyRange != null) {
      groupFilters.minStorey = data.storeyRange.lower;
      groupFilters.maxStorey = data.storeyRange.upper;
    }

    if (data.isLeasePeriodRangeEnabled && data.leasePeriodRange != null) {
      groupFilters.minLeasePeriod = data.leasePeriodRange.lower;
      groupFilters.maxLeasePeriod = data.leasePeriodRange.upper;
    }
  }

  return groupFilters;
};

export const getGroupColor = (
  colorCount: Record<GroupColor, number>
): GroupColor => {
  let minCount = colorCount[GroupColor.Color1];
  let colors: GroupColor[] = [GroupColor.Color1];

  Object.entries(colorCount).forEach(([color, count]) => {
    const groupColor: GroupColor = parseInt(color, 10);
    if (count < minCount) {
      minCount = count;
      colors = [groupColor];
    } else if (count === minCount) {
      colors.push(groupColor);
    }
  });

  return colors[Math.floor(Math.random() * colors.length)];
};
