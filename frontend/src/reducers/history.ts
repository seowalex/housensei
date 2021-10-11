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
import { getChartData } from '../utils/history';

interface HistoryState {
  groups: Record<string, Group>;
  resaleRawData: Record<string, PriceDataPoint[]>;
  monthlyChartData: ChartDataPoint[];
  yearlyChartData: ChartDataPoint[];
  btoProjectsRecord: Record<string, BTOProject[]>;
}

const initialState: HistoryState = {
  groups: {},
  resaleRawData: {},
  monthlyChartData: [],
  yearlyChartData: [],
  btoProjectsRecord: {},
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
        const [monthlyData, yearlyData] = getChartData(
          state.resaleRawData,
          state.groups
        );
        state.monthlyChartData = monthlyData;
        state.yearlyChartData = yearlyData;
      } else {
        delete state.btoProjectsRecord[action.payload];
      }
    },
    resetGroups: (state) => {
      state.groups = initialState.groups;
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
            state.groups
          );
          state.monthlyChartData = monthlyData;
          state.yearlyChartData = yearlyData;
          delete state.btoProjectsRecord[action.payload.id];
        }
      )
      .addMatcher(
        getBTOGraph.matchFulfilled,
        (state, action: PayloadAction<BTOGraphDataResponse>) => {
          state.btoProjectsRecord[action.payload.id] = action.payload.data;
          delete state.resaleRawData[action.payload.id];
          const [monthlyData, yearlyData] = getChartData(
            state.resaleRawData,
            state.groups
          );
          state.monthlyChartData = monthlyData;
          state.yearlyChartData = yearlyData;
        }
      );
  },
});

export const { createGroup, updateGroup, removeGroup, resetGroups } =
  slice.actions;

export const selectGroups = (state: RootState): Group[] =>
  Object.values(state.history.groups).sort((left, right) =>
    left.name.localeCompare(right.name)
  );

export const selectMonthlyChartData = (state: RootState): ChartDataPoint[] =>
  state.history.monthlyChartData;
export const selectYearlyChartData = (state: RootState): ChartDataPoint[] =>
  state.history.yearlyChartData;
export const selectBTOProjectsRecord = (
  state: RootState
): Record<string, BTOProject[]> => state.history.btoProjectsRecord;
export const selectBTOProjects =
  (id: string) =>
  (state: RootState): BTOProject[] =>
    state.history.btoProjectsRecord[id];

export default slice.reducer;
