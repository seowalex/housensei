import { Grid } from '@mui/material';
import { FlatType } from '../../types/groups';
import FormRadioInput from './FormRadioInput';
import StepProps from './StepProps';

const HousingQuestions = (props: StepProps) => {
  const { form } = props;

  const housingTypeOptions = [
    { label: 'BTO', value: 'BTO' },
    { label: 'Resale', value: 'Resale' },
    { label: 'Executive Condominium', value: 'EC' },
  ];

  const leaseOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  // Helper
  function ToArray(enumme: Record<string, any>) {
    return Object.keys(enumme).map((key) => ({
      label: enumme[key],
      value: key,
    }));
  }
  const flatSizeOptions = ToArray(FlatType);

  return (
    <Grid container direction="column">
      <FormRadioInput
        label="What is the housing type that you are intending to purchase?"
        name="housingType"
        form={form}
        options={housingTypeOptions}
      />

      <FormRadioInput
        label="Is the lease of the house that you are intending to purchase more than 20 years old?"
        name="lease"
        form={form}
        options={leaseOptions}
      />

      <FormRadioInput
        label="What is the flat size that you are intending to purchase?"
        name="flatSize"
        form={form}
        options={flatSizeOptions}
      />
    </Grid>
  );
};

export default HousingQuestions;
