import { Grid } from '@mui/material';
import NewTabLink from '../../common/Link';
import { getProximityGrantWebsite } from '../calculation/GrantsWebsite';
import FormRadioInput from '../../forms/FormRadioInput';
import { PNTS_OPTION, UNSURE_OPTION } from './Options';
import StepProps from './StepProps';

const ProximityQuestions = (props: StepProps) => {
  const { form } = props;
  const watchMartialStatus = form.watch('maritalStatus');
  const isCouple = watchMartialStatus === 'couple';

  const receivedProximityBeforeOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
    PNTS_OPTION,
  ];

  const proximityStatusOptions = [
    {
      label: 'Yes, we intend to live together',
      value: 'live together',
    },
    { label: 'Yes, within 4km', value: 'within 4km' },
    { label: 'No', value: 'no' },
    UNSURE_OPTION,
  ];

  return (
    <Grid container item direction="column" spacing={3}>
      <Grid item>
        <FormRadioInput
          label={
            <span>
              Have you {isCouple ? 'or your partner ' : ''} received a
              <NewTabLink
                link={getProximityGrantWebsite()}
                label="proximity grant"
              />{' '}
              before?
            </span>
          }
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
