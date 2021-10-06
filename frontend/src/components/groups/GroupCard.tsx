import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { removeGroup, updateGroup } from '../../reducers/groups';
import { GroupFilters } from '../../types/groups';
import {
  mapFiltersToFormValues,
  mapFormValuesToFilters,
} from '../../utils/groups';
import GroupForm, { FormPaper, GroupFormValues } from './GroupForm';

interface Props {
  name: string;
  index: number;
  filters: GroupFilters;
}

const GroupCard = (props: Props) => {
  const dispatch = useDispatch();
  const { name, index, filters } = props;
  const {
    towns,
    flatTypes,
    minStorey,
    maxStorey,
    minFloorArea,
    maxFloorArea,
    minLeasePeriod,
    maxLeasePeriod,
    startYear,
    endYear,
  } = filters;
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  const handleUpdateGroup: SubmitHandler<GroupFormValues> = (
    data: GroupFormValues
  ) => {
    const groupFilters = mapFormValuesToFilters(data);
    dispatch(
      updateGroup({
        index,
        filters: groupFilters,
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
            <Typography variant="h5" component="div">
              {name}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ p: '0.2rem 0rem' }}
              alignItems="center"
            >
              {towns.length > 0 ? (
                <>
                  {towns.slice(0, 2).map((town) => (
                    <Chip label={town} key={town} />
                  ))}
                  <Typography>
                    {towns.length > 2 ? `+${towns.length - 2}` : ''}
                  </Typography>
                </>
              ) : (
                <Chip label="Any Location" />
              )}
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{ p: '0.2rem 0rem' }}
              alignItems="center"
            >
              {flatTypes.length > 0 ? (
                <>
                  {flatTypes.slice(0, 3).map((flatType) => (
                    <Chip
                      label={flatType}
                      size="small"
                      variant="outlined"
                      key={flatType}
                    />
                  ))}
                  <Typography>
                    {flatTypes.length > 3 ? `+${flatTypes.length - 3}` : ''}
                  </Typography>
                </>
              ) : (
                <Chip label="Any Flat Type" size="small" variant="outlined" />
              )}
            </Stack>
            {minStorey && maxStorey && (
              <Typography variant="body2">
                {`Storey: ${minStorey} to ${maxStorey}`}
              </Typography>
            )}
            {minFloorArea && maxFloorArea && (
              <Typography variant="body2">
                {`Floor Area: ${minFloorArea} to ${maxFloorArea} sqm`}
              </Typography>
            )}
            {minLeasePeriod && maxLeasePeriod && (
              <Typography variant="body2">
                {`Remaining Lease: ${minLeasePeriod} to ${maxLeasePeriod} years`}
              </Typography>
            )}
            {startYear && endYear && (
              <Typography variant="body2">
                {`Year of Sale: ${startYear} to ${endYear}`}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
      <Modal open={showUpdateForm} onClose={() => setShowUpdateForm(false)}>
        <FormPaper>
          <GroupForm
            onSubmit={handleUpdateGroup}
            handleClose={() => setShowUpdateForm(false)}
            submitText="Edit Group"
            currentData={mapFiltersToFormValues(filters)}
            resetOnCancel
            onDelete={handleDeleteGroup}
          />
        </FormPaper>
      </Modal>
    </>
  );
};

export default GroupCard;
