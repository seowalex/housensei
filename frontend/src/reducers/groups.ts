import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../app/store';
import { GroupFilters } from '../types/groups';

interface GroupsState {
  groups: GroupFilters[];
}

const initialState: GroupsState = {
  groups: [],
};

const slice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    createGroup: (state, action: PayloadAction<GroupFilters>) => ({
      groups: [...state.groups, action.payload],
    }),
    updateGroup: (
      state,
      action: PayloadAction<{ index: number; filters: GroupFilters }>
    ) => ({
      groups: [
        ...state.groups.slice(0, action.payload.index),
        action.payload.filters,
        ...state.groups.slice(action.payload.index + 1),
      ],
    }),
    removeGroup: (state, action: PayloadAction<number>) => ({
      groups: [
        ...state.groups.slice(0, action.payload),
        ...state.groups.slice(action.payload + 1),
      ],
    }),
    resetGroups: (state) => ({
      groups: initialState.groups,
    }),
  },
});

export const { createGroup, updateGroup, removeGroup, resetGroups } =
  slice.actions;

export const selectGroups = (state: RootState): GroupFilters[] =>
  state.groups.groups;

export default slice.reducer;
