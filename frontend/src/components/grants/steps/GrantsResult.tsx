import { Grid, Typography } from '@mui/material';
import { UseFormGetValues, FieldValues } from 'react-hook-form';
import {
  getEHGGrant,
  getFamilyGrant,
  getHalfHousingGrant,
  getProximityGrant,
  getSingleEHGGrant,
} from '../calculation/GrantCalculation';
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

  const allGrants = [
    ehgGrant,
    familyGrant,
    halfHousingGrant,
    proximityGrant,
    singleEhgGrant,
  ].filter((grant) => grant.min && grant.max);
  const minTotalGrant = allGrants
    .map((grant) => grant.min)
    .reduce((a, b) => Number(a) + Number(b), 0);
  const maxTotalGrant = allGrants
    .map((grant) => grant.max)
    .reduce((a, b) => Number(a) + Number(b), 0);

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
            description=""
            grantRange={ehgGrant}
            linkToHDB="//hdb.gov.sg/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-hdb-flats/firsttimer-applicants"
          />
        </Grid>
      )}
      {singleEhgGrant.max > 0 && (
        <Grid item xs={6}>
          <GrantCard
            grantName="Enhanced CPF Housing Grant (EHG Single)"
            description=""
            grantRange={singleEhgGrant}
            linkToHDB="//hdb.gov.sg/residential/buying-a-flat/resale/financing/cpf-housing-grants/single-singapore-citizen-scheme"
          />
        </Grid>
      )}
      {familyGrant.min && familyGrant.max && (
        <Grid item xs={6}>
          <GrantCard
            grantName="Family Grant"
            description=""
            grantRange={familyGrant as any}
            linkToHDB="//hdb.gov.sg/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-hdb-flats/firsttimer-applicants"
          />
        </Grid>
      )}
      {halfHousingGrant.max && halfHousingGrant.min && (
        <Grid item xs={6}>
          <GrantCard
            grantName="Half Housing Grant"
            description=""
            grantRange={halfHousingGrant as any}
            linkToHDB="//hdb.gov.sg/residential/buying-a-flat/resale/financing/cpf-housing-grants/firsttimer-and-secondtimer-couple-applicants"
          />
        </Grid>
      )}
      {proximityGrant.max && proximityGrant.min && (
        <Grid item xs={6}>
          <GrantCard
            grantName="Proximity Housing Grant (PHG)"
            description=""
            grantRange={proximityGrant as any}
            linkToHDB="//hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/living-with-near-parents-or-child"
          />
        </Grid>
      )}
    </Grid>
  );
};

export default GrantsResult;
