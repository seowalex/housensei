import { Grid } from '@mui/material';
import FormRadioInput from './FormRadioInput';
import StepProps from './StepProps';

const ProximityQuestions = (props: StepProps) => {
  const { form } = props;
  const watchMartialStatus = form.watch('maritalStatus');
  const isCouple = watchMartialStatus === 'Couple';

  const receivedProximityBeforeOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  const proximityStatusOptions = [
    { label: 'Yes, within 4km', value: 'within 4km' },
    {
      label: 'Yes, we intend to live together',
      value: 'live together',
    },
    { label: 'No', value: 'no' },
  ];

  return (
    <Grid container item direction="column" spacing={3}>
      <Grid item>
        <FormRadioInput
          label={`Have you ${
            isCouple ? 'or your partner ' : ''
          }received a proximity grant before?`}
          name="receivedProximityBefore"
          form={form}
          options={receivedProximityBeforeOptions}
        />
      </Grid>
      <Grid item>
        <FormRadioInput
          label={`Will you be living with or near your parents${
            isCouple ? ', parents-in-law' : ''
          } and/or children?`}
          name="proximityStatus"
          form={form}
          options={proximityStatusOptions}
        />
      </Grid>
    </Grid>
  );
};

export default ProximityQuestions;
