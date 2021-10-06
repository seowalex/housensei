import { Autocomplete, TextField } from '@mui/material';
import { Control, Controller, FieldValues } from 'react-hook-form';

interface Props {
  name: string;
  control: Control<FieldValues>;
  options: string[];
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  limitTags?: number;
}

const FormAutocompleteInput = (props: Props) => {
  const { name, control, options, disabled, label, placeholder, limitTags } =
    props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          onChange={(e, data) => onChange(data)}
          value={value}
          multiple
          disabled={disabled}
          limitTags={limitTags}
          options={options}
          disableCloseOnSelect
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            />
          )}
        />
      )}
    />
  );
};

FormAutocompleteInput.defaultProps = {
  disabled: false,
  label: '',
  placeholder: '',
  limitTags: undefined,
};

export default FormAutocompleteInput;
