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

export type GrantsFormValues = {
  maritalStatus: string;
  singleNationality: string;
  coupleNationality: string;
  singleFirstTimer: boolean | '';
  coupleFirstTimer: boolean | '';
  age: boolean | '';
  workingAtLeastAYear: boolean | '';
  monthlyIncome: number | '';

  // housing questions
  housingType: string;
  lease: boolean | '';
  flatSize: string;
};

const defaultValues: GrantsFormValues = {
  // user questions
  maritalStatus: '',
  singleNationality: '',
  coupleNationality: '',
  singleFirstTimer: '',
  coupleFirstTimer: '',
  age: '',
  workingAtLeastAYear: '',
  monthlyIncome: '',

  // housing questions
  housingType: '',
  lease: '',
  flatSize: '',
};

function getStepContent(step: number, form: UseFormReturn<FieldValues>) {
  switch (step) {
    case 0:
      return <UserQuestions form={form} />;
    case 1:
      return <HousingQuestions form={form} />;
    case 4:
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
    'Miscellaneous',
    'Proximity',
    'Grant Calculation',
  ];

  // TODO fill in validation messages

  const validationSchema = [
    yup.object({
      maritalStatus: yup.string().required(),
      singleNationality: yup.string().required(),
      // add to ensure couple attributes are required if martial status is sth
      singleFirstTimer: yup.boolean().required(),
      age: yup.boolean().when('maritalStatus', {
        is: 'Single',
        then: yup.boolean().required('Must indicate age'),
      }),
      workingAtLeastAYear: yup.boolean().required(),
      monthlyIncome: yup.number().required(),
    }),
    yup.object({
      housingType: yup.string().required(),
      lease: yup.boolean().required(),
      flatSize: yup.string().required(),
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
              Check your eligibility for the Enhanced CPF Housing Grant (EHG),
              Family Grant, Proximity Housing Grant (PHG) and Family Grant here.
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
                        idx === 0 ||
                        validationSchema
                          .slice(idx - 1)
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
