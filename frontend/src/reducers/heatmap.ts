import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { Town } from '../types/towns';

export interface HeatmapState {
  town: Town | 'Islandwide';
  year: number;
}

const initialState: HeatmapState = {
  town: 'Islandwide',
  year: new Date().getFullYear(),
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTown: (state, action: PayloadAction<Town | 'Islandwide'>) => {
      state.town = action.payload;
    },
    setYear: (state, action: PayloadAction<number>) => {
      state.year = action.payload;
    },
  },
});

export const { setTown, setYear } = slice.actions;

export const selectTown = (state: RootState) => state.heatmap.town;
export const selectYear = (state: RootState) => state.heatmap.year;

export default slice.reducer;
