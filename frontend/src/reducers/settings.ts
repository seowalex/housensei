import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';

export interface SettingsState {
  darkMode: boolean | null;
}

const initialState: SettingsState = {
  darkMode: null,
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
});

export const { setDarkMode } = slice.actions;

export const selectDarkMode = (state: RootState) => state.settings.darkMode;

export default slice.reducer;
