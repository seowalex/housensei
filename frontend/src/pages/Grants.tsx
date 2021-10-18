import { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { Container, Grid, Paper, Typography } from '@mui/material';
import * as yup from 'yup';
import {
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import UserQuestions from '../components/grants/UserQuestions';
import GrantsCalculation from '../components/grants/GrantsCalculation';
import HousingQuestions from '../components/grants/HousingQuestions';
import ProximityQuestions from '../components/grants/ProximityQuestions';

export type GrantsFormValues = {
  // user questions
  maritalStatus: 'Single' | 'Couple' | '';
  ownNationality: string;
  partnerNationality: string;
  ownFirstTimer: boolean | '';
  partnerFirstTimer: boolean | '';
  age: boolean | '';
  workingAtLeastAYear: boolean | '';
  monthlyIncome: number | '';

  // housing questions
  housingType: string;
  lease: boolean | '';
  flatSize: string;
  livingWithExtendedFamily: boolean | '';

  // proximity questions
  receivedProximityBefore: boolean | '';
  proximityStatus: string;
};

const defaultValues: GrantsFormValues = {
  // user questions
  maritalStatus: '',
  ownNationality: '',
  partnerNationality: '',
  ownFirstTimer: '',
  partnerFirstTimer: '',
  age: '',
  workingAtLeastAYear: '',
  monthlyIncome: '',

  // housing questions
  housingType: '',
  lease: '',
  flatSize: '',
  livingWithExtendedFamily: '',

  // proximity questions
  receivedProximityBefore: '',
  proximityStatus: '',
};

function getStepContent(step: number, form: UseFormReturn<FieldValues>) {
  switch (step) {
    case 0:
      return <UserQuestions form={form} />;
    case 1:
      return <HousingQuestions form={form} />;
    case 2:
      return <ProximityQuestions form={form} />;
    case 3:
      return <GrantsCalculation formValues={form.getValues} />;
    default:
      return 'Unknown step';
  }
}

const Grants = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    'Background of Buyer',
    'Housing',
    'Proximity',
    'Grant Calculation',
  ];

  // TODO can convert all yup.string().required to notEmptyStrCheck

  const notEmptyStrCheck = (message: string) =>
    yup.mixed().notOneOf([''], message);

  const validationSchema = [
    yup.object({
      maritalStatus: yup.string().required('Must indicate marital status'),
      ownNationality: yup.string().required('Must indicate nationality'),
      partnerNationality: yup.mixed().when('maritalStatus', {
        is: 'Couple',
        then: yup.string().required("Must indicate partner's nationality"),
      }),
      ownFirstTimer: notEmptyStrCheck('Must indicate if first time buyer'),
      partnerFirstTimer: yup.mixed().when('maritalStatus', {
        is: 'Couple',
        then: notEmptyStrCheck(
          'Must indicate whether partner is first time buyer'
        ),
      }),
      age: yup.mixed().when('maritalStatus', {
        is: 'Single',
        then: notEmptyStrCheck('Must indicate age'),
      }),
      workingAtLeastAYear: notEmptyStrCheck(
        'Must indicate if working for at least a year'
      ),
      monthlyIncome: notEmptyStrCheck('Must indicate monthly income'),
    }),
    yup.object({
      housingType: yup.string().required('Must indicate housing type'),
      lease: yup.mixed().when('housingType', {
        is: 'Resale',
        then: notEmptyStrCheck('Must indicate resale lease'),
      }),
      flatSize: yup.mixed().when('housingType', {
        is: 'Resale',
        then: notEmptyStrCheck('Must indicate resale flat size'),
      }),
      livingWithExtendedFamily: yup
        .mixed()
        .test(
          'livingWithExtendedFamily',
          'Must indicate if living with extended family',
          function (item) {
            if (
              // eslint-disable-next-line react/no-this-in-sfc
              this.parent.maritalStatus !== 'Couple' ||
              // eslint-disable-next-line react/no-this-in-sfc
              this.parent.housingType !== 'Resale'
            ) {
              return true;
            }
            return item !== '';
          }
        ),
    }),
    yup.object({
      receivedProximityBefore: notEmptyStrCheck(
        'Must indicate if received proximity grant before'
      ),
      proximityStatus: yup
        .string()
        .required(
          'Must indicate intended living proximity with parents or children'
        ),
    }),
  ];

  const currentValidationSchema = validationSchema[activeStep];

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(currentValidationSchema),
    mode: 'onChange',
  });
  const { trigger } = methods;

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container sx={{ p: 3 }}>
      <Paper sx={{ p: '1rem' }}>
        <Grid container direction="column" spacing={10} padding={5}>
          <Grid item>
            <Typography variant="h2">Grant Calculator</Typography>
            <br />
            <Typography>
              Check your eligibility for the Enhanced CPF Housing Grant (EHG/EHG
              Single), Family Grant, Proximity Housing Grant (PHG), Singles
              Grant, Half Housing Grant here.
            </Typography>
          </Grid>
          <Grid item>
            <Stepper activeStep={activeStep}>
              {steps.map((label, idx) => {
                const stepProps = {};
                const labelProps = {};
                return (
                  <Step
                    onClick={() => {
                      // check if pass validation of all steps before
                      if (
                        idx !== 0 &&
                        validationSchema
                          .slice(0, idx)
                          .some(
                            (validation) =>
                              !validation.isValidSync(methods.getValues())
                          )
                      ) {
                        return;
                      }

                      setActiveStep(idx);
                    }}
                    key={label}
                    {...stepProps}
                  >
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Grid>
          {/* button group */}
          <Grid container item direction="column">
            <FormProvider {...methods}>
              <form>
                <Grid container item>
                  {getStepContent(
                    activeStep,
                    methods as UseFormReturn<FieldValues>
                  )}
                </Grid>
                <Grid
                  container
                  item
                  alignItems="center"
                  justifyContent="center"
                  padding={5}
                >
                  <Grid item>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                      Back
                    </Button>
                  </Grid>
                  {activeStep < steps.length - 1 && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                      >
                        {activeStep < steps.length - 2 ? 'Continue' : 'Finish'}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </form>
            </FormProvider>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Grants;
