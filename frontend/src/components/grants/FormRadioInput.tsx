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
  options: Array<{ label: string; value: string | boolean | number }>;
  form: UseFormReturn<FieldValues>;
  label?: string | JSX.Element;
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
          <FormLabel component="legend">{label}</FormLabel>
          <RadioGroup row value={value} onChange={onChange}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value as string}
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
