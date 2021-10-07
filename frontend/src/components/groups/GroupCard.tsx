import { Circle } from '@mui/icons-material';
import {
  Card,
  CardActionArea,
  CardContent,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { removeGroup, resetGroups, updateGroup } from '../../reducers/groups';
import { Group } from '../../types/groups';
import { mapGroupToFormValues, mapFormValuesToGroup } from '../../utils/groups';
import GroupDetails from './GroupDetails';
import GroupForm, { FormPaper, GroupFormValues } from './GroupForm';

interface Props {
  index: number;
  group: Group;
}

const GroupCard = (props: Props) => {
  const dispatch = useDispatch();
  const { index, group } = props;
  const { name, color, filters } = group;
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  const handleUpdateGroup: SubmitHandler<GroupFormValues> = (
    data: GroupFormValues
  ) => {
    const updatedGroup = mapFormValuesToGroup(data, color);

    dispatch(
      updateGroup({
        index,
        group: updatedGroup,
      })
    );
    setShowUpdateForm(false);
  };

  const handleDeleteGroup = () => {
    dispatch(removeGroup(index));
  };

  return (
    <>
      <Card elevation={2} sx={{ height: '100%' }}>
        <CardActionArea
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
          onClick={() => setShowUpdateForm(true)}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Circle sx={{ fill: color }} />
              <Typography variant="h5" component="div">
                {name}
              </Typography>
            </Stack>
            <GroupDetails filters={filters} />
          </CardContent>
        </CardActionArea>
      </Card>
      <Modal open={showUpdateForm} onClose={() => setShowUpdateForm(false)}>
        <FormPaper>
          <GroupForm
            onSubmit={handleUpdateGroup}
            handleClose={() => setShowUpdateForm(false)}
            submitText="Edit Group"
            currentData={mapGroupToFormValues(group)}
            resetOnCancel
            onDelete={handleDeleteGroup}
          />
        </FormPaper>
      </Modal>
    </>
  );
};

export default GroupCard;
