import {
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material';
import { Group } from '../../types/groups';
import { convertFlatTypeToFrontend } from '../../utils/groups';

interface Props {
  group: Group;
}

interface GroupDetailProps {
  label: string;
  detail: string;
}

const GroupDetail = (props: GroupDetailProps) => {
  const { label, detail } = props;

  return (
    <Grid item container direction="row" spacing={2}>
      <Grid item xs={6}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body2">{detail}</Typography>
      </Grid>
    </Grid>
  );
};

const GroupDetails = (props: Props) => {
  const { group } = props;
  const { name, type, filters } = group;
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
    <Stack spacing={0.5}>
      <Typography variant="h6">{name}</Typography>
      <Grid container direction="column">
        {minStorey && maxStorey && (
          <GroupDetail label="Storey" detail={`${minStorey} to ${maxStorey}`} />
        )}
        {minFloorArea && maxFloorArea && (
          <GroupDetail
            label="Floor Area"
            detail={`${minFloorArea} to ${maxFloorArea} sqm`}
          />
        )}
        {minLeasePeriod && maxLeasePeriod && (
          <GroupDetail
            label="Remaining Lease"
            detail={`${minLeasePeriod} to ${maxLeasePeriod} years`}
          />
        )}
        {startYear && endYear && (
          <GroupDetail
            label={type === 'resale' ? 'Year of Sale' : 'Year of Launch'}
            detail={`${startYear} to ${endYear}`}
          />
        )}
      </Grid>
    </Stack>
  );
};

export default GroupDetails;
