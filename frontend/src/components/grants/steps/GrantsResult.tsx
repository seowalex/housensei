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
import { GRANT_MAX } from '../calculation/GrantMaxAmount';
import {
  getEHGGrantWebsite,
  getFamilyGrantWebsite,
  getHalfHousingGrantWebsite,
  getProximityGrantWebsite,
  getSingleEHGGrantWebsite,
  getSingleGrantWebsite,
} from '../calculation/GrantsWebsite';
import {
  displayGrantRange,
  getTotalGrant,
  parseFormValues,
} from '../calculation/ParseGrantsForm';
import GrantCard from './GrantCard';

interface Props {
  formValues: UseFormGetValues<FieldValues>;
}

const GrantsResult = (props: Props) => {
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

  const ehgGrantWebsite = getEHGGrantWebsite(fieldValues);
  const familyGrantWebsite = getFamilyGrantWebsite(fieldValues);
  const halfHousingGrantWebsite = getHalfHousingGrantWebsite(fieldValues);
  const proximityGrantWebsite = getProximityGrantWebsite();
  const singleEhgGrantWebsite = getSingleEHGGrantWebsite(fieldValues);
  const singleGrantWebsite = getSingleGrantWebsite(fieldValues);

  const shouldDisplayGrant = (grantRange: {
    min: number | null;
    max: number | null;
  }) => !!(grantRange.max && grantRange.max > 0);

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant="h4">
          Estimated Total Grant: {displayGrantRange(totalGrantRange)}
        </Typography>
      </Grid>
      {shouldDisplayGrant(ehgGrant) && (
        <Grid item xs={6} sx={{ display: 'flex' }}>
          <GrantCard
            grantName="Enhanced CPF Housing Grant (EHG)"
            description={`The EHG is a catch-all HDB grant that is worth up to S$${GRANT_MAX.ehg}, and it's to help all local lower- to middle-class couples afford a home. It’s applicable to all BTO and resale flats and there is no restriction on flat size or estate.`}
            grantRange={ehgGrant}
            linkToHDB={ehgGrantWebsite}
          />
        </Grid>
      )}
      {shouldDisplayGrant(singleEhgGrant) && (
        <Grid item xs={6} sx={{ display: 'flex' }}>
          <GrantCard
            grantName="Enhanced CPF Housing Grant (EHG Single)"
            description={`The EHG Single is worth up to S$${GRANT_MAX.ehgSingle}, and it's to help all local lower- to middle-class singles or mixed-nationality couples afford a home.`}
            grantRange={singleEhgGrant}
            linkToHDB={singleEhgGrantWebsite}
          />
        </Grid>
      )}
      {shouldDisplayGrant(familyGrant) && (
        <Grid item xs={6} sx={{ display: 'flex' }}>
          <GrantCard
            grantName="Family Grant"
            description={`The Family Grant is worth up to S$${GRANT_MAX.family}, and it's to help first-time HDB applicants purchase a resale or EC.`}
            grantRange={familyGrant as GrantRange}
            linkToHDB={familyGrantWebsite}
          />
        </Grid>
      )}
      {shouldDisplayGrant(halfHousingGrant) && (
        <Grid item xs={6} sx={{ display: 'flex' }}>
          <GrantCard
            grantName="Half Housing Grant"
            description={`The Half Housing Grant is worth up to S$${GRANT_MAX.halfHousing}, and it's to help SC/SC applicants whose spouse/spouse-to-be had previously received a housing subsidy. Half-Housing Grant’s amount is half of the Family Grant that you and your spouse/spouse-to-be would qualify for if both of you were first-timer applicants.`}
            grantRange={halfHousingGrant as GrantRange}
            linkToHDB={halfHousingGrantWebsite}
          />
        </Grid>
      )}
      {shouldDisplayGrant(proximityGrant) && (
        <Grid item xs={6} sx={{ display: 'flex' }}>
          <GrantCard
            grantName="Proximity Housing Grant (PHG)"
            description={`The PHG is worth up to S$${GRANT_MAX.proximity}, and it's for buying resale flats only. It's for those who want to live with or near their parents/children in a resale flat.`}
            grantRange={proximityGrant as GrantRange}
            linkToHDB={proximityGrantWebsite}
          />
        </Grid>
      )}
      {shouldDisplayGrant(singleGrant) && (
        <Grid item xs={6} sx={{ display: 'flex' }}>
          <GrantCard
            grantName="Singles Grant"
            description={`The Singles Grant is worth up to S$${GRANT_MAX.singles}, and it's for buying resale flats only.`}
            grantRange={singleGrant as GrantRange}
            linkToHDB={singleGrantWebsite}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default GrantsResult;
