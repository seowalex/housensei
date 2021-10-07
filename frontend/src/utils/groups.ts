import { GroupFormValues } from '../components/groups/GroupForm';
import { Group, GroupColor, GroupFilters } from '../types/groups';

export const mapGroupToFormValues = (group: Group): GroupFormValues => {
  const { name, filters } = group;

  const isStoreyRangeEnabled =
    filters.minStorey != null && filters.maxStorey != null;
  const isFloorAreaRangeEnabled =
    filters.minFloorArea != null && filters.maxFloorArea != null;
  const isLeasePeriodRangeEnabled =
    filters.minLeasePeriod != null && filters.maxLeasePeriod != null;
  const isYearRangeEnabled =
    filters.startYear != null && filters.endYear != null;

  const groupFormValues: GroupFormValues = {
    name,
    towns: filters.towns,
    flatTypes: filters.flatTypes,
    isStoreyRangeEnabled,
    isFloorAreaRangeEnabled,
    isLeasePeriodRangeEnabled,
    isYearRangeEnabled,
  };

  if (isStoreyRangeEnabled) {
    groupFormValues.storeyRange = {
      lower: filters.minStorey,
      upper: filters.maxStorey,
    };
  }
  if (isFloorAreaRangeEnabled) {
    groupFormValues.floorAreaRange = {
      lower: filters.minFloorArea,
      upper: filters.maxFloorArea,
    };
  }
  if (isLeasePeriodRangeEnabled) {
    groupFormValues.leasePeriodRange = {
      lower: filters.minLeasePeriod,
      upper: filters.maxLeasePeriod,
    };
  }
  if (isYearRangeEnabled) {
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
