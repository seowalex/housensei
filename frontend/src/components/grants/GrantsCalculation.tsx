import { Grid } from '@mui/material';
import { UseFormGetValues, FieldValues } from 'react-hook-form';
import GrantCard from './GrantCard';

interface Props {
  formValues: UseFormGetValues<FieldValues>;
}

const GrantsCalculation = (props: Props) => {
  const { formValues } = props;
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

export default GrantsCalculation;
