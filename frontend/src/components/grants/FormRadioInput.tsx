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
}

const FormSelectInput = (props: Props) => {
  const { name, options, form, label } = props;
  const error = form.formState.errors[name]?.message;
  // const error = props.control._formState.errors[props.name]?.message;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value } }) => (
        <FormControl component="fieldset" error={!!error}>
          <FormLabel component="legend">{label}</FormLabel>
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

export default FormSelectInput;
