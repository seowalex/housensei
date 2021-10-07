import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { ChartDataPoint, PriceHistory } from '../types/history';
import { getChartData } from '../utils/history';

interface HistoryState {
  histories: PriceHistory[];
  chartData: ChartDataPoint[];
}

const initialState: HistoryState = {
  histories: [],
  chartData: [],
};

const slice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistory: (state, action: PayloadAction<PriceHistory>) => {
      state.histories.push(action.payload);
    },
    resetHistories: (state) => {
      state.histories = initialState.histories;
    },
    convertToChartData: (state) => {
      state.chartData = getChartData(state.histories);
    },
  },
});

export const { addHistory, resetHistories } = slice.actions;

export const selectHistories = (state: RootState): PriceHistory[] =>
  state.history.histories;

export default slice.reducer;
