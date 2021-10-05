import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../app/store';
import { GroupFilters } from '../types/history';

export interface HistoryState {
  groups: GroupFilters[];
}

const initialState: HistoryState = {
  groups: [],
};

const slice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    createGroup: (state, action: PayloadAction<GroupFilters>) => {
      state.groups.push(action.payload);
    },
    updateGroup: (
      state,
      action: PayloadAction<{ index: number; filters: GroupFilters }>
    ) => {
      state.groups[action.payload.index] = action.payload.filters;
    },
    removeGroup: (state, action: PayloadAction<number>) => {
      state.groups.splice(action.payload, 1);
    },
    resetGroups: (state) => {
      state.groups = initialState.groups;
    },
  },
});

export const { createGroup, updateGroup, removeGroup, resetGroups } =
  slice.actions;

export const selectGroups = (state: RootState) => state.history.groups;

export default slice.reducer;
