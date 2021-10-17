import { Grid } from '@mui/material';
import FormRadioInput from './FormRadioInput';
import StepProps from './StepProps';

const UserQuestions = (props: StepProps) => {
  const { form } = props;
  const watchMartialStatus = form.watch('maritalStatus');
  const isCouple = watchMartialStatus === 'Couple';

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
  let possibleIncomes = [...Array(16).keys()].map((num) => num * 500 + 1500); // gives [1.5k, 2k 2.5k ... 9k]
  possibleIncomes = possibleIncomes.concat([10000, 11000, 12000, 14000, 21000]);

  const monthlyIncomeOptions = possibleIncomes.map((income, idx) => ({
    label: `$${income} to $${possibleIncomes[idx + 1]}`,
    value: income,
  }));

  monthlyIncomeOptions.unshift({ label: 'Not more than $1500', value: 0 });
  monthlyIncomeOptions[monthlyIncomeOptions.length - 1].label =
    'More than $21000';

  return (
    <Grid container item direction="column" spacing={3}>
      <Grid item>
        <FormRadioInput
          label="Are you purchasing as a single or a couple?"
          name="maritalStatus"
          form={form}
          options={[
            { label: 'Single', value: 'Single' },
            { label: 'Couple', value: 'Couple' },
          ]}
        />
      </Grid>

      <Grid container item direction="row" spacing={5}>
        <Grid item>
          <FormRadioInput
            label="What is your nationality?"
            name="singleNationality"
            form={form}
            options={nationalityOptions}
          />
        </Grid>

        {isCouple && (
          <Grid item>
            <FormRadioInput
              label="What is your partner's nationality?"
              name="coupleNationality"
              form={form}
              options={nationalityOptions}
            />
          </Grid>
        )}
      </Grid>

      <Grid container item direction="row" spacing={5}>
        <Grid item>
          <FormRadioInput
            label="Are you a first time buyer?"
            name="singleFirstTimer"
            form={form}
            options={firstTimerOptions}
          />
        </Grid>

        {isCouple && (
          <Grid item>
            <FormRadioInput
              label="Is your partner a first time buyer?"
              name="coupleFirstTimer"
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
        <FormRadioInput
          label="What is your monthly income?"
          name="monthlyIncome"
          form={form}
          options={monthlyIncomeOptions}
        />
      </Grid>
    </Grid>
  );
};

export default UserQuestions;
