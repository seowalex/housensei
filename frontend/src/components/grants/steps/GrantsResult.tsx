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
  getEHGGrantWebsite,
  getFamilyGrantWebsite,
  getHalfHousingGrantWebsite,
  getProximityGrantWebsite,
  getSingleEHGGrantWebsite,
  getSingleGrantWebsite,
} from '../calculation/GrantsWebsite';
import { parseFormValues } from '../calculation/GrantTreeRecursion';
import {
  displayGrantRange,
  getTotalGrant,
} from '../calculation/GrantsDisplayHelper';
import GrantCard from './GrantCard';
import SadGhost from '../../common/SadGhost';

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
      <Grid item xs={12} justifyContent="center" display="flex">
        <Typography variant="h4">
          Estimated Total Grant: <b>{displayGrantRange(totalGrantRange)}</b>
        </Typography>
      </Grid>
      {totalGrantRange.max === 0 && (
        <Grid
          container
          item
          xs={12}
          justifyContent="center"
          display="flex"
          spacing={5}
        >
          <Grid item xs={12} justifyContent="center" display="flex">
            <SadGhost />
          </Grid>
          <Grid item xs={12} justifyContent="center" display="flex">
            <Typography variant="h5">
              Sorry, no grants are applicable.
            </Typography>
          </Grid>
        </Grid>
      )}
      {shouldDisplayGrant(ehgGrant) && (
        <Grid item xs={6} sx={{ display: 'flex' }}>
          <GrantCard
            grantName="Enhanced CPF Housing Grant (EHG)"
            description={`The EHG is a catch-all HDB grant that is worth up to S$80,000, and it's to help all local lower- to middle-class couples afford a home. It’s applicable to all BTO and resale flats and there is no restriction on flat size or estate.`}
            grantRange={ehgGrant}
            linkToHDB={ehgGrantWebsite}
          />
        </Grid>
      )}
      {shouldDisplayGrant(singleEhgGrant) && (
        <Grid item xs={6} sx={{ display: 'flex' }}>
          <GrantCard
            grantName="Enhanced CPF Housing Grant (EHG Single)"
            description={`The EHG Single is worth up to S$$40,000, and it's to help all local lower- to middle-class singles or mixed-nationality couples afford a home.`}
            grantRange={singleEhgGrant}
            linkToHDB={singleEhgGrantWebsite}
          />
        </Grid>
      )}
      {shouldDisplayGrant(familyGrant) && (
        <Grid item xs={6} sx={{ display: 'flex' }}>
          <GrantCard
            grantName="Family Grant"
            description={`The Family Grant is worth up to S$50,000, and it's to help first-time HDB applicants purchase a resale or EC.`}
            grantRange={familyGrant as GrantRange}
            linkToHDB={familyGrantWebsite}
          />
        </Grid>
      )}
      {shouldDisplayGrant(halfHousingGrant) && (
        <Grid item xs={6} sx={{ display: 'flex' }}>
          <GrantCard
            grantName="Half Housing Grant"
            description={`The Half Housing Grant is worth up to S$25,000, and it's to help SC/SC applicants whose spouse/spouse-to-be had previously received a housing subsidy. Half-Housing Grant’s amount is half of the Family Grant that you and your spouse/spouse-to-be would qualify for if both of you were first-timer applicants.`}
            grantRange={halfHousingGrant as GrantRange}
            linkToHDB={halfHousingGrantWebsite}
          />
        </Grid>
      )}
      {shouldDisplayGrant(proximityGrant) && (
        <Grid item xs={6} sx={{ display: 'flex' }}>
          <GrantCard
            grantName="Proximity Housing Grant (PHG)"
            description={`The PHG is worth up to S$30,000, and it's for buying resale flats only. It's for those who want to live with or near their parents/children in a resale flat.`}
            grantRange={proximityGrant as GrantRange}
            linkToHDB={proximityGrantWebsite}
          />
        </Grid>
      )}
      {shouldDisplayGrant(singleGrant) && (
        <Grid item xs={6} sx={{ display: 'flex' }}>
          <GrantCard
            grantName="Singles Grant"
            description={`The Singles Grant is worth up to S$25,000, and it's for buying resale flats only.`}
            grantRange={singleGrant as GrantRange}
            linkToHDB={singleGrantWebsite}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default GrantsResult;
