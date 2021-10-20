import { Grid, Typography } from '@mui/material';
import { Group } from '../../types/groups';

interface Props {
  group: Group;
}

interface GroupDetailProps {
  label: string;
  detail: string;
}

const GroupAdditionalFilter = (props: GroupDetailProps) => {
  const { label, detail } = props;

  return (
    <Grid item container direction="row" spacing={2}>
      <Grid item xs={5}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body2">{detail}</Typography>
      </Grid>
    </Grid>
  );
};

const GroupAdditionalFilters = (props: Props) => {
  const { group } = props;
  const { type, filters } = group;
  const {
    minStorey,
    maxStorey,
    minFloorArea,
    maxFloorArea,
    minLeasePeriod,
    maxLeasePeriod,
    startYear,
    endYear,
  } = filters;

  return (
    <Grid container direction="column">
      {minStorey && maxStorey && (
        <GroupAdditionalFilter
          label="Storey"
          detail={`${minStorey} to ${maxStorey}`}
        />
      )}
      {minFloorArea && maxFloorArea && (
        <GroupAdditionalFilter
          label="Floor Area"
          detail={`${minFloorArea} to ${maxFloorArea} sqm`}
        />
      )}
      {minLeasePeriod && maxLeasePeriod && (
        <GroupAdditionalFilter
          label="Remaining Lease"
          detail={`${minLeasePeriod} to ${maxLeasePeriod} years`}
        />
      )}
      {startYear && endYear && (
        <GroupAdditionalFilter
          label={type === 'resale' ? 'Year of Sale' : 'Year of Launch'}
          detail={`${startYear} to ${endYear}`}
        />
      )}
    </Grid>
  );
};

export default GroupAdditionalFilters;
