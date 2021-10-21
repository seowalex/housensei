import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';

interface Props {
  name: string;
  options: Array<{ label: string; value: any }>;
  form: UseFormReturn<FieldValues>;
  label?: string;
  required?: boolean;
}

const FormRadioInput = (props: Props) => {
  const { name, options, form, label, required } = props;
  const error = form.formState.errors[name]?.message;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value } }) => (
        <FormControl component="fieldset" error={!!error} required={!!required}>
          <FormLabel component="legend">
            {label + (required ? '' : ' (Optional)')}
          </FormLabel>
          <RadioGroup row value={value} onChange={onChange}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          <FormHelperText style={{ height: '5px' }}>{error}</FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default FormRadioInput;
