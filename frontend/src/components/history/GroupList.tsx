import { Button, Grid, Modal, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../../app/hooks';
import { createGroup, resetGroups, selectGroups } from '../../reducers/history';
import {
  incrementColorCount,
  selectColorCount,
  setColorCount,
} from '../../reducers/colors';
import {
  BTOGroup,
  Group,
  GroupColor,
  GroupFilters,
  ResaleGroup,
} from '../../types/groups';
import {
  getGroupColor,
  mapCreateFormValuesToGroupFilters,
} from '../../utils/groups';
import { FormPaper, ModalPaper } from '../styled';
import BTOGroupAccordion from './BTOGroupAccordion';
import CreateGroupForm, { CreateGroupFormValues } from './CreateGroupForm';
import ResaleGroupAccordion from './ResaleGroupAccordion';

enum DisplayedModal {
  Create,
  Clear,
  Hidden,
}

interface Props {
  selectedGroup: string | undefined;
  onChangeSelectedGroup: (id: string) => (isExpanded: boolean) => void;
}

const GroupList = (props: Props) => {
  const dispatch = useDispatch();
  const { selectedGroup, onChangeSelectedGroup } = props;
  const groups = useAppSelector(selectGroups);
  const colorCount = useAppSelector(selectColorCount);
  const [displayedModal, setDisplayedModal] = useState<DisplayedModal>(
    DisplayedModal.Hidden
  );

  const handleCreateGroup: SubmitHandler<CreateGroupFormValues> = (
    data: CreateGroupFormValues
  ) => {
    const groupFilters: GroupFilters[] =
      mapCreateFormValuesToGroupFilters(data);
    if (groupFilters.length === 1) {
      const groupId = uuidv4();
      const color = getGroupColor(colorCount);
      const group: Group = {
        type: data.type,
        id: groupId,
        name: data.name === '' ? 'New Group' : data.name,
        color,
        filters: groupFilters[0],
      };

      dispatch(createGroup(group));
      dispatch(incrementColorCount(color));
      onChangeSelectedGroup(groupId)(true);
    } else {
      const colorCountCopy: Record<GroupColor, number> = { ...colorCount };
      const firstGroupId = uuidv4();
      for (let i = 0; i < groupFilters.length; i += 1) {
        const groupId = uuidv4();
        const color = getGroupColor(colorCountCopy);
        const group: Group = {
          type: data.type,
          id: i === 0 ? firstGroupId : groupId,
          name:
            data.name === '' ? `New Group ${i + 1}` : `${data.name} ${i + 1}`,
          color,
          filters: groupFilters[i],
        };
        dispatch(createGroup(group));
        colorCountCopy[color] += 1;
      }
      dispatch(setColorCount(colorCountCopy));
      onChangeSelectedGroup(firstGroupId)(true);
    }

    setDisplayedModal(DisplayedModal.Hidden);
  };

  const handleCreateBTOGroup = (group: Group) => {
    const groupId = uuidv4();
    const color = getGroupColor(colorCount);
    const {
      minStorey,
      maxStorey,
      minLeasePeriod,
      maxLeasePeriod,
      ...btoFilters
    } = group.filters;
    const btoGroup: Group = {
      type: 'bto',
      id: groupId,
      name: `${group.name} (BTO)`,
      color,
      filters: btoFilters,
    };
    dispatch(createGroup(btoGroup));
    dispatch(incrementColorCount(color));
    onChangeSelectedGroup(groupId)(true);
  };

  const handleDuplicateGroup = (group: Group) => {
    const groupId = uuidv4();
    const color = getGroupColor(colorCount);
    const duplicatedGroup: Group = {
      ...group,
      id: groupId,
      name: `${group.name} (Copy)`,
      color,
    };
    dispatch(createGroup(duplicatedGroup));
    dispatch(incrementColorCount(color));
    onChangeSelectedGroup(groupId)(true);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Grid container direction="row" spacing={2}>
        <Grid item xs>
          <Button
            variant="contained"
            size="large"
            onClick={() => setDisplayedModal(DisplayedModal.Create)}
            sx={{ width: '100%' }}
          >
            New Group
          </Button>
        </Grid>
        {groups.length > 0 && (
          <Grid item xs={6}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setDisplayedModal(DisplayedModal.Clear)}
              sx={{ width: '100%' }}
              color="error"
            >
              Clear Groups
            </Button>
          </Grid>
        )}
      </Grid>
      <Stack spacing={0}>
        {groups.map((group) =>
          group.type === 'resale' ? (
            <ResaleGroupAccordion
              group={group as ResaleGroup}
              expanded={selectedGroup === group.id}
              onChangeSelectedGroup={onChangeSelectedGroup(group.id)}
              onDuplicateGroup={handleDuplicateGroup}
              onCreateBTOGroup={handleCreateBTOGroup}
            />
          ) : (
            <BTOGroupAccordion
              group={group as BTOGroup}
              expanded={selectedGroup === group.id}
              onChangeSelectedGroup={onChangeSelectedGroup(group.id)}
              onDuplicateGroup={handleDuplicateGroup}
            />
          )
        )}
      </Stack>
      <Modal
        open={displayedModal === DisplayedModal.Create}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setDisplayedModal(DisplayedModal.Hidden);
          }
        }}
      >
        <FormPaper>
          <CreateGroupForm
            onSubmit={handleCreateGroup}
            handleClose={() => setDisplayedModal(DisplayedModal.Hidden)}
          />
        </FormPaper>
      </Modal>
      <Modal
        open={displayedModal === DisplayedModal.Clear}
        onClose={() => setDisplayedModal(DisplayedModal.Hidden)}
      >
        <ModalPaper>
          <Stack spacing={2}>
            <Typography variant="h5" textAlign="center">
              Clear All Groups?
            </Typography>
            <Typography sx={{ p: '0rem 1rem' }}>
              Are you sure you want to clear all groups?
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => setDisplayedModal(DisplayedModal.Hidden)}
                sx={{ width: '50%' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  dispatch(resetGroups());
                  setDisplayedModal(DisplayedModal.Hidden);
                }}
                sx={{ width: '50%' }}
              >
                Clear All
              </Button>
            </Stack>
          </Stack>
        </ModalPaper>
      </Modal>
    </Stack>
  );
};

export default GroupList;
