import { Grid } from '@mui/material';
import FormRadioInput from './FormRadioInput';
import FormSelectInput from './FormSelectInput';
import StepProps from './StepProps';

const UserQuestions = (props: StepProps) => {
  const { form } = props;
  const watchMartialStatus = form.watch('maritalStatus');
  const isCouple = watchMartialStatus === 'Couple';

  const watchOwnNationality = form.watch('ownNationality');
  const isOwnForeigner = watchOwnNationality === 'F';
  const watchPartnerNationality = form.watch('partnerNationality');
  const isPartnerForeigner = watchPartnerNationality === 'F';

  const maritalStatusOptions = [
    { label: 'Single', value: 'single' },
    { label: 'Couple', value: 'couple' },
  ];

  const nationalityOptions = [
    { label: 'Singaporean', value: 'SC' },
    { label: 'PR', value: 'PR' },
    { label: 'Foreigner', value: 'F' },
  ];

  const firstTimerOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  const ageOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  const workingAtLeastAYearOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  // const income = [1500, 2000, ..., 9000, 10k, 11k, 12k, 14k, 21k]
  let possibleIncomes = [...Array(16).keys()].map((num) => num * 250 + 750); // gives [750, ..., 4250, 4500]
  possibleIncomes = possibleIncomes.concat(
    [...Array(8).keys()].map((num) => num * 500 + 5000)
  ); // gives [5000, 5500, ..., 8.5k, 9k]
  possibleIncomes = possibleIncomes.concat([
    9000, 10000, 11000, 12000, 14000, 21000,
  ]);

  const monthlyIncomeOptions = possibleIncomes.map((income, idx) => ({
    label: `$${income + 1} to $${possibleIncomes[idx + 1]}`,
    value: income,
  }));

  monthlyIncomeOptions.unshift({ label: 'Not more than $750', value: 0 });
  monthlyIncomeOptions[monthlyIncomeOptions.length - 1].label =
    'More than $21000';

  return (
    <Grid container item direction="column" spacing={3}>
      <Grid item>
        <FormRadioInput
          label="Are you purchasing as a single or a couple?"
          name="maritalStatus"
          form={form}
          options={maritalStatusOptions}
        />
      </Grid>

      <Grid container item direction="row" spacing={5}>
        <Grid item>
          <FormRadioInput
            label="What is your nationality?"
            name="ownNationality"
            form={form}
            options={nationalityOptions}
          />
        </Grid>

        {isCouple && (
          <Grid item>
            <FormRadioInput
              label="What is your partner's nationality?"
              name="partnerNationality"
              form={form}
              options={nationalityOptions}
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
          />
        </Grid>
      )}

      <Grid item>
        <FormRadioInput
          label="Have you been workng for at least a year?"
          name="workingAtLeastAYear"
          form={form}
          options={workingAtLeastAYearOptions}
        />
      </Grid>

      <Grid item>
        <FormSelectInput
          label="What is your monthly household income?"
          name="monthlyIncome"
          form={form}
          options={monthlyIncomeOptions}
        />
      </Grid>
    </Grid>
  );
};

export default UserQuestions;
