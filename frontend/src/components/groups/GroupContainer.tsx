import { AddRounded as AddRoundedIcon } from '@mui/icons-material';
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Modal,
  Paper,
  Typography,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { createGroup, selectGroups } from '../../reducers/groups';
import { getGroupColor, mapFormValuesToGroup } from '../../utils/groups';
import GroupCard from './GroupCard';
import GroupForm, { FormPaper, GroupFormValues } from './GroupForm';

const AddGroupCard = styled(Card)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  borderStyle: 'dashed',
  height: '100%',
}));

const GroupContainer = () => {
  const dispatch = useDispatch();
  const groups = useAppSelector(selectGroups);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  const handleCreateGroup: SubmitHandler<GroupFormValues> = (
    data: GroupFormValues
  ) => {
    const createdGroup = mapFormValuesToGroup(
      data,
      getGroupColor(groups.length)
    );
    dispatch(createGroup(createdGroup));
    setShowCreateForm(false);
  };

  return (
    <Paper sx={{ p: '1rem 0rem' }}>
      <Box sx={{ p: '1rem', maxHeight: '15rem', overflow: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <AddGroupCard elevation={0}>
              <CardActionArea
                sx={{ height: '100%' }}
                onClick={() => setShowCreateForm(true)}
              >
                <CardContent>
                  <Grid container alignItems="center" justifyContent="center">
                    <Grid item>
                      <AddRoundedIcon sx={{ fontSize: 100 }} color="primary" />
                    </Grid>
                    <Grid item>
                      <Typography variant="h4" color="primary">
                        New Group
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </CardActionArea>
            </AddGroupCard>
          </Grid>
          {groups.map((group, index) => (
            <Grid item xs={6} md={3}>
              <GroupCard index={index} group={group} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Modal open={showCreateForm} onClose={() => setShowCreateForm(false)}>
        <FormPaper>
          <GroupForm
            onSubmit={handleCreateGroup}
            handleClose={() => setShowCreateForm(false)}
            submitText="Add Group"
          />
        </FormPaper>
      </Modal>
    </Paper>
  );
};

export default GroupContainer;
