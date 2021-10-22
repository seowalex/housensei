import {
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
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
import { CloseRounded as CloseRoundedIcon } from '@mui/icons-material';
import { FlatType, GroupColor } from '../../types/groups';
import { Town } from '../../types/towns';
import FormAutocompleteInput from '../forms/FormAutocompleteInput';
import FormSliderInput from '../forms/FormSliderInput';
import FormSwitchInput, {
  StaticFormSwitchInput,
} from '../forms/FormSwitchInput';
import FormTextInput from '../forms/FormTextInput';
import { townRegions } from '../../app/constants';
import { useAppSelector } from '../../app/hooks';
import { selectNextColor } from '../../reducers/colors';
import FormColorInput from '../forms/FormColorInput';

export interface Range<T> {
  lower: T;
  upper: T;
}

export interface CreateGroupFormValues {
  name: string;
  type: 'resale' | 'bto';
  color: GroupColor;
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
  onSubmit: SubmitHandler<CreateGroupFormValues>;
  handleClose: () => void;
}

const defaultFormValues: CreateGroupFormValues = {
  name: '',
  type: 'resale',
  color: GroupColor.Color1,
  towns: [],
  flatTypes: [],
  isStoreyRangeEnabled: false,
  isFloorAreaRangeEnabled: false,
  isLeasePeriodRangeEnabled: false,
  isYearRangeEnabled: false,
};

const CreateGroupForm = (props: Props) => {
  const { onSubmit, handleClose } = props;
  const nextColor = useAppSelector(selectNextColor);
  const {
    formState: { isSubmitting, errors },
    watch,
    handleSubmit,
    reset,
    setValue,
    control,
  } = useForm<CreateGroupFormValues>({
    defaultValues: { ...defaultFormValues, color: nextColor },
  });

  const watchType = watch('type');
  const watchTowns = watch('towns');
  const watchFlatTypes = watch('flatTypes');
  const watchStoreyRangeEnabled = watch('isStoreyRangeEnabled');
  const watchFloorAreaRangeEnabled = watch('isFloorAreaRangeEnabled');
  const watchLeasePeriodRangeEnabled = watch('isLeasePeriodRangeEnabled');
  const watchYearRangeEnabled = watch('isYearRangeEnabled');

  const submitText =
    watchTowns.length * watchFlatTypes.length > 1
      ? `Add ${watchTowns.length * watchFlatTypes.length} Groups`
      : 'Add Group';

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <IconButton
          sx={{ position: 'absolute', top: '0', right: '0', margin: '1rem' }}
          onClick={handleClose}
        >
          <CloseRoundedIcon fontSize="large" />
        </IconButton>
        <Grid item xs={12}>
          <Box sx={{ p: '0.5rem 0rem' }}>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
              Create Groups
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} lg="auto">
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ height: '100%' }}
            data-tour="history-select-property-type"
          >
            <Typography>Property Type:</Typography>
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
        <Grid item xs={12} lg>
          <FormTextInput
            name="name"
            control={control as Control<FieldValues>}
            label="Group Name (optional)"
            placeholder="New Group"
          />
        </Grid>
        <Grid item xs={12} lg="auto">
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ height: '100%' }}
          >
            <Typography>Colour:</Typography>
            <FormColorInput
              name="color"
              control={control as Control<FieldValues>}
            />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} lg={6}>
          <FormAutocompleteInput
            name="towns"
            control={control as Control<FieldValues>}
            options={Object.values(Town).sort(
              (a, b) =>
                townRegions[a].localeCompare(townRegions[b]) ||
                a.localeCompare(b)
            )}
            groupBy={(option) => townRegions[option as Town]}
            disabled={isSubmitting}
            multiple
            label="Locations"
            placeholder="Enter a town name"
            limitTags={2}
            requiredMessage="Please select at least one location"
            errors={errors}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <FormAutocompleteInput
            name="flatTypes"
            control={control as Control<FieldValues>}
            options={Object.values(FlatType)}
            disabled={isSubmitting}
            multiple
            label="Flat Types"
            placeholder="Enter a flat type"
            limitTags={3}
            requiredMessage="Please select at least one flat type"
            errors={errors}
          />
        </Grid>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
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
        <Grid item xs={12}>
          {watchType === 'resale' ? (
            <FormSwitchInput
              name="isLeasePeriodRangeEnabled"
              control={control as Control<FieldValues>}
              disabled={isSubmitting}
              label="Remaining Lease Period (years)"
            />
          ) : (
            <StaticFormSwitchInput label="Lease Period filter unavailable" />
          )}
          <FormSliderInput
            name="leasePeriodRange"
            control={control as Control<FieldValues>}
            setValue={setValue}
            min={1}
            max={99}
            inputFields
            disabled={
              watchType === 'bto' ||
              !watchLeasePeriodRangeEnabled ||
              isSubmitting
            }
            initialValue={[50, 99]}
          />
        </Grid>
        <Grid item xs={12}>
          {watchType === 'resale' ? (
            <FormSwitchInput
              name="isStoreyRangeEnabled"
              control={control as Control<FieldValues>}
              disabled={isSubmitting}
              label="Storey"
            />
          ) : (
            <StaticFormSwitchInput label="Storey filter unavailable" />
          )}
          <FormSliderInput
            name="storeyRange"
            control={control as Control<FieldValues>}
            setValue={setValue}
            min={1}
            max={60}
            inputFields
            disabled={
              watchType === 'bto' || !watchStoreyRangeEnabled || isSubmitting
            }
            initialValue={[1, 20]}
          />
        </Grid>
        <Grid item container xs={12} justifyContent="space-between">
          <Grid item>
            <Button
              variant="outlined"
              type="button"
              onClick={() => reset({ ...defaultFormValues, type: watchType })}
              color="error"
            >
              {isSubmitting ? <CircularProgress /> : 'Clear All'}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              type="submit"
              data-tour="history-add-group"
            >
              {isSubmitting ? <CircularProgress /> : submitText}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateGroupForm;
