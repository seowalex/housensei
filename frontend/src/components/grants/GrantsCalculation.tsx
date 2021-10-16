import { Grid } from '@mui/material';
import React from 'react';
import { UseFormGetValues, FieldValues } from 'react-hook-form';
import GrantCard from './GrantCard';

interface Props {
  formValues: UseFormGetValues<FieldValues>;
}

const GrantsCalculation = (props: Props) => {
  const { formValues } = props;
  console.log(formValues());
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <GrantCard
          grantName="Enhanced CPF Housing Grant (EHG)"
          description=""
          value={5000}
          linkToHDB=""
        />
      </Grid>
      <Grid item xs={6}>
        <GrantCard
          grantName="Enhanced CPF Housing Grant (EHG)"
          description=""
          value={5000}
          linkToHDB=""
        />
      </Grid>
      <Grid item xs={6}>
        <GrantCard
          grantName="Enhanced CPF Housing Grant (EHG)"
          description=""
          value={5000}
          linkToHDB=""
        />
      </Grid>
      <Grid item xs={6}>
        <GrantCard
          grantName="Enhanced CPF Housing Grant (EHG)"
          description=""
          value={5000}
          linkToHDB=""
        />
      </Grid>
    </Grid>
  );
};

export default GrantsCalculation;
