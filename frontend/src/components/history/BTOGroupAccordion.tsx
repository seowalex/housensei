import {
  AttachMoneyRounded,
  BedroomParentRounded,
  CalendarTodayRounded,
  CheckRounded as CheckRoundedIcon,
  ControlPointDuplicateRounded,
  DeleteRounded as DeleteRoundedIcon,
  EditRounded as EditRoundedIcon,
  ExpandMoreRounded as ExpandMoreRoundedIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { matchSorter } from 'match-sorter';
import { SyntheticEvent, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useGetBTOGraphQuery } from '../../api/history';
import { useAppSelector } from '../../app/hooks';
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
  mapFormValuesToGroupFilters,
  mapGroupToFormValues,
} from '../../utils/groups';
import { compareDates, formatDate } from '../../utils/history';
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

  useGetBTOGraphQuery({
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
                          <CalendarTodayRounded fontSize="small" />
                          <Typography variant="body2">
                            {formatDate(option.date)}
                          </Typography>
                          <AttachMoneyRounded fontSize="small" />
                          <Typography variant="body2">
                            {option.price}
                          </Typography>
                          <BedroomParentRounded fontSize="small" />
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
              <Stack justifyContent="flex-end" sx={{ height: '100%' }}>
                <Tooltip title="Duplicate" placement="left" arrow>
                  <IconButton onClick={() => onDuplicateGroup(group)}>
                    <ControlPointDuplicateRounded fontSize="small" />
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

export default BTOGroupAccordion;
