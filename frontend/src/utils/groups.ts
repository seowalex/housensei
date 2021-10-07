import { GroupFormValues } from '../components/groups/GroupForm';
import { Group, GroupColor, GroupFilters } from '../types/groups';

export const mapGroupToFormValues = (group: Group): GroupFormValues => {
  const { name, filters } = group;

  const groupFormValues: GroupFormValues = {
    name,
    towns: filters.towns,
    flatTypes: filters.flatTypes,
    isStoreyRangeEnabled:
      filters.minStorey != null && filters.maxStorey != null,
    isFloorAreaRangeEnabled:
      filters.minFloorArea != null && filters.maxFloorArea != null,
    isLeasePeriodRangeEnabled:
      filters.minLeasePeriod != null && filters.maxLeasePeriod != null,
    isYearRangeEnabled: filters.startYear != null && filters.endYear != null,
  };

  if (filters.minStorey != null && filters.maxStorey != null) {
    groupFormValues.storeyRange = {
      lower: filters.minStorey,
      upper: filters.maxStorey,
    };
  }
  if (filters.minFloorArea != null && filters.maxFloorArea != null) {
    groupFormValues.floorAreaRange = {
      lower: filters.minFloorArea,
      upper: filters.maxFloorArea,
    };
  }
  if (filters.minLeasePeriod != null && filters.maxLeasePeriod != null) {
    groupFormValues.leasePeriodRange = {
      lower: filters.minLeasePeriod,
      upper: filters.maxLeasePeriod,
    };
  }
  if (filters.startYear != null && filters.endYear != null) {
    groupFormValues.yearRange = {
      lower: filters.startYear,
      upper: filters.endYear,
    };
  }

  return groupFormValues;
};

export const mapFormValuesToGroup = (
  data: GroupFormValues,
  color: GroupColor
): Group => {
  const groupFilters: GroupFilters = {
    towns: data.towns,
    flatTypes: data.flatTypes,
  };

  if (data.isStoreyRangeEnabled && data.storeyRange != null) {
    groupFilters.minStorey = data.storeyRange.lower;
    groupFilters.maxStorey = data.storeyRange.upper;
  }

  if (data.isFloorAreaRangeEnabled && data.floorAreaRange != null) {
    groupFilters.minFloorArea = data.floorAreaRange.lower;
    groupFilters.maxFloorArea = data.floorAreaRange.upper;
  }

  if (data.isLeasePeriodRangeEnabled && data.leasePeriodRange != null) {
    groupFilters.minLeasePeriod = data.leasePeriodRange.lower;
    groupFilters.maxLeasePeriod = data.leasePeriodRange.upper;
  }

  if (data.isYearRangeEnabled && data.yearRange != null) {
    groupFilters.startYear = data.yearRange.lower;
    groupFilters.endYear = data.yearRange.upper;
  }

  return {
    name: data.name,
    color,
    filters: groupFilters,
  };
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
