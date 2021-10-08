import { Button, Modal, Stack } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../../app/hooks';
import { createGroup, selectGroups } from '../../reducers/history';
import { BTOGroup, Group, GroupFilters, ResaleGroup } from '../../types/groups';
import { BTOProject } from '../../types/history';
import { getGroupColor, mapFormValuesToGroupFilters } from '../../utils/groups';
import { FormPaper } from '../styled';
import BTOGroupAccordion from './BTOGroupAccordion';
import GroupForm, { GroupFormValues } from './GroupForm';
import ResaleGroupAccordion from './ResaleGroupAccordion';

interface Props {
  selectedGroup: string | undefined;
  onChangeSelectedGroup: (
    id: string
  ) => (event: SyntheticEvent, isExpanded: boolean) => void;
  projectsState: Record<string, BTOProject[]>;
  onChangeProject: (
    id: string
  ) => (event: SyntheticEvent, projects: BTOProject[]) => void;
}

const GroupList = (props: Props) => {
  const dispatch = useDispatch();
  const {
    selectedGroup,
    onChangeSelectedGroup,
    projectsState,
    onChangeProject,
  } = props;
  const groups = useAppSelector(selectGroups);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  const handleCreateGroup: SubmitHandler<GroupFormValues> = (
    data: GroupFormValues
  ) => {
    const filters: GroupFilters = mapFormValuesToGroupFilters(data);
    const group: Group = {
      type: data.type,
      id: uuidv4(),
      name: data.name,
      color: getGroupColor(groups.length),
      filters,
    };
    dispatch(createGroup(group));
    setShowCreateForm(false);
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
            />
          ) : (
            <BTOGroupAccordion
              group={group as BTOGroup}
              expanded={selectedGroup === group.id}
              onChangeSelectedGroup={onChangeSelectedGroup(group.id)}
              projectsState={projectsState[group.id]}
              onChangeSelectedProjects={onChangeProject(group.id)}
            />
          )
        )}
      </Stack>
      <Modal open={showCreateForm} onClose={() => setShowCreateForm(false)}>
        <FormPaper>
          <GroupForm
            formType="create"
            onSubmit={handleCreateGroup}
            handleClose={() => setShowCreateForm(false)}
          />
        </FormPaper>
      </Modal>
    </Stack>
  );
};

export default GroupList;
