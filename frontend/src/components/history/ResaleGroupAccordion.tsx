import {
  ArrowRightAltRounded as ArrowRightAltRoundedIcon,
  EditRounded as EditRoundedIcon,
  ExpandMoreRounded as ExpandMoreRoundedIcon,
  MoreVertRounded as MoreVertRoundedIcon,
  WarningAmberRounded as WarningAmberRoundedIcon,
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
import ReactGA from 'react-ga';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { useGetBTOGraphQuery, useGetResaleGraphQuery } from '../../api/history';
import { removeGroup, updateGroup } from '../../reducers/history';
import {
  decrementColorCount,
  incrementColorCount,
} from '../../reducers/colors';
import { Group, ResaleGroup } from '../../types/groups';
import {
  mapUpdateFormValuesToGroupFilters,
  mapGroupToUpdateFormValues,
} from '../../utils/groups';
import { FormPaper, ModalPaper } from '../styled';
import GroupDetails from './GroupDetails';
import GroupAdditionalFilters from './GroupAdditionalFilters';
import GroupSummary from './GroupSummary';
import UpdateGroupForm, { UpdateGroupFormValues } from './UpdateGroupForm';
import Logo99Co from './logos/Logo99Co';
import LogoPropertyGuru from './logos/LogoPropertyGuru';
import { get99CoLink } from '../../utils/propertySites/99co';
import { getPropertyGuruLink } from '../../utils/propertySites/propertyGuru';
import { EventCategory, HistoryEventAction } from '../../app/analytics';

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
      color: data.color,
      filters: mapUpdateFormValuesToGroupFilters(data),
    };

    dispatch(
      updateGroup({
        id: group.id,
        group: updatedGroup,
      })
    );
    dispatch(decrementColorCount(group.color));
    dispatch(incrementColorCount(data.color));
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
            <Grid item xs={12}>
              <GroupDetails
                group={group}
                onDisplayUpdateModal={handleDisplayUpdateModal}
                onDisplayDeleteModal={handleDisplayDeleteModal}
                onDuplicateGroup={handleDuplicateGroup}
              />
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
                <Stack
                  direction="row"
                  spacing={1}
                  data-tour="history-search-listings"
                >
                  <Button
                    variant="outlined"
                    href={get99CoLink(group.filters)}
                    target="_blank"
                    onClick={() => {
                      ReactGA.event({
                        category: EventCategory.History,
                        action: HistoryEventAction.SearchListings,
                      });
                    }}
                  >
                    <Logo99Co />
                  </Button>
                  <Button
                    variant="outlined"
                    href={getPropertyGuruLink(group.filters)}
                    target="_blank"
                    onClick={() => {
                      ReactGA.event({
                        category: EventCategory.History,
                        action: HistoryEventAction.SearchListings,
                      });
                    }}
                  >
                    <LogoPropertyGuru />
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            {resaleQueryResponse?.data.length === 0 && (
              <Grid item>
                <Alert severity="warning" icon={<WarningAmberRoundedIcon />}>
                  <AlertTitle>No resale data found!</AlertTitle>
                  Try editing your filters to be less specific. Click
                  <MoreVertRoundedIcon fontSize="small" />
                  <ArrowRightAltRoundedIcon fontSize="small" />
                  <EditRoundedIcon fontSize="small" />
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
                  onClose={() => setShowBTOAlert(false)}
                  data-tour="history-add-bto"
                >
                  <AlertTitle>{`${
                    btoQueryResponse?.data.length ?? ''
                  } BTO projects found!`}</AlertTitle>
                  We found {btoQueryResponse?.data.length ?? ''} BTO projects
                  with the same filters as this line.
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
                <Typography variant="h6">{group.name}</Typography>
                <GroupAdditionalFilters group={group} />
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
