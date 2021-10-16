import { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { Box, Container, Paper } from '@mui/material';
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

// some styling
// export type FormValues = {
//   maritalStatus: string;
//   nationality: string;
// };

const defaultValues = {
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
      age: yup.boolean().required(),
      workingAtLeastAYear: yup.boolean().required(),
      monthlyIncome: yup.number().required(),
    }),
    yup.object({
      housingType: yup.string().required(),
      lease: yup.boolean().required(),
      flatSize: yup.string().required(),
    }),
  ];

  const currentValidationSchema =
    validationSchema[activeStep < 2 ? activeStep : 0];
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

  return (
    <Container>
      <Paper elevation={1}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div style={{ minHeight: '50%' }}>
          {activeStep === steps.length ? (
            <>
              <Button onClick={handleReset}>Reset</Button>
            </>
          ) : (
            <FormProvider {...methods}>
              <form>
                <div>
                  {getStepContent(
                    activeStep,
                    methods as UseFormReturn<FieldValues>
                  )}
                </div>
                <Box
                  display="flex"
                  justifyContent="center"
                  style={{ paddingTop: '5vh' }}
                >
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                  </Button>
                  {activeStep < steps.length - 1 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                    >
                      {activeStep < steps.length - 2 ? 'Continue' : 'Submit'}
                    </Button>
                  )}
                </Box>
              </form>
            </FormProvider>
          )}
        </div>
      </Paper>
    </Container>
  );
};

export default Grants;
