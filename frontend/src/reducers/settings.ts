import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';

export interface SettingsState {
  prefersDarkMode: boolean | null;
}

const initialState: SettingsState = {
  prefersDarkMode: null,
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPrefersDarkMode: (state, action: PayloadAction<boolean>) => {
      state.prefersDarkMode = action.payload;
    },
  },
});

export const { setPrefersDarkMode } = slice.actions;

export const selectPrefersDarkMode = (state: RootState) =>
  state.settings.prefersDarkMode;

export default slice.reducer;
