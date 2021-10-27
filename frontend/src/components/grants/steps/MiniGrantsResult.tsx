import { Grid, Typography } from '@mui/material';
import { UseFormGetValues, FieldValues } from 'react-hook-form';
import {
  getEHGGrant,
  getFamilyGrant,
  getHalfHousingGrant,
  getProximityGrant,
  getSingleEHGGrant,
  getSingleGrant,
  GrantRange,
} from '../calculation/GrantCalculation';
import {
  displayRange,
  getTotalGrant,
  parseFormValues,
} from '../calculation/ParseGrantsForm';
import MiniGrantCard from './MiniGrantCard';

interface Props {
  formValues: UseFormGetValues<FieldValues>;
}

const MiniGrantsResult = (props: Props) => {
  const { formValues } = props;

  const values = formValues();
  const fieldValues = parseFormValues(values);

  const ehgGrant = getEHGGrant(fieldValues);
  const familyGrant = getFamilyGrant(fieldValues);
  const halfHousingGrant = getHalfHousingGrant(fieldValues);
  const proximityGrant = getProximityGrant(fieldValues);
  const singleEhgGrant = getSingleEHGGrant(fieldValues);
  const singleGrant = getSingleGrant(fieldValues);

  const totalGrantRange = getTotalGrant([
    ehgGrant,
    familyGrant,
    halfHousingGrant,
    proximityGrant,
    singleEhgGrant,
    singleGrant,
  ]);

  return (
    <Grid container>
      <Typography variant="h6">Grants base on current selection</Typography>
      <Grid item xs={12}>
        <MiniGrantCard grantName="EHG Grant" grantRange={ehgGrant} />
      </Grid>
      <Grid item xs={12}>
        <MiniGrantCard
          grantName="EHG Single Grant"
          grantRange={singleEhgGrant}
        />
      </Grid>
      <Grid item xs={12}>
        <MiniGrantCard
          grantName="Family Grant"
          grantRange={familyGrant as GrantRange}
        />
      </Grid>
      <Grid item xs={12}>
        <MiniGrantCard
          grantName="Half Housing Grant"
          grantRange={halfHousingGrant as GrantRange}
        />
      </Grid>
      <Grid item xs={12}>
        <MiniGrantCard
          grantName="Proximity Housing Grant"
          grantRange={proximityGrant as GrantRange}
        />
      </Grid>
      <Grid item xs={12}>
        <MiniGrantCard
          grantName="Singles Grant"
          grantRange={singleGrant as GrantRange}
        />
      </Grid>
      <Typography variant="h6">
        Total Grant: {displayRange(totalGrantRange)}
      </Typography>
    </Grid>
  );
};

export default MiniGrantsResult;
