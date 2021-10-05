import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Control, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { FlatType, Town } from '../../types/property';
import FormAutocompleteInput from '../forms/FormAutocompleteInput';
import FormSliderInput from '../forms/FormSliderInput';

interface Range<T> {
  lower: T;
  upper: T;
}

interface FormValues {
  towns: Town[];
  flatTypes: FlatType[];
  storeyRange: Range<number>;
  floorAreaRange: Range<number>;
  leasePeriodRange: Range<number>;
  yearRange: Range<number>;
}

const GroupForm = () => {
  const { handleSubmit, reset, setValue, control } = useForm<FormValues>({
    defaultValues: {
      towns: [],
      flatTypes: [],
    },
  });
  const [isStoreyRangeEnabled, setStoreyRangeEnabled] =
    useState<boolean>(false);
  const [isFloorAreaRangeEnabled, setFloorAreaRangeEnabled] =
    useState<boolean>(false);
  const [isLeasePeriodRangeEnabled, setLeasePeriodRangeEnabled] =
    useState<boolean>(false);
  const [isYearRangeEnabled, setYearRangeEnabled] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);

  return (
    <Paper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: '1rem' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <FormAutocompleteInput
                name="towns"
                control={control as Control<FieldValues>}
                options={Object.values(Town)}
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
                label="Flat Types"
                placeholder="Enter a flat type"
                limitTags={3}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isStoreyRangeEnabled}
                    onChange={(e) => setStoreyRangeEnabled(e.target.checked)}
                  />
                }
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
                disabled={!isStoreyRangeEnabled}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isFloorAreaRangeEnabled}
                    onChange={(e) => setFloorAreaRangeEnabled(e.target.checked)}
                  />
                }
                label="Floor Area (sqm)"
              />
              <FormSliderInput
                name="floorAreaRange"
                control={control as Control<FieldValues>}
                setValue={setValue}
                min={1}
                max={200}
                inputFields
                disabled={!isFloorAreaRangeEnabled}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isLeasePeriodRangeEnabled}
                    onChange={(e) =>
                      setLeasePeriodRangeEnabled(e.target.checked)
                    }
                  />
                }
                label="Remaining Lease Period (years)"
              />
              <FormSliderInput
                name="leasePeriodRange"
                control={control as Control<FieldValues>}
                setValue={setValue}
                min={1}
                max={99}
                inputFields
                disabled={!isLeasePeriodRangeEnabled}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isYearRangeEnabled}
                    onChange={(e) => setYearRangeEnabled(e.target.checked)}
                  />
                }
                label="Year of Sale"
              />
              <FormSliderInput
                name="leasePeriodRange"
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
                disabled={!isYearRangeEnabled}
              />
            </Grid>
            <Grid item container xs={12} justifyContent="flex-end">
              <Grid item>
                <Button variant="contained" type="submit">
                  Add Group
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Paper>
  );
};

export default GroupForm;
