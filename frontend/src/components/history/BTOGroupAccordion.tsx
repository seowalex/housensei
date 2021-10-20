import {
  AttachMoneyRounded,
  BedRounded as BedRoundedIcon,
  CalendarTodayRounded as CalendarTodayRoundedIcon,
  CheckRounded as CheckRoundedIcon,
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
  Autocomplete,
  Button,
  Grid,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { matchSorter } from 'match-sorter';
import { SyntheticEvent, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useGetBTOGraphQuery } from '../../api/history';
import { useAppSelector } from '../../app/hooks';
import { decrementColorCount } from '../../reducers/colors';
import {
  removeGroup,
  selectBTOProjectsOfGroup,
  selectSelectedBTOProjectIdsOfGroup,
  updateGroup,
  updateSelectedBTOProjects,
} from '../../reducers/history';
import { BTOGroup, Group } from '../../types/groups';
import { BTOProject } from '../../types/history';
import {
  btoProjectsSorter,
  convertFlatTypeToFrontend,
  isSameBTOProject,
  mapUpdateFormValuesToGroupFilters,
  mapGroupToUpdateFormValues,
} from '../../utils/groups';
import { compareDates, formatDate } from '../../utils/history';
import { FormPaper, ModalPaper } from '../styled';
import GroupAccordionToolbar from './GroupAccordionToolbar';
import GroupDetails from './GroupDetails';
import GroupSummary from './GroupSummary';
import UpdateGroupForm, { UpdateGroupFormValues } from './UpdateGroupForm';

enum DisplayedModal {
  Update,
  Delete,
  Hidden,
}

interface Props {
  group: BTOGroup;
  expanded: boolean;
  onChangeSelectedGroup: (isExpanded: boolean) => void;
  onDuplicateGroup: (group: Group) => void;
}

const BTOGroupAccordion = (props: Props) => {
  const dispatch = useDispatch();
  const { group, expanded, onChangeSelectedGroup, onDuplicateGroup } = props;
  const projectsRecord = useAppSelector(selectBTOProjectsOfGroup(group.id));
  const projects = Object.values(projectsRecord);
  const selectedProjectIds = useAppSelector(
    selectSelectedBTOProjectIdsOfGroup(group.id)
  );
  const selectedProjects = selectedProjectIds.map(
    (projectId) => projectsRecord[projectId]
  );

  const { data: btoQueryResponse } = useGetBTOGraphQuery({
    ...group.filters,
    id: group.id,
  });

  const [displayedModal, setDisplayedModal] = useState<DisplayedModal>(
    DisplayedModal.Hidden
  );

  const onUpdateGroup: SubmitHandler<UpdateGroupFormValues> = (
    data: UpdateGroupFormValues
  ) => {
    const updatedGroup: Group = {
      ...group,
      type: data.type,
      name: data.name === '' ? group.name : data.name,
      filters: mapUpdateFormValuesToGroupFilters(data),
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
    dispatch(decrementColorCount(group.color));
    setDisplayedModal(DisplayedModal.Hidden);
    onChangeSelectedGroup(false);
  };

  const handleDisplayUpdateModal = () => {
    setDisplayedModal(DisplayedModal.Update);
  };

  const handleDisplayDeleteModal = () => {
    setDisplayedModal(DisplayedModal.Delete);
  };

  const handleDuplicateGroup = () => {
    onDuplicateGroup(group);
  };

  const handleChangeSelectedProjects = (
    event: SyntheticEvent,
    newSelectedProjects: BTOProject[]
  ) => {
    const newSelectedProjectIds = newSelectedProjects
      .map((selectedProject) => {
        const selectedRecord = Object.entries(projectsRecord).filter(
          ([id, project]) => isSameBTOProject(selectedProject, project)
        );
        if (selectedRecord.length === 0) {
          return '';
        }
        return selectedRecord[0][0];
      })
      .filter((projectId) => projectId !== '');

    dispatch(
      updateSelectedBTOProjects({
        id: group.id,
        projectIds: newSelectedProjectIds,
      })
    );
  };

  return (
    <>
      <Accordion
        expanded={expanded}
        onChange={(e, isExpanded) => {
          onChangeSelectedGroup(isExpanded);
        }}
        elevation={2}
      >
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
          <GroupSummary group={group} />
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                onChange={handleChangeSelectedProjects}
                value={selectedProjects ?? []}
                multiple
                disableCloseOnSelect
                options={
                  projects
                    ? [...projects].sort((left, right) => {
                        if (compareDates(left.date, right.date) === 0) {
                          return left.flatType.localeCompare(right.flatType);
                        }
                        return -compareDates(left.date, right.date);
                      })
                    : []
                }
                renderOption={(optionProps, option, { selected }) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <li {...optionProps}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ width: '100%' }}
                    >
                      <Stack spacing={0.5}>
                        <Typography>{option.name}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarTodayRoundedIcon fontSize="small" />
                          <Typography variant="body2">
                            {formatDate(option.date)}
                          </Typography>
                          <AttachMoneyRounded fontSize="small" />
                          <Typography variant="body2">
                            {option.price}
                          </Typography>
                          <BedRoundedIcon fontSize="small" />
                          <Typography variant="body2">
                            {convertFlatTypeToFrontend(option.flatType)}
                          </Typography>
                        </Stack>
                      </Stack>
                      {selected && <CheckRoundedIcon fontSize="small" />}
                    </Stack>
                  </li>
                )}
                isOptionEqualToValue={(option, value) =>
                  isSameBTOProject(option, value)
                }
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      selectedProjects == null || selectedProjects.length === 0
                        ? 'Mark specific BTO projects'
                        : 'Marked BTO Projects'
                    }
                    placeholder={
                      selectedProjects == null || selectedProjects.length === 0
                        ? 'Mark a project on the chart'
                        : ''
                    }
                  />
                )}
                filterOptions={(options, { inputValue }) =>
                  matchSorter(options, inputValue, {
                    keys: [
                      'name',
                      'price',
                      (item: BTOProject) => formatDate(item.date),
                    ],
                    sorter: btoProjectsSorter,
                  })
                }
              />
            </Grid>
            <Grid item xs>
              <GroupDetails group={group} />
            </Grid>
            <Grid item>
              <GroupAccordionToolbar
                groupId={group.id}
                onDisplayUpdateModal={handleDisplayUpdateModal}
                onDisplayDeleteModal={handleDisplayDeleteModal}
                onDuplicateGroup={handleDuplicateGroup}
              />
            </Grid>
          </Grid>
          {btoQueryResponse?.data.length === 0 && (
            <Grid item>
              <Alert severity="warning" icon={<WarningRoundedIcon />}>
                <AlertTitle>No projects found!</AlertTitle>
                Try making your filters less specific with the{' '}
                <EditRoundedIcon fontSize="small" /> icon.
              </Alert>
            </Grid>
          )}
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
          <UpdateGroupForm
            onSubmit={onUpdateGroup}
            handleClose={() => setDisplayedModal(DisplayedModal.Hidden)}
            currentData={mapGroupToUpdateFormValues(group)}
          />
        </FormPaper>
      </Modal>
      <Modal
        open={displayedModal === DisplayedModal.Delete}
        onClose={() => setDisplayedModal(DisplayedModal.Hidden)}
      >
        <ModalPaper>
          <Stack spacing={2}>
            <Typography variant="h5" textAlign="center">
              Delete Group?
            </Typography>
            <Typography sx={{ p: '0rem 1rem' }}>
              Are you sure you want to delete this group?
            </Typography>
            <Paper sx={{ p: '1rem' }} elevation={3}>
              <Stack spacing={1}>
                <GroupSummary group={group} />
                <GroupDetails group={group} />
              </Stack>
            </Paper>
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

export default BTOGroupAccordion;
