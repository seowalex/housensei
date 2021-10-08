import { TextField } from '@mui/material';
import { Control, Controller, FieldValues } from 'react-hook-form';

interface Props {
  name: string;
  control: Control<FieldValues>;
  label?: string;
  placeholder?: string;
}

const FormTextInput = (props: Props) => {
  const { name, control, label, placeholder } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TextField
          value={value}
          onChange={onChange}
          label={label}
          placeholder={placeholder}
          sx={{ width: '100%' }}
        />
      )}
    />
  );
};

export default FormTextInput;
