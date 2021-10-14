import { Button, Modal, Stack } from '@mui/material';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../../app/hooks';
import { createGroup, selectGroups } from '../../reducers/history';
import { BTOGroup, Group, GroupFilters, ResaleGroup } from '../../types/groups';
import { getGroupColor, mapFormValuesToGroupFilters } from '../../utils/groups';
import { FormPaper } from '../styled';
import BTOGroupAccordion from './BTOGroupAccordion';
import GroupForm, { GroupFormValues } from './GroupForm';
import ResaleGroupAccordion from './ResaleGroupAccordion';

interface Props {
  selectedGroup: string | undefined;
  onChangeSelectedGroup: (id: string) => (isExpanded: boolean) => void;
}

const GroupList = (props: Props) => {
  const dispatch = useDispatch();
  const { selectedGroup, onChangeSelectedGroup } = props;
  const groups = useAppSelector(selectGroups);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  const handleCreateGroup: SubmitHandler<GroupFormValues> = (
    data: GroupFormValues
  ) => {
    const filters: GroupFilters = mapFormValuesToGroupFilters(data);
    const groupId = uuidv4();
    const group: Group = {
      type: data.type,
      id: groupId,
      name: data.name === '' ? `Group ${groups.length + 1}` : data.name,
      color: getGroupColor(groups.length),
      filters,
    };
    dispatch(createGroup(group));
    onChangeSelectedGroup(groupId)(true);
    setShowCreateForm(false);
  };

  const handleCreateBTOGroup = (group: Group) => {
    const groupId = uuidv4();
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
      color: getGroupColor(groups.length),
      filters: btoFilters,
    };
    dispatch(createGroup(btoGroup));
    onChangeSelectedGroup(groupId)(true);
  };

  const handleDuplicateGroup = (group: Group) => {
    const groupId = uuidv4();
    const duplicatedGroup: Group = {
      ...group,
      id: groupId,
      name: `${group.name} (Copy)`,
      color: getGroupColor(groups.length),
    };
    dispatch(createGroup(duplicatedGroup));
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
          <GroupForm
            formType="create"
            onSubmit={handleCreateGroup}
            handleClose={() => setShowCreateForm(false)}
            groupNamePlaceholder={`Group ${groups.length + 1}`}
          />
        </FormPaper>
      </Modal>
    </Stack>
  );
};

export default GroupList;
