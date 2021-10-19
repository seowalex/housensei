import { Button, Modal, Stack } from '@mui/material';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../../app/hooks';
import { createGroup, selectGroups } from '../../reducers/history';
import {
  incrementColorCount,
  selectColorCount,
  setColorCount,
} from '../../reducers/colors';
import { BTOGroup, Group, GroupFilters, ResaleGroup } from '../../types/groups';
import {
  getGroupColor,
  mapCreateFormValuesToGroupFilters,
} from '../../utils/groups';
import { FormPaper } from '../styled';
import BTOGroupAccordion from './BTOGroupAccordion';
import CreateGroupForm, { CreateGroupFormValues } from './CreateGroupForm';
import ResaleGroupAccordion from './ResaleGroupAccordion';

interface Props {
  selectedGroup: string | undefined;
  onChangeSelectedGroup: (id: string) => (isExpanded: boolean) => void;
}

const GroupList = (props: Props) => {
  const dispatch = useDispatch();
  const { selectedGroup, onChangeSelectedGroup } = props;
  const groups = useAppSelector(selectGroups);
  const colorCount = useAppSelector(selectColorCount);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

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
      const colorCountCopy = { ...colorCount };
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

    setShowCreateForm(false);
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
      <Button
        variant="contained"
        size="large"
        onClick={() => setShowCreateForm(true)}
      >
        New Group
      </Button>
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
        open={showCreateForm}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setShowCreateForm(false);
          }
        }}
      >
        <FormPaper>
          <CreateGroupForm
            onSubmit={handleCreateGroup}
            handleClose={() => setShowCreateForm(false)}
          />
        </FormPaper>
      </Modal>
    </Stack>
  );
};

export default GroupList;
