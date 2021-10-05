import { Autocomplete, TextField } from '@mui/material';
import { Control, Controller, FieldValues } from 'react-hook-form';

interface Props {
  name: string;
  control: Control<FieldValues>;
  options: string[];
  label?: string;
  placeholder?: string;
  limitTags?: number;
}

const FormAutocompleteInput = (props: Props) => {
  const { name, control, options, label, placeholder, limitTags } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          onChange={(e, data) => onChange(data)}
          value={value}
          multiple
          limitTags={limitTags}
          options={options}
          disableCloseOnSelect
          renderInput={(params) => (
            <TextField {...params} label={label} placeholder={placeholder} />
          )}
        />
      )}
    />
  );
};

FormAutocompleteInput.defaultProps = {
  label: '',
  placeholder: '',
  limitTags: undefined,
};

export default FormAutocompleteInput;
