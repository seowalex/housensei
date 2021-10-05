import { Collapse, Grid, Input, Slider } from '@mui/material';
import { styled } from '@mui/system';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  UseFormSetValue,
} from 'react-hook-form';

interface Props {
  name: string;
  control: Control<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  marks?: boolean | Array<{ value: number; label?: string }>;
  inputFields?: boolean;
}

const SmallInput = styled(Input)({
  width: '3rem',
});

const FormSliderInput = (props: Props) => {
  const {
    name,
    control,
    setValue,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    marks,
    inputFields,
  } = props;
  const oneThirdOfRange = Math.floor((max - min) / 3 / step) * step;
  const [sliderValue, setSliderValue] = useState<Array<number | ''>>([
    min + oneThirdOfRange,
    max - oneThirdOfRange,
  ]);

  useEffect(() => {
    if (sliderValue) {
      setValue(name, { lower: sliderValue[0], upper: sliderValue[1] });
    }
  }, [sliderValue, name, setValue]);

  const handleSliderChange = (_: any, newValue: number | number[]) => {
    setSliderValue(newValue as number[]);
  };

  const handleLowerInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedInput = parseInt(event.target.value, 10);
    const newValue = Number.isNaN(parsedInput) ? '' : parsedInput;
    setSliderValue([newValue, sliderValue[1]]);
  };

  const handleUpperInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedInput = parseInt(event.target.value, 10);
    const newValue = Number.isNaN(parsedInput) ? '' : parsedInput;
    setSliderValue([sliderValue[0], newValue]);
  };

  const handleInputBlur = () => {
    const newLowerValue = sliderValue[0] === '' ? min : sliderValue[0];
    const newUpperValue = sliderValue[1] === '' ? max : sliderValue[1];

    if (
      sliderValue[0] === '' ||
      sliderValue[1] === '' ||
      newLowerValue < min ||
      newUpperValue > max ||
      newLowerValue > newUpperValue
    ) {
      setSliderValue([
        Math.max(Math.min(newUpperValue, newLowerValue), min),
        Math.min(Math.max(newLowerValue, newUpperValue), max),
      ]);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState, formState }) => (
        <Collapse in={!disabled}>
          <Grid container spacing={2} alignItems="center">
            {inputFields && (
              <Grid item>
                <SmallInput
                  value={sliderValue[0]}
                  size="small"
                  onChange={handleLowerInputChange}
                  onBlur={handleInputBlur}
                  inputProps={{
                    step,
                    min,
                    max,
                  }}
                  disabled={disabled}
                />
              </Grid>
            )}
            <Grid item xs>
              <Slider
                onChange={handleSliderChange}
                value={[
                  sliderValue[0] === '' ? min : sliderValue[0],
                  sliderValue[1] === '' ? max : sliderValue[1],
                ]}
                valueLabelDisplay="auto"
                min={min}
                max={max}
                marks={marks}
                step={step ?? 1}
                disabled={disabled}
              />
            </Grid>
            {inputFields && (
              <Grid item>
                <SmallInput
                  value={sliderValue[1]}
                  size="small"
                  onChange={handleUpperInputChange}
                  onBlur={handleInputBlur}
                  inputProps={{
                    step,
                    min,
                    max,
                  }}
                  disabled={disabled}
                />
              </Grid>
            )}
          </Grid>
        </Collapse>
      )}
    />
  );
};

FormSliderInput.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  marks: false,
  inputFields: false,
};

export default FormSliderInput;
