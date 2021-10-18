import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
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

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value } }) => (
        <FormControl component="fieldset" error={!!error}>
          <FormLabel component="legend">{label}</FormLabel>
          <Select value={value} label={label} onChange={onChange}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText style={{ height: '5px' }}>{error}</FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default FormSelectInput;
