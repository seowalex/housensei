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
import { aggregateBTOProjects, getChartData } from '../utils/history';

interface BTOProjectsData {
  projects: BTOProject[];
  aggregations: BTOProject[];
}

interface HistoryState {
  groups: Record<string, Group>;
  resaleRawData: Record<string, PriceDataPoint[]>;
  monthlyChartData: ChartDataPoint[];
  yearlyChartData: ChartDataPoint[];
  btoProjectsRecord: Record<string, BTOProjectsData>;
  displayedBTOProjectsRecord: Record<string, BTOProjectsData>;
}

const initialState: HistoryState = {
  groups: {},
  resaleRawData: {},
  monthlyChartData: [],
  yearlyChartData: [],
  btoProjectsRecord: {},
  displayedBTOProjectsRecord: {},
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
      const { type } = state.groups[action.payload];
      delete state.groups[action.payload];
      if (type === 'resale') {
        delete state.resaleRawData[action.payload];
        const [monthlyData, yearlyData] = getChartData(state.resaleRawData);
        state.monthlyChartData = monthlyData;
        state.yearlyChartData = yearlyData;
      } else {
        delete state.btoProjectsRecord[action.payload];
        delete state.displayedBTOProjectsRecord[action.payload];
      }
    },
    resetGroups: (state) => {
      state.groups = initialState.groups;
    },
    updateDisplayedBTOProjects: (
      state,
      action: PayloadAction<{ id: string; projects: BTOProject[] }>
    ) => {
      if (state.displayedBTOProjectsRecord[action.payload.id] != null) {
        state.displayedBTOProjectsRecord[action.payload.id].projects =
          action.payload.projects;
      }
    },
    updateDisplayedBTOAggregations: (
      state,
      action: PayloadAction<{ id: string; aggregations: BTOProject[] }>
    ) => {
      if (state.displayedBTOProjectsRecord[action.payload.id] != null) {
        state.displayedBTOProjectsRecord[action.payload.id].aggregations =
          action.payload.aggregations;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        getResaleGraph.matchFulfilled,
        (state, action: PayloadAction<ResaleGraphDataResponse>) => {
          state.resaleRawData[action.payload.id] = action.payload.data;
          const [monthlyData, yearlyData] = getChartData(state.resaleRawData);
          state.monthlyChartData = monthlyData;
          state.yearlyChartData = yearlyData;
          delete state.btoProjectsRecord[action.payload.id];
          delete state.displayedBTOProjectsRecord[action.payload.id];
        }
      )
      .addMatcher(
        getBTOGraph.matchFulfilled,
        (state, action: PayloadAction<BTOGraphDataResponse>) => {
          const aggregations = aggregateBTOProjects(action.payload.data);
          state.btoProjectsRecord[action.payload.id] = {
            projects: action.payload.data,
            aggregations,
          };
          state.displayedBTOProjectsRecord[action.payload.id] = {
            projects: [],
            aggregations,
          };
          if (state.resaleRawData[action.payload.id] != null) {
            delete state.resaleRawData[action.payload.id];
            const [monthlyData, yearlyData] = getChartData(state.resaleRawData);
            state.monthlyChartData = monthlyData;
            state.yearlyChartData = yearlyData;
          }
        }
      );
  },
});

export const {
  createGroup,
  updateGroup,
  removeGroup,
  resetGroups,
  updateDisplayedBTOProjects,
  updateDisplayedBTOAggregations,
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

export const selectDisplayedBTOProjectsRecord = (
  state: RootState
): Record<string, BTOProjectsData> => state.history.displayedBTOProjectsRecord;

export const selectBTOProjects =
  (id: string) =>
  (state: RootState): BTOProject[] =>
    state.history.btoProjectsRecord[id]?.projects ?? [];
export const selectBTOAggregations =
  (id: string) =>
  (state: RootState): BTOProject[] =>
    state.history.btoProjectsRecord[id]?.aggregations ?? [];
export const selectDisplayedBTOProjects =
  (id: string) =>
  (state: RootState): BTOProject[] =>
    state.history.displayedBTOProjectsRecord[id]?.projects ?? [];
export const selectDisplayedBTOAggregations =
  (id: string) =>
  (state: RootState): BTOProject[] =>
    state.history.displayedBTOProjectsRecord[id]?.aggregations ?? [];

export default slice.reducer;
