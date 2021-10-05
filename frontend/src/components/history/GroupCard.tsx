import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { GroupFilters } from '../../types/history';

interface Props {
  name: string;
  filters: GroupFilters;
}

const GroupCard = (props: Props) => {
  const {
    name,
    filters: {
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
    },
  } = props;

  return (
    <Card elevation={2} sx={{ height: '100%' }}>
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
          {towns.slice(0, 2).map((town) => (
            <Chip label={town} />
          ))}
          <Typography>
            {towns.length > 2 ? `+${towns.length - 2}` : ''}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{ p: '0.2rem 0rem' }}
          alignItems="center"
        >
          {flatTypes.slice(0, 3).map((flatType) => (
            <Chip label={flatType} size="small" variant="outlined" />
          ))}
          <Typography>
            {flatTypes.length > 3 ? `+${flatTypes.length - 3}` : ''}
          </Typography>
        </Stack>
        <Typography variant="body2">
          {`Storey: ${minStorey} to ${maxStorey}`}
        </Typography>
        <Typography variant="body2">
          {`Floor Area: ${minFloorArea} to ${maxFloorArea} sqm`}
        </Typography>
        <Typography variant="body2">
          {`Remaining Lease: ${minLeasePeriod} to ${maxLeasePeriod} years`}
        </Typography>
        <Typography variant="body2">
          {`Year of Sale: ${startYear} to ${endYear}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
