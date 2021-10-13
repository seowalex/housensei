import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';

export interface SettingsState {
  darkMode: boolean | null;
  heatmap: {
    showHeatmap: boolean;
    showPrices: boolean;
  };
}

const initialState: SettingsState = {
  darkMode: null,
  heatmap: {
    showHeatmap: true,
    showPrices: true,
  },
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setShowHeatmap: (state, action: PayloadAction<boolean>) => {
      state.heatmap.showHeatmap = action.payload;
    },
    setShowHeatmapPrices: (state, action: PayloadAction<boolean>) => {
      state.heatmap.showPrices = action.payload;
    },
  },
});

export const { setDarkMode, setShowHeatmap, setShowHeatmapPrices } =
  slice.actions;

export const selectDarkMode = (state: RootState) => state.settings.darkMode;
export const selectShowHeatmap = (state: RootState) =>
  state.settings.heatmap.showHeatmap;
export const selectShowHeatmapPrices = (state: RootState) =>
  state.settings.heatmap.showPrices;

export default slice.reducer;
