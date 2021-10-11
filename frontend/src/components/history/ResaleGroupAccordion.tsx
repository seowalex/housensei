import {
  ControlPointDuplicateRounded as ControlPointDuplicateRoundedIcon,
  DeleteRounded as DeleteRoundedIcon,
  EditRounded as EditRoundedIcon,
  ExpandMoreRounded as ExpandMoreRoundedIcon,
  WarningRounded as WarningRoundedIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Button,
  Grid,
  IconButton,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useGetResaleGraphQuery } from '../../api/history';
import { removeGroup, updateGroup } from '../../reducers/history';
import { Group, ResaleGroup } from '../../types/groups';
import {
  mapFormValuesToGroupFilters,
  mapGroupToFormValues,
} from '../../utils/groups';
import { FormPaper, ModalPaper } from '../styled';
import GroupDetails from './GroupDetails';
import GroupForm, { GroupFormValues } from './GroupForm';
import GroupSummary from './GroupSummary';

enum DisplayedModal {
  Update,
  Delete,
  Hidden,
}

interface Props {
  group: ResaleGroup;
  expanded: boolean;
  onChangeSelectedGroup: (isExpanded: boolean) => void;
  onDuplicateGroup: (group: Group) => void;
}

const ResaleGroupAccordion = (props: Props) => {
  const dispatch = useDispatch();
  const { group, expanded, onChangeSelectedGroup, onDuplicateGroup } = props;
  const { data: queryResponse } = useGetResaleGraphQuery({
    ...group.filters,
    id: group.id,
  });
  const [displayedModal, setDisplayedModal] = useState<DisplayedModal>(
    DisplayedModal.Hidden
  );

  const onUpdateGroup: SubmitHandler<GroupFormValues> = (
    data: GroupFormValues
  ) => {
    const updatedGroup: Group = {
      ...group,
      type: data.type,
      name: data.name === '' ? group.name : data.name,
      filters: mapFormValuesToGroupFilters(data),
    };

    dispatch(
      updateGroup({
        id: group.id,
        group: updatedGroup,
      })
    );
    setDisplayedModal(DisplayedModal.Hidden);
  };

  const onDeleteGroup = () => {
    dispatch(removeGroup(group.id));
    setDisplayedModal(DisplayedModal.Hidden);
    onChangeSelectedGroup(false);
  };

  return (
    <>
      <Accordion
        expanded={expanded}
        onChange={(e, isExpanded) => onChangeSelectedGroup(isExpanded)}
        elevation={2}
      >
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
          <GroupSummary group={group} />
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            <Grid item container xs={12}>
              <Grid item xs>
                <GroupDetails group={group} />
              </Grid>
              <Grid item>
                <Stack justifyContent="flex-end" sx={{ height: '100%' }}>
                  <Tooltip title="Duplicate" placement="left" arrow>
                    <IconButton onClick={() => onDuplicateGroup(group)}>
                      <ControlPointDuplicateRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    onClick={() => setDisplayedModal(DisplayedModal.Update)}
                  >
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => setDisplayedModal(DisplayedModal.Delete)}
                    color="error"
                  >
                    <DeleteRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
            {queryResponse?.data.length === 0 && (
              <Grid item>
                <Alert severity="warning" icon={<WarningRoundedIcon />}>
                  <AlertTitle>No data found!</AlertTitle>
                  Try changing your filters with the{' '}
                  <EditRoundedIcon fontSize="small" /> icon to be less specific.
                </Alert>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Modal
        open={displayedModal === DisplayedModal.Update}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setDisplayedModal(DisplayedModal.Hidden);
          }
        }}
      >
        <FormPaper>
          <GroupForm
            formType="update"
            onSubmit={onUpdateGroup}
            handleClose={() => setDisplayedModal(DisplayedModal.Hidden)}
            currentData={mapGroupToFormValues(group)}
          />
        </FormPaper>
      </Modal>
      <Modal
        open={displayedModal === DisplayedModal.Delete}
        onClose={() => setDisplayedModal(DisplayedModal.Hidden)}
      >
        <ModalPaper>
          <Stack spacing={1}>
            <Typography display="inline">
              Are you sure you want to delete this group?
            </Typography>
            <Stack direction="row" justifyContent="center">
              <GroupSummary group={group} />
            </Stack>
            <GroupDetails group={group} />
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
                  onDeleteGroup();
                  setDisplayedModal(DisplayedModal.Hidden);
                }}
                sx={{ width: '50%' }}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </ModalPaper>
      </Modal>
    </>
  );
};

export default ResaleGroupAccordion;
