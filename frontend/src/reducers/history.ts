import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { PriceHistory } from '../types/history';

interface HistoryState {
  histories: PriceHistory[];
}

const initialState: HistoryState = {
  histories: [],
};

const slice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistory: (state, action: PayloadAction<PriceHistory>) => ({
      histories: [...state.histories, action.payload],
    }),
    resetHistories: (state) => ({
      histories: initialState.histories,
    }),
  },
});

export const { addHistory, resetHistories } = slice.actions;

export const selectHistories = (state: RootState): PriceHistory[] =>
  state.history.histories;

export default slice.reducer;
