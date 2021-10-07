import { Chip, Stack, Typography } from '@mui/material';
import { GroupFilters } from '../../types/groups';

interface Props {
  filters: GroupFilters;
}

const GroupDetails = (props: Props) => {
  const { filters } = props;
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

  return (
    <>
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
    </>
  );
};

export default GroupDetails;
