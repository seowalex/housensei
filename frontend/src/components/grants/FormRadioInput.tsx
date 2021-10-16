import {
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
  // placeholder?: string;
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
        <>
          <FormLabel component="legend">{label}</FormLabel>
          <RadioGroup
            row
            aria-label="gender"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={onChange}
          >
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          {error && <FormHelperText>{error}</FormHelperText>}
        </>
      )}
    />
  );
};

export default FormSelectInput;
