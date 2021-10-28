import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { BackendFlatType } from '../types/groups';
import type { Town } from '../types/towns';

export interface HeatmapState {
  town: Town | 'Islandwide';
  flatTypes: BackendFlatType[];
  year: number;
}

const initialState: HeatmapState = {
  town: 'Islandwide',
  flatTypes: [],
  year: new Date().getFullYear(),
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTown: (state, action: PayloadAction<Town | 'Islandwide'>) => {
      state.town = action.payload;
    },
    setFlatTypes: (state, action: PayloadAction<BackendFlatType[]>) => {
      state.flatTypes = action.payload;
    },
    setYear: (state, action: PayloadAction<number>) => {
      state.year = action.payload;
    },
  },
});

export const { setTown, setFlatTypes, setYear } = slice.actions;

export const selectTown = (state: RootState) => state.heatmap.town;
export const selectFlatTypes = (state: RootState) => state.heatmap.flatTypes;
export const selectYear = (state: RootState) => state.heatmap.year;

export default slice.reducer;
