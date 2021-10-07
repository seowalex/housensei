import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../app/store';
import { Group } from '../types/groups';

interface GroupsState {
  groups: Group[];
}

const initialState: GroupsState = {
  groups: [],
};

const slice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    createGroup: (state, action: PayloadAction<Group>) => {
      state.groups.push(action.payload);
    },
    updateGroup: (
      state,
      action: PayloadAction<{ index: number; group: Group }>
    ) => {
      state.groups[action.payload.index] = action.payload.group;
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

export const selectGroups = (state: RootState): Group[] => state.groups.groups;

export default slice.reducer;
