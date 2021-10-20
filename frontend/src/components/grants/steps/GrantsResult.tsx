import { Grid } from '@mui/material';
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

  // TODO is a string, not a bool
  const fieldValues = {
    ...values,
    singleNationality: values.ownNationality,
    coupleNationality: `${values.ownNationality}/${values.partnerNationality}`,
    singleFirstTimer: values.ownFirstTimer,
    coupleFirstTimer: `${values.ownFirstTimer}/${values.partnerFirstTimer}`,
  };

  console.log(fieldValues);

  const ehgGrant = getEHGGrant(fieldValues);
  const proximityGrant = getProximityGrant(fieldValues);
  const familyGrant = getFamilyGrant(fieldValues);
  const halfHousingGrant = getHalfHousingGrant(fieldValues);
  const singleEhgGrant = getSingleEHGGrant(fieldValues);
  console.log(ehgGrant);

  // console.log(formValues());
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <GrantCard
          grantName="Enhanced CPF Housing Grant (EHG/EHG Single)"
          description=""
          value={5000}
          linkToHDB="//hdb.gov.sg/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-hdb-flats/firsttimer-applicants"
        />
      </Grid>
      <Grid item xs={6}>
        <GrantCard
          grantName="Family Grant"
          description=""
          value={5000}
          linkToHDB="//hdb.gov.sg/residential/buying-a-flat/new/schemes-and-grants/cpf-housing-grants-for-hdb-flats/firsttimer-applicants"
        />
      </Grid>
      <Grid item xs={6}>
        <GrantCard
          grantName="Proximity Housing Grant (PHG)"
          description=""
          value={5000}
          linkToHDB="//hdb.gov.sg/cs/infoweb/residential/buying-a-flat/resale/financing/cpf-housing-grants/living-with-near-parents-or-child"
        />
      </Grid>
      <Grid item xs={6}>
        <GrantCard
          grantName="Singles Grant"
          description=""
          value={5000}
          linkToHDB="//hdb.gov.sg/residential/buying-a-flat/resale/financing/cpf-housing-grants/single-singapore-citizen-scheme"
        />
      </Grid>
      <Grid item xs={6}>
        <GrantCard
          grantName="Half Housing Grant"
          description=""
          value={5000}
          linkToHDB="//hdb.gov.sg/residential/buying-a-flat/resale/financing/cpf-housing-grants/firsttimer-and-secondtimer-couple-applicants"
        />
      </Grid>
    </Grid>
  );
};

export default GrantsResult;
