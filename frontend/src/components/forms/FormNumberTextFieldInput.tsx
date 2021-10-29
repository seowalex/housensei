import {
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material';
import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';

interface Props {
  name: string;
  form: UseFormReturn<FieldValues>;
  label?: string;
  required?: boolean;
}

const FormNumberTextFieldInput = (props: Props) => {
  const { name, form, label, required } = props;
  const error = form.formState.errors[name]?.message;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value } }) => (
        <FormControl component="fieldset" error={!!error} required={!!required}>
          <FormLabel component="legend">
            {label +
              (required ? '' : ' If you are unsure, please leave blank.')}
          </FormLabel>
          <TextField
            type="number"
            size="small"
            variant="outlined"
            value={value}
            inputProps={{ min: 0 }}
            onChange={onChange}
            sx={{ width: '40%' }}
          />
          <FormHelperText style={{ height: '5px' }}>{error}</FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default FormNumberTextFieldInput;
