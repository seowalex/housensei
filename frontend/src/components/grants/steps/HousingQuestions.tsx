import { Grid } from '@mui/material';
import { FlatType } from '../../../types/groups';
import FormRadioInput from '../../forms/FormRadioInput';
import { UNSURE } from './Options';
import StepProps from './StepProps';

const HousingQuestions = (props: StepProps) => {
  const { form } = props;
  const watchMartialStatus = form.watch('maritalStatus');
  const isCouple = watchMartialStatus === 'couple';
  const watchHousingType = form.watch('housingType');
  const isResale = watchHousingType === 'Resale';

  const housingTypeOptions = [
    { label: 'BTO', value: 'BTO' },
    { label: 'Resale', value: 'Resale' },
  ];

  if (isCouple) {
    housingTypeOptions.push({ label: 'Executive Condominium', value: 'EC' });
  }

  housingTypeOptions.push(UNSURE);

  const leaseOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
    UNSURE,
  ];

  // Helper
  function ToArray(enumme: Record<string, string>) {
    return Object.keys(enumme).map((key) => ({
      label: enumme[key],
      value: enumme[key],
    }));
  }
  const flatSizeOptions = ToArray(FlatType);
  flatSizeOptions.push(UNSURE);

  const livingWithExtendedFamilyOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
    UNSURE,
  ];

  return (
    <Grid container item direction="column" spacing={3}>
      <Grid item>
        <FormRadioInput
          label="What is the housing type that you are intending to purchase?"
          name="housingType"
          form={form}
          options={housingTypeOptions}
          required
        />
      </Grid>

      {isResale && (
        <>
          <Grid item>
            <FormRadioInput
              label="Is the lease of the house that you are intending to purchase more than 20 years old?"
              name="lease"
              form={form}
              options={leaseOptions}
            />
          </Grid>

          <Grid item>
            <FormRadioInput
              label="What is the flat size that you are intending to purchase?"
              name="flatSize"
              form={form}
              options={flatSizeOptions}
              required
            />
          </Grid>
        </>
      )}

      {isResale && isCouple && (
        <Grid item>
          <FormRadioInput
            label={`Are you intending to live with your ${
              isCouple ? "or your partner's " : ''
            }extended family?`}
            name="livingWithExtendedFamily"
            form={form}
            options={livingWithExtendedFamilyOptions}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default HousingQuestions;
