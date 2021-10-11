import {
  Button,
  ButtonGroup,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import {
  Control,
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { FlatType } from '../../types/groups';
import { Town } from '../../types/towns';
import { mapTownToRegion } from '../../utils/towns';
import FormAutocompleteInput from '../forms/FormAutocompleteInput';
import FormSliderInput from '../forms/FormSliderInput';
import FormSwitchInput, {
  StaticFormSwitchInput,
} from '../forms/FormSwitchInput';
import FormTextInput from '../forms/FormTextInput';

export interface Range<T> {
  lower: T;
  upper: T;
}

export interface GroupFormValues {
  name: string;
  type: 'resale' | 'bto';
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

interface Props {
  formType: 'create' | 'update';
  onSubmit: SubmitHandler<GroupFormValues>;
  handleClose: () => void;
  currentData?: GroupFormValues;
  groupNamePlaceholder?: string;
}

const defaultFormValues: GroupFormValues = {
  name: '',
  type: 'resale',
  towns: [],
  flatTypes: [],
  isStoreyRangeEnabled: false,
  isFloorAreaRangeEnabled: false,
  isLeasePeriodRangeEnabled: false,
  isYearRangeEnabled: false,
};

const GroupForm = (props: Props) => {
  const { formType, onSubmit, handleClose, currentData, groupNamePlaceholder } =
    props;
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

  const watchType = watch('type');
  const watchStoreyRangeEnabled = watch('isStoreyRangeEnabled');
  const watchFloorAreaRangeEnabled = watch('isFloorAreaRangeEnabled');
  const watchLeasePeriodRangeEnabled = watch('isLeasePeriodRangeEnabled');
  const watchYearRangeEnabled = watch('isYearRangeEnabled');

  const submitText = formType === 'create' ? 'Add Group' : 'Edit Group';

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ p: '0.5rem 0rem' }}>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
              {formType === 'create' ? 'Create Group' : 'Edit Group'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <FormTextInput
            name="name"
            control={control as Control<FieldValues>}
            label="Group Name"
            placeholder={groupNamePlaceholder ?? 'Enter a group name'}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ height: '100%' }}
          >
            <Typography>Group Type: </Typography>
            <Controller
              name="type"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ButtonGroup size="large">
                  <Button
                    variant={value === 'resale' ? 'contained' : 'outlined'}
                    onClick={() => onChange('resale')}
                  >
                    Resale
                  </Button>
                  <Button
                    variant={value === 'bto' ? 'contained' : 'outlined'}
                    onClick={() => onChange('bto')}
                  >
                    BTO
                  </Button>
                </ButtonGroup>
              )}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} lg={6}>
          <FormAutocompleteInput
            name="towns"
            control={control as Control<FieldValues>}
            options={Object.values(Town).sort((left, right) => {
              const leftTown = mapTownToRegion(left);
              const rightTown = mapTownToRegion(right);
              if (leftTown.localeCompare(rightTown) === 0) {
                return left.localeCompare(right);
              }
              return leftTown.localeCompare(rightTown);
            })}
            groupBy={(town) => mapTownToRegion(town)}
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
            name="isFloorAreaRangeEnabled"
            control={control as Control<FieldValues>}
            disabled={isSubmitting}
            label="Floor Area (sqm)"
          />
          <FormSliderInput
            name="floorAreaRange"
            control={control as Control<FieldValues>}
            setValue={setValue}
            currentData={currentData ? currentData.floorAreaRange : undefined}
            min={1}
            max={200}
            inputFields
            disabled={!watchFloorAreaRangeEnabled || isSubmitting}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <FormSwitchInput
            name="isYearRangeEnabled"
            control={control as Control<FieldValues>}
            disabled={isSubmitting}
            label={watchType === 'resale' ? 'Year of Sale' : 'Year of Launch'}
          />
          <FormSliderInput
            name="yearRange"
            control={control as Control<FieldValues>}
            setValue={setValue}
            currentData={currentData ? currentData.yearRange : undefined}
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
            inputFields
            disabled={!watchYearRangeEnabled || isSubmitting}
            initialValue={[2010, 2021]}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          {watchType === 'resale' ? (
            <>
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
                currentData={
                  currentData ? currentData.leasePeriodRange : undefined
                }
                min={1}
                max={99}
                inputFields
                disabled={!watchLeasePeriodRangeEnabled || isSubmitting}
                initialValue={[50, 99]}
              />
            </>
          ) : (
            <>
              <StaticFormSwitchInput label="Lease Period filter unavailable" />
            </>
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          {watchType === 'resale' ? (
            <>
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
                currentData={currentData ? currentData.storeyRange : undefined}
                min={1}
                max={60}
                inputFields
                disabled={!watchStoreyRangeEnabled || isSubmitting}
                initialValue={[1, 60]}
              />
            </>
          ) : (
            <>
              <StaticFormSwitchInput label="Storey filter unavailable" />
            </>
          )}
        </Grid>
        <Grid item container xs={12} justifyContent="space-between">
          <Grid item>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                type="button"
                onClick={() => reset({ ...defaultFormValues, type: watchType })}
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
                  if (formType === 'update') {
                    reset(currentData || defaultFormValues);
                  }
                  handleClose();
                }}
              >
                {isSubmitting ? <CircularProgress /> : 'Cancel'}
              </Button>
              <Button variant="contained" type="submit">
                {isSubmitting ? <CircularProgress /> : submitText}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

GroupForm.defaultProps = {
  currentData: undefined,
  groupNamePlaceholder: undefined,
};

export default GroupForm;
