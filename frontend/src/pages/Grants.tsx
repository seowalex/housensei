/* eslint-disable react/no-this-in-sfc */
/* eslint-disable func-names */
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
import UserQuestions from '../components/grants/steps/UserQuestions';
import GrantsResult from '../components/grants/steps/GrantsResult';
import HousingQuestions from '../components/grants/steps/HousingQuestions';
import ProximityQuestions from '../components/grants/steps/ProximityQuestions';
import MiniGrantsResult from '../components/grants/steps/MiniGrantsResult';

export type GrantsFormValues = {
  // user questions
  maritalStatus: 'single' | 'couple' | '';
  ownNationality: 'SC' | 'PR' | 'F' | '';
  partnerNationality: 'SC' | 'PR' | 'F' | '';
  ownFirstTimer: boolean | '';
  partnerFirstTimer: boolean | '';
  age: boolean | '';
  workingAtLeastAYear: boolean | '';
  monthlyIncome: number | '';

  // housing questions
  housingType: 'BTO' | 'Resale' | 'EC' | '';
  lease: boolean | '';
  flatSize:
    | '1 Room'
    | '2 Room'
    | '3 Room'
    | '4 Room'
    | '5 Room'
    | '3Gen'
    | 'Studio'
    | '';
  livingWithExtendedFamily: boolean | '';

  // proximity questions
  receivedProximityBefore: boolean | '';
  proximityStatus: 'within 4km' | 'live together' | 'no' | '';
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
      return <GrantsResult formValues={form.getValues} />;
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
        is: 'couple',
        then: yup.string().required("Must indicate partner's nationality"),
      }),
      ownFirstTimer: yup
        .mixed()
        .test(
          'ownNationality',
          'Must indicate if first time buyer',
          function (item) {
            if (this.parent.ownNationality === 'F') {
              return true;
            }
            return item !== '';
          }
        ),
      partnerFirstTimer: yup
        .mixed()
        .test(
          'partnerNationality and couple',
          'Must indicate whether partner is first time buyer',
          function (item) {
            if (
              this.parent.partnerNationality === 'F' ||
              this.parent.maritalStatus !== 'couple'
            ) {
              return true;
            }
            return item !== '';
          }
        ),
      age: yup.mixed().when('maritalStatus', {
        is: 'single',
        then: notEmptyStrCheck('Must indicate age'),
      }),
      workingAtLeastAYear: notEmptyStrCheck(
        'Must indicate if working for at least a year'
      ),
      monthlyIncome: yup
        .mixed()
        .test('monthlyIncome', 'Cannot be a negative number', (item) => {
          if (item === '') {
            return true;
          }
          return Number(item) > 0;
        }),
    }),
    yup.object({
      housingType: yup.string().required('Must indicate housing type'),
      flatSize: yup.mixed().when('housingType', {
        is: 'Resale',
        then: notEmptyStrCheck('Must indicate resale flat size'),
      }),
    }),
    yup.object({
      receivedProximityBefore: notEmptyStrCheck(
        'Must indicate if received proximity grant before'
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
  const { reset, trigger } = methods;

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    reset();
  };

  const isValidStep = (idx: number) =>
    idx === 0 ||
    validationSchema
      .slice(0, idx)
      .every((validation) => validation.isValidSync(methods.getValues()));

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 2;
  const otherSteps = activeStep < steps.length - 2;

  return (
    <Container sx={{ p: 3 }}>
      <Paper sx={{ p: '1rem' }}>
        <Grid container direction="column" spacing={10} padding={5}>
          <Grid item xs={12}>
            <Typography variant="h2" gutterBottom>
              Grant Calculator
            </Typography>
            <Typography gutterBottom>
              Check your eligibility for the Enhanced CPF Housing Grant (EHG/EHG
              Single), Family Grant, Proximity Housing Grant (PHG) and Half
              Housing Grant here.
            </Typography>
            <Typography gutterBottom>
              All information in this site is provided &apos;as is&apos;, with
              no guarantee of completeness, accuracy or timeliness of the
              results obtained from the use of this information.
            </Typography>
            <Typography gutterBottom>
              Questions that are required (*)
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, idx) => {
                const stepProps = {};
                const labelProps = {};
                const isValidClick = isValidStep(idx);
                return (
                  <Step
                    onClick={() => {
                      if (isValidClick) {
                        setActiveStep(idx);
                      }
                    }}
                    key={label}
                    sx={
                      isValidClick
                        ? {
                            '&:hover': {
                              cursor: 'pointer',
                            },
                          }
                        : null
                    }
                    {...stepProps}
                  >
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Grid>
          {/* button group */}
          <Grid container item>
            <FormProvider {...methods}>
              <Grid container item>
                <form>
                  <Grid container item>
                    <Grid item xs={otherSteps || isLastStep ? 9 : 12}>
                      {getStepContent(
                        activeStep,
                        methods as UseFormReturn<FieldValues>
                      )}
                    </Grid>
                    {(otherSteps || isLastStep) && (
                      <Grid item xs={3}>
                        <MiniGrantsResult
                          form={methods as UseFormReturn<FieldValues>}
                        />
                      </Grid>
                    )}
                    <Grid
                      container
                      item
                      alignItems="center"
                      justifyContent="center"
                      padding={5}
                      spacing={3}
                      xs={12}
                    >
                      <Grid item>
                        <Button
                          disabled={isFirstStep}
                          onClick={handleBack}
                          size="large"
                        >
                          Back
                        </Button>
                      </Grid>

                      <Grid item>
                        {otherSteps || isLastStep ? (
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            size="large"
                          >
                            {!isLastStep ? 'Continue' : 'Finish'}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={handleReset}
                            size="large"
                          >
                            Reset
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </FormProvider>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Grants;
