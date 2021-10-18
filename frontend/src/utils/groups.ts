import { MatchSorterOptions } from 'match-sorter';

import { GroupFormValues } from '../components/history/GroupForm';
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

export const btoProjectsSorter: MatchSorterOptions<BTOProject>['sorter'] = (
  rankedItems
) => [...rankedItems].sort((a, b) => -a.item.date.localeCompare(b.item.date));

export const mapGroupToFormValues = (group: Group): GroupFormValues => {
  const { type, name, filters } = group;

  const groupFormValues: GroupFormValues = {
    name,
    type,
    towns: filters.towns,
    flatTypes: filters.flatTypes.map((flatType) =>
      convertFlatTypeToFrontend(flatType)
    ),
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

export const mapFormValuesToGroupFilters = (
  data: GroupFormValues
): GroupFilters => {
  const groupFilters: GroupFilters = {
    towns: data.towns,
    flatTypes: data.flatTypes.map((flatType) =>
      convertFlatTypeToBackend(flatType)
    ),
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

export const getGroupColor = (index: number): GroupColor => {
  const colors = [
    GroupColor.Color1,
    GroupColor.Color2,
    GroupColor.Color3,
    GroupColor.Color4,
    GroupColor.Color5,
    GroupColor.Color6,
    GroupColor.Color7,
    GroupColor.Color8,
  ];

  return colors[index % 8];
};
