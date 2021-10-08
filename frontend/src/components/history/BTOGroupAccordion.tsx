import {
  CheckRounded as CheckRoundedIcon,
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
  ListItemText,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useGetBTOGraphQuery } from '../../api/history';
import { useAppSelector } from '../../app/hooks';
import {
  removeGroup,
  selectBTOProjects,
  updateGroup,
} from '../../reducers/history';
import { BTOGroup, Group } from '../../types/groups';
import { BTOProject } from '../../types/history';
import {
  mapFormValuesToGroupFilters,
  mapGroupToFormValues,
} from '../../utils/groups';
import { ModalPaper } from '../styled';
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
  onChangeSelectedGroup: (event: SyntheticEvent, isExpanded: boolean) => void;
  projectsState: BTOProject[];
  onChangeSelectedProjects: (
    event: SyntheticEvent,
    projects: BTOProject[]
  ) => void;
}

const BTOGroupAccordion = (props: Props) => {
  const dispatch = useDispatch();
  const {
    group,
    expanded,
    onChangeSelectedGroup,
    projectsState,
    onChangeSelectedProjects,
  } = props;
  useGetBTOGraphQuery({
    ...group.filters,
    id: group.id,
  });
  const projects = useAppSelector(selectBTOProjects(group.id));
  const [displayedModal, setDisplayedModal] = useState<DisplayedModal>(
    DisplayedModal.Hidden
  );

  const onUpdateGroup: SubmitHandler<GroupFormValues> = (
    data: GroupFormValues
  ) => {
    const updatedGroup: Group = {
      ...group,
      type: data.type,
      name: data.name,
      filters: mapFormValuesToGroupFilters(data),
    };

    dispatch(
      updateGroup({
        id: group.id,
        group: updatedGroup,
      })
    );
  };

  const onDeleteGroup = () => {
    dispatch(removeGroup(group.id));
  };

  return (
    <>
      <Accordion
        expanded={expanded}
        onChange={onChangeSelectedGroup}
        elevation={2}
      >
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
          <GroupSummary group={group} />
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                onChange={onChangeSelectedProjects}
                value={projectsState ?? []}
                multiple
                disableCloseOnSelect
                options={projects ?? []}
                renderOption={(optionProps, option, { selected }) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <li {...optionProps}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ width: '100%' }}
                    >
                      <ListItemText
                        primary={option.name}
                        secondary={option.price}
                      />
                      {selected && <CheckRoundedIcon fontSize="small" />}
                    </Stack>
                  </li>
                )}
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name && option.date === value.date
                }
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="BTO Projects"
                    placeholder="Select a project to show on graph"
                  />
                )}
              />
            </Grid>
            <Grid item xs>
              <GroupDetails filters={group.filters} />
            </Grid>
            <Grid item>
              <Stack justifyContent="flex-end" sx={{ height: '100%' }}>
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
        onClose={() => setDisplayedModal(DisplayedModal.Hidden)}
      >
        <ModalPaper sx={{ width: '75%' }}>
          <GroupForm
            formType="update"
            onSubmit={onUpdateGroup}
            handleClose={() => setDisplayedModal(DisplayedModal.Hidden)}
            currentData={mapGroupToFormValues(group)}
          />
        </ModalPaper>
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
            <GroupDetails filters={group.filters} />
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
