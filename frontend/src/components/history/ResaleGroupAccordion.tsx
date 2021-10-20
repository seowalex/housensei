import {
  EditRounded as EditRoundedIcon,
  ExpandMoreRounded as ExpandMoreRoundedIcon,
  NewReleasesRounded as NewReleasesRoundedIcon,
  WarningRounded as WarningRoundedIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Button,
  Collapse,
  Divider,
  Grid,
  Modal,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { useGetBTOGraphQuery, useGetResaleGraphQuery } from '../../api/history';
import { removeGroup, updateGroup } from '../../reducers/history';
import { decrementColorCount } from '../../reducers/colors';
import { Group, ResaleGroup } from '../../types/groups';
import {
  mapUpdateFormValuesToGroupFilters,
  mapGroupToUpdateFormValues,
} from '../../utils/groups';
import { FormPaper, ModalPaper } from '../styled';
import GroupAccordionToolbar from './GroupAccordionToolbar';
import GroupDetails from './GroupDetails';
import GroupSummary from './GroupSummary';
import UpdateGroupForm, { UpdateGroupFormValues } from './UpdateGroupForm';
import Logo99Co from './logos/Logo99Co';
import LogoPropertyGuru from './logos/LogoPropertyGuru';
import { get99CoLink } from '../../utils/propertySites/99co';
import { getPropertyGuruLink } from '../../utils/propertySites/propertyGuru';

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
  onCreateBTOGroup: (group: Group) => void;
}

const ResaleGroupAccordion = (props: Props) => {
  const dispatch = useDispatch();
  const {
    group,
    expanded,
    onChangeSelectedGroup,
    onDuplicateGroup,
    onCreateBTOGroup,
  } = props;

  const { data: resaleQueryResponse } = useGetResaleGraphQuery({
    ...group.filters,
    id: group.id,
  });

  const {
    minStorey,
    maxStorey,
    minLeasePeriod,
    maxLeasePeriod,
    ...btoFilters
  } = group.filters;
  const { data: btoQueryResponse } = useGetBTOGraphQuery({
    ...btoFilters,
    id: group.id,
  });

  const [displayedModal, setDisplayedModal] = useState<DisplayedModal>(
    DisplayedModal.Hidden
  );
  const [showBTOAlert, setShowBTOAlert] = useState<boolean>(true);

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
    setShowBTOAlert(true);
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
                <GroupAccordionToolbar
                  groupId={group.id}
                  onDisplayUpdateModal={handleDisplayUpdateModal}
                  onDisplayDeleteModal={handleDisplayDeleteModal}
                  onDuplicateGroup={handleDuplicateGroup}
                />
              </Grid>
            </Grid>
            <Grid item container direction="column" xs={12} spacing={1}>
              <Grid item>
                <Divider>
                  <Typography variant="body2">
                    Search Listings For Sale
                  </Typography>
                </Divider>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    href={get99CoLink(group.filters)}
                    target="_blank"
                  >
                    <Logo99Co />
                  </Button>
                  <Button
                    variant="outlined"
                    href={getPropertyGuruLink(group.filters)}
                    target="_blank"
                  >
                    <LogoPropertyGuru />
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            {resaleQueryResponse?.data.length === 0 && (
              <Grid item>
                <Alert severity="warning" icon={<WarningRoundedIcon />}>
                  <AlertTitle>No data found!</AlertTitle>
                  Try making your filters less specific with the{' '}
                  <EditRoundedIcon fontSize="small" /> icon.
                </Alert>
              </Grid>
            )}
            <Grid item>
              <Collapse
                in={
                  showBTOAlert &&
                  btoQueryResponse &&
                  btoQueryResponse.data.length > 0
                }
              >
                <Alert
                  severity="success"
                  icon={<NewReleasesRoundedIcon />}
                  onClose={() => setShowBTOAlert(false)}
                >
                  <AlertTitle>{`${
                    btoQueryResponse?.data.length ?? ''
                  } BTO projects found!`}</AlertTitle>
                  We found {btoQueryResponse?.data.length ?? ''} BTO projects
                  with the same filters as this group.
                  <Button
                    variant="text"
                    onClick={() => {
                      setShowBTOAlert(false);
                      onCreateBTOGroup(group);
                    }}
                  >
                    Add BTO to chart
                  </Button>
                </Alert>
              </Collapse>
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

export default ResaleGroupAccordion;
