import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BTOGraphDataResponse,
  getBTOGraph,
  getResaleGraph,
  ResaleGraphDataResponse,
} from '../api/history';
import type { RootState } from '../app/store';
import { Group } from '../types/groups';
import { BTOProject, ChartDataPoint, PriceDataPoint } from '../types/history';
import { getChartData, transformRawBTOData } from '../utils/history';

export type BTOProjectsData = Record<string, BTOProject>;

interface HistoryState {
  groups: Record<string, Group>;
  resaleRawData: Record<string, PriceDataPoint[]>;
  btoRawData: Record<string, BTOProjectsData>;
  monthlyChartData: ChartDataPoint[];
  yearlyChartData: ChartDataPoint[];
  selectedBTOProjectIds: Record<string, string[]>;
}

const initialState: HistoryState = {
  groups: {},
  resaleRawData: {},
  btoRawData: {},
  monthlyChartData: [],
  yearlyChartData: [],
  selectedBTOProjectIds: {},
};

const slice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    createGroup: (state, action: PayloadAction<Group>) => {
      state.groups[action.payload.id] = action.payload;
    },
    updateGroup: (
      state,
      action: PayloadAction<{ id: string; group: Group }>
    ) => {
      state.groups[action.payload.id] = action.payload.group;
    },
    removeGroup: (state, action: PayloadAction<string>) => {
      delete state.resaleRawData[action.payload];
      delete state.btoRawData[action.payload];
      delete state.selectedBTOProjectIds[action.payload];
      delete state.groups[action.payload];
      const [monthlyData, yearlyData] = getChartData(
        state.resaleRawData,
        state.btoRawData
      );
      state.monthlyChartData = monthlyData;
      state.yearlyChartData = yearlyData;
    },
    resetGroups: (state) => {
      state.groups = initialState.groups;
    },
    updateSelectedBTOProjects: (
      state,
      action: PayloadAction<{ id: string; projectIds: string[] }>
    ) => {
      state.selectedBTOProjectIds[action.payload.id] =
        action.payload.projectIds;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        getResaleGraph.matchFulfilled,
        (state, action: PayloadAction<ResaleGraphDataResponse>) => {
          state.resaleRawData[action.payload.id] = action.payload.data;
          const [monthlyData, yearlyData] = getChartData(
            state.resaleRawData,
            state.btoRawData
          );
          state.monthlyChartData = monthlyData;
          state.yearlyChartData = yearlyData;
        }
      )
      .addMatcher(
        getBTOGraph.matchFulfilled,
        (state, action: PayloadAction<BTOGraphDataResponse>) => {
          const projectsData = transformRawBTOData(action.payload.data);
          state.btoRawData[action.payload.id] = projectsData;
          state.selectedBTOProjectIds[action.payload.id] = [];
          const [monthlyData, yearlyData] = getChartData(
            state.resaleRawData,
            state.btoRawData
          );
          state.monthlyChartData = monthlyData;
          state.yearlyChartData = yearlyData;
        }
      );
  },
});

export const {
  createGroup,
  updateGroup,
  removeGroup,
  resetGroups,
  updateSelectedBTOProjects,
} = slice.actions;

export const selectGroups = (state: RootState): Group[] =>
  Object.values(state.history.groups).sort((left, right) =>
    left.name.localeCompare(right.name)
  );
export const selectGroup =
  (id: string) =>
  (state: RootState): Group =>
    state.history.groups[id];

export const selectMonthlyChartData = (state: RootState): ChartDataPoint[] =>
  state.history.monthlyChartData;
export const selectYearlyChartData = (state: RootState): ChartDataPoint[] =>
  state.history.yearlyChartData;

export const selectBTORawData = (
  state: RootState
): Record<string, BTOProjectsData> => state.history.btoRawData;
export const selectAllBTOProjects = (state: RootState): BTOProjectsData => {
  let projectsData: BTOProjectsData = {};
  Object.values(state.history.btoRawData).forEach((projects) => {
    projectsData = { ...projectsData, ...projects };
  });
  return projectsData;
};
export const selectBTOProjectsOfGroup =
  (id: string) =>
  (state: RootState): BTOProjectsData =>
    state.history.btoRawData[id] ?? {};
export const selectSelectedBTOProjectIdsOfGroup =
  (id: string) =>
  (state: RootState): string[] =>
    state.history.selectedBTOProjectIds[id] ?? [];
export const selectSelectedBTOProjectIds = (
  state: RootState
): Record<string, string[]> => state.history.selectedBTOProjectIds;

export default slice.reducer;
