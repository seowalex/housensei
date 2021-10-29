import { Grid } from '@mui/material';
import FormRadioInput from '../../forms/FormRadioInput';
import FormNumberTextFieldInput from '../../forms/FormNumberTextFieldInput';
import StepProps from './StepProps';
import { PNTS } from './Options';

const UserQuestions = (props: StepProps) => {
  const { form } = props;
  const watchMartialStatus = form.watch('maritalStatus');
  const isCouple = watchMartialStatus === 'couple';

  const watchOwnNationality = form.watch('ownNationality');
  const isOwnForeigner = watchOwnNationality === 'F';
  const watchPartnerNationality = form.watch('partnerNationality');
  const isPartnerForeigner = watchPartnerNationality === 'F';

  const maritalStatusOptions = [
    { label: 'Single', value: 'single' },
    { label: 'Couple', value: 'couple' },
    PNTS,
  ];

  const nationalityOptions = [
    { label: 'Singaporean', value: 'SC' },
    { label: 'PR', value: 'PR' },
    { label: 'Foreigner', value: 'F' },
    PNTS,
  ];

  const firstTimerOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  const ageOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
    PNTS,
  ];

  const workingAtLeastAYearOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
    PNTS,
  ];

  return (
    <Grid container item direction="column" spacing={3}>
      <Grid item>
        <FormRadioInput
          label="Are you purchasing as a single or a couple?"
          name="maritalStatus"
          form={form}
          options={maritalStatusOptions}
          required
        />
      </Grid>

      <Grid container item direction="row" spacing={5}>
        <Grid item>
          <FormRadioInput
            label="What is your nationality?"
            name="ownNationality"
            form={form}
            options={nationalityOptions}
            required
          />
        </Grid>

        {isCouple && (
          <Grid item>
            <FormRadioInput
              label="What is your partner's nationality?"
              name="partnerNationality"
              form={form}
              options={nationalityOptions}
              required
            />
          </Grid>
        )}
      </Grid>

      <Grid container item direction="row" spacing={5}>
        {!isOwnForeigner && (
          <Grid item>
            <FormRadioInput
              label="Are you a first time buyer?"
              name="ownFirstTimer"
              form={form}
              options={firstTimerOptions}
              required
            />
          </Grid>
        )}

        {isCouple && !isPartnerForeigner && (
          <Grid item>
            <FormRadioInput
              label="Is your partner a first time buyer?"
              name="partnerFirstTimer"
              form={form}
              options={firstTimerOptions}
              required
            />
          </Grid>
        )}
      </Grid>

      {!isCouple && (
        <Grid item>
          <FormRadioInput
            label="Are you more than 35 years old?"
            name="age"
            form={form}
            options={ageOptions}
            required
          />
        </Grid>
      )}

      <Grid item>
        <FormRadioInput
          label={`Have you ${
            isCouple ? 'or your partner ' : ''
          }been working for at least a year?`}
          name="workingAtLeastAYear"
          form={form}
          options={workingAtLeastAYearOptions}
          required
        />
      </Grid>

      <Grid item>
        <FormNumberTextFieldInput
          label="What is your monthly household income?"
          name="monthlyIncome"
          form={form}
        />
      </Grid>
    </Grid>
  );
};

export default UserQuestions;
