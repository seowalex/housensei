import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { ColorTheme, rainbowTheme } from '../types/themes';

export interface SettingsState {
  darkMode: boolean | null;
  heatmap: {
    showHeatmap: boolean;
    showPrices: boolean;
    priceRange: {
      lower: number | null;
      upper: number | null;
    };
  };
  colorTheme: ColorTheme;
}

const initialState: SettingsState = {
  darkMode: null,
  heatmap: {
    showHeatmap: true,
    showPrices: true,
    priceRange: {
      lower: null,
      upper: null,
    },
  },
  colorTheme: rainbowTheme,
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
    setHeatmapPriceRangeLower: (state, action: PayloadAction<number>) => {
      state.heatmap.priceRange.lower = action.payload;
    },
    setHeatmapPriceRangeUpper: (state, action: PayloadAction<number>) => {
      state.heatmap.priceRange.upper = action.payload;
    },
    setColorTheme: (state, action: PayloadAction<ColorTheme>) => {
      state.colorTheme = action.payload;
    },
  },
});

export const {
  setDarkMode,
  setShowHeatmap,
  setShowHeatmapPrices,
  setHeatmapPriceRangeLower,
  setHeatmapPriceRangeUpper,
  setColorTheme,
} = slice.actions;

export const selectDarkMode = (state: RootState) => state.settings.darkMode;
export const selectShowHeatmap = (state: RootState) =>
  state.settings.heatmap.showHeatmap;
export const selectShowHeatmapPrices = (state: RootState) =>
  state.settings.heatmap.showPrices;
export const selectHeatmapPriceRangeLower = (state: RootState) =>
  state.settings.heatmap.priceRange.lower;
export const selectHeatmapPriceRangeUpper = (state: RootState) =>
  state.settings.heatmap.priceRange.upper;
export const selectColorTheme = (state: RootState): ColorTheme =>
  state.settings.colorTheme;

export default slice.reducer;
