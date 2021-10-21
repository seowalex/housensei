import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { GroupColor } from '../types/groups';
import { getGroupColor } from '../utils/groups';

export interface ColorsState {
  colorCount: Record<GroupColor, number>;
}

const initialState: ColorsState = {
  colorCount: {
    [GroupColor.Color1]: 0,
    [GroupColor.Color2]: 0,
    [GroupColor.Color3]: 0,
    [GroupColor.Color4]: 0,
    [GroupColor.Color5]: 0,
    [GroupColor.Color6]: 0,
    [GroupColor.Color7]: 0,
    [GroupColor.Color8]: 0,
  },
};

const slice = createSlice({
  name: 'colors',
  initialState,
  reducers: {
    incrementColorCount: (state, action: PayloadAction<GroupColor>) => {
      state.colorCount[action.payload] += 1;
    },
    decrementColorCount: (state, action: PayloadAction<GroupColor>) => {
      if (state.colorCount[action.payload] > 0) {
        state.colorCount[action.payload] -= 1;
      }
    },
  },
});

export const { incrementColorCount, decrementColorCount } = slice.actions;

export const selectColorCount = (
  state: RootState
): Record<GroupColor, number> => state.colors.colorCount;
export const selectNextColor = (state: RootState): GroupColor =>
  getGroupColor(state.colors.colorCount);

export default slice.reducer;
