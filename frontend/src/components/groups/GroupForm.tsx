import { Button, CircularProgress, Grid, Paper, Stack } from '@mui/material';
import { styled } from '@mui/system';
import { Control, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { GroupColor } from '../../types/groups';
import { FlatType, Town } from '../../types/property';
import FormAutocompleteInput from '../forms/FormAutocompleteInput';
import FormSliderInput from '../forms/FormSliderInput';
import FormSwitchInput from '../forms/FormSwitchInput';
import FormTextInput from '../forms/FormTextInput';

interface Range<T> {
  lower: T;
  upper: T;
}

export interface GroupFormValues {
  name: string;
  towns: Town[];
  flatTypes: FlatType[];
  storeyRange?: Range<number>;
  isStoreyRangeEnabled: boolean;
  floorAreaRange?: Range<number>;
  isFloorAreaRangeEnabled: boolean;
  leasePeriodRange?: Range<number>;
  isLeasePeriodRangeEnabled: boolean;
  yearRange?: Range<number>;
  isYearRangeEnabled: boolean;
}

export const FormPaper = styled(Paper)({
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  width: '75%',
  transform: 'translate(-50%, -50%)',
  padding: '1rem',
});

interface Props {
  onSubmit: SubmitHandler<GroupFormValues>;
  handleClose: () => void;
  submitText?: string;
  currentData?: GroupFormValues;
  resetOnCancel?: boolean;
  onDelete?: () => void;
}

const defaultFormValues: GroupFormValues = {
  name: '',
  towns: [],
  flatTypes: [],
  isStoreyRangeEnabled: false,
  isFloorAreaRangeEnabled: false,
  isLeasePeriodRangeEnabled: false,
  isYearRangeEnabled: false,
};

const GroupForm = (props: Props) => {
  const {
    onSubmit,
    handleClose,
    submitText,
    currentData,
    resetOnCancel,
    onDelete,
  } = props;
  const {
    formState: { isSubmitting },
    watch,
    handleSubmit,
    reset,
    setValue,
    control,
  } = useForm<GroupFormValues>({
    defaultValues: currentData || defaultFormValues,
  });
  const watchStoreyRangeEnabled = watch('isStoreyRangeEnabled');
  const watchFloorAreaRangeEnabled = watch('isFloorAreaRangeEnabled');
  const watchLeasePeriodRangeEnabled = watch('isLeasePeriodRangeEnabled');
  const watchYearRangeEnabled = watch('isYearRangeEnabled');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormTextInput
            name="name"
            control={control as Control<FieldValues>}
            label="Group Name"
            placeholder="Group 1"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <FormAutocompleteInput
            name="towns"
            control={control as Control<FieldValues>}
            options={Object.values(Town)}
            disabled={isSubmitting}
            label="Locations"
            placeholder="Enter a town name"
            limitTags={2}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <FormAutocompleteInput
            name="flatTypes"
            control={control as Control<FieldValues>}
            options={Object.values(FlatType)}
            disabled={isSubmitting}
            label="Flat Types"
            placeholder="Enter a flat type"
            limitTags={3}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <FormSwitchInput
            name="isStoreyRangeEnabled"
            control={control as Control<FieldValues>}
            disabled={isSubmitting}
            label="Storey"
          />
          <FormSliderInput
            name="storeyRange"
            control={control as Control<FieldValues>}
            setValue={setValue}
            min={1}
            max={61}
            step={3}
            marks
            inputFields
            disabled={!watchStoreyRangeEnabled || isSubmitting}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <FormSwitchInput
            name="isFloorAreaRangeEnabled"
            control={control as Control<FieldValues>}
            disabled={isSubmitting}
            label="Floor Area (sqm)"
          />
          <FormSliderInput
            name="floorAreaRange"
            control={control as Control<FieldValues>}
            setValue={setValue}
            min={1}
            max={200}
            inputFields
            disabled={!watchFloorAreaRangeEnabled || isSubmitting}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <FormSwitchInput
            name="isLeasePeriodRangeEnabled"
            control={control as Control<FieldValues>}
            disabled={isSubmitting}
            label="Remaining Lease Period (years)"
          />
          <FormSliderInput
            name="leasePeriodRange"
            control={control as Control<FieldValues>}
            setValue={setValue}
            min={1}
            max={99}
            inputFields
            disabled={!watchLeasePeriodRangeEnabled || isSubmitting}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <FormSwitchInput
            name="isYearRangeEnabled"
            control={control as Control<FieldValues>}
            disabled={isSubmitting}
            label="Year of Sale"
          />
          <FormSliderInput
            name="yearRange"
            control={control as Control<FieldValues>}
            setValue={setValue}
            min={1990}
            max={new Date().getFullYear()}
            marks={[
              {
                value: 1990,
                label: '1990',
              },
              {
                value: 2000,
                label: '2000',
              },
              {
                value: 2010,
                label: '2010',
              },
              {
                value: 2020,
                label: '2020',
              },
            ]}
            disabled={!watchYearRangeEnabled || isSubmitting}
          />
        </Grid>
        <Grid item container xs={12} justifyContent="space-between">
          <Grid item>
            <Stack direction="row" spacing={1}>
              {onDelete && (
                <Button
                  variant="contained"
                  type="button"
                  onClick={() => {
                    onDelete();
                    handleClose();
                  }}
                  color="error"
                >
                  {isSubmitting ? <CircularProgress /> : 'Delete Group'}
                </Button>
              )}
              <Button
                variant="outlined"
                type="button"
                onClick={() => reset(defaultFormValues)}
                color="error"
              >
                {isSubmitting ? <CircularProgress /> : 'Clear All'}
              </Button>
            </Stack>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                type="button"
                onClick={() => {
                  if (resetOnCancel) {
                    reset(currentData || defaultFormValues);
                  }
                  handleClose();
                }}
              >
                {isSubmitting ? <CircularProgress /> : 'Cancel'}
              </Button>
              <Button variant="contained" type="submit">
                {isSubmitting ? <CircularProgress /> : submitText ?? 'Submit'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

GroupForm.defaultProps = {
  submitText: 'Submit',
  currentData: undefined,
  resetOnCancel: false,
  onDelete: undefined,
};

export default GroupForm;
