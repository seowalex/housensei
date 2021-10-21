import { Grid, Typography } from '@mui/material';
import { UseFormGetValues, FieldValues } from 'react-hook-form';
import {
  getEHGGrant,
  getFamilyGrant,
  getHalfHousingGrant,
  getProximityGrant,
  getSingleEHGGrant,
  getSingleGrant,
} from '../calculation/GrantCalculation';
import {
  getEHGGrantWebsite,
  getFamilyGrantWebsite,
  getHalfHousingGrantWebsite,
  getProximityGrantWebsite,
  getSingleEHGGrantWebsite,
  getSingleGrantWebsite,
} from '../calculation/GrantsWebsite';
import GrantCard from './GrantCard';

interface Props {
  formValues: UseFormGetValues<FieldValues>;
}

const GrantsResult = (props: Props) => {
  const { formValues } = props;

  const values = formValues();

  const sortAndJoinByDefinedOrder = (
    definedOrder: Array<string>,
    arr: Array<string>
  ) => {
    arr.sort((a, b) => definedOrder.indexOf(a) - definedOrder.indexOf(b));

    return arr.join('/');
  };

  Object.keys(values).forEach((field) => {
    if (values[field] === 'NA') {
      values[field] = '';
    }
  });

  const fieldValues = {
    ...values,
    singleNationality: values.ownNationality,
    coupleNationality: sortAndJoinByDefinedOrder(
      ['SC', 'PR', 'F', ''],
      [values.ownNationality, values.partnerNationality]
    ),
    singleFirstTimer: values.ownFirstTimer,
    coupleFirstTimer: sortAndJoinByDefinedOrder(
      ['true', 'false', ''],
      [values.ownFirstTimer, values.partnerFirstTimer]
    ),
  };

  console.log(fieldValues);

  const ehgGrant = getEHGGrant(fieldValues);
  const familyGrant = getFamilyGrant(fieldValues);
  const halfHousingGrant = getHalfHousingGrant(fieldValues);
  const proximityGrant = getProximityGrant(fieldValues);
  const singleEhgGrant = getSingleEHGGrant(fieldValues);
  const singleGrant = getSingleGrant(fieldValues);

  const allGrants = [
    ehgGrant,
    familyGrant,
    halfHousingGrant,
    proximityGrant,
    singleEhgGrant,
    singleGrant,
  ].filter((grant) => grant.min && grant.max);
  const minTotalGrant = allGrants
    .map((grant) => grant.min)
    .reduce((a, b) => Number(a) + Number(b), 0);
  const maxTotalGrant = allGrants
    .map((grant) => grant.max)
    .reduce((a, b) => Number(a) + Number(b), 0);

  const ehgGrantWebsite = getEHGGrantWebsite(fieldValues);
  const familyGrantWebsite = getFamilyGrantWebsite(fieldValues);
  const halfHousingGrantWebsite = getHalfHousingGrantWebsite(fieldValues);
  const proximityGrantWebsite = getProximityGrantWebsite(fieldValues);
  const singleEhgGrantWebsite = getSingleEHGGrantWebsite(fieldValues);
  const singleGrantWebsite = getSingleGrantWebsite(fieldValues);

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant="h4">
          Estimated Total Grant: $
          {minTotalGrant === maxTotalGrant
            ? minTotalGrant
            : `${minTotalGrant} - $${maxTotalGrant}`}
        </Typography>
      </Grid>
      {ehgGrant.max > 0 && (
        <Grid item xs={6}>
          <GrantCard
            grantName="Enhanced CPF Housing Grant (EHG)"
            description="The Enhanced CPF Housing Grant is a catch-all HDB grant that is meant to help all local lower- to middle-class couples afford a home. It’s applicable to all HDB BTO and HDB resale flats and there is no restriction on flat size or estate."
            grantRange={ehgGrant}
            linkToHDB={ehgGrantWebsite}
          />
        </Grid>
      )}
      {singleEhgGrant.max > 0 && (
        <Grid item xs={6}>
          <GrantCard
            grantName="Enhanced CPF Housing Grant (EHG Single)"
            description="Single Singaporeans looking to buy their own HDB flats can now benefit from higher income ceilings and Enhanced CPF Housing Grants (EHG)."
            grantRange={singleEhgGrant}
            linkToHDB={singleEhgGrantWebsite}
          />
        </Grid>
      )}
      {familyGrant.min && familyGrant.max && (
        <Grid item xs={6}>
          <GrantCard
            grantName="Family Grant"
            description="Buying an HDB resale flat tends to be more expensive than a BTO, but first-time HDB applicants get a significant one-off Family Grant as a “discount”. You can stack the Family Grant together with the EHG (above) to make HDB resale flats a lot more affordable."
            grantRange={familyGrant as any}
            linkToHDB={familyGrantWebsite}
          />
        </Grid>
      )}
      {halfHousingGrant.max && halfHousingGrant.min && (
        <Grid item xs={6}>
          <GrantCard
            grantName="Half Housing Grant"
            description="This is for SC/SC applicants whose spouse/spouse-to-be had previously received a housing subsidy. Half-Housing Grant’s amount is half of the Family Grant that you and your spouse/ spouse-to-be would qualify for if both of you were first-timer applicants"
            grantRange={halfHousingGrant as any}
            linkToHDB={halfHousingGrantWebsite}
          />
        </Grid>
      )}
      {proximityGrant.max && proximityGrant.min && (
        <Grid item xs={6}>
          <GrantCard
            grantName="Proximity Housing Grant (PHG)"
            description="The PHG is a CPF housing grant of up to S$30,000, and it's for buying resale flats only. Two types of buyers can benefit: those who want to live WITH their parents/children in a HDB resale flat, and those who want to buy a HDB resale flat NEAR their parents/children."
            grantRange={proximityGrant as any}
            linkToHDB={proximityGrantWebsite}
          />
        </Grid>
      )}
      {singleGrant.max && singleGrant.min && (
        <Grid item xs={6}>
          <GrantCard
            grantName="Single Grant"
            description="Single Singaporeans looking to buy their own HDB flats can benefit from higher income ceilings and the Single grant."
            grantRange={singleGrant as any}
            linkToHDB={singleGrantWebsite}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default GrantsResult;
