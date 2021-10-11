import { CheckRounded as CheckRoundedIcon } from '@mui/icons-material';
import { Autocomplete, Stack, TextField } from '@mui/material';
import { Control, Controller, FieldValues } from 'react-hook-form';

interface Props {
  name: string;
  control: Control<FieldValues>;
  options: string[];
  groupBy?: (options: any) => string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  limitTags?: number;
}

const FormAutocompleteInput = (props: Props) => {
  const {
    name,
    control,
    options,
    groupBy,
    disabled,
    label,
    placeholder,
    limitTags,
  } = props;
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
          groupBy={groupBy}
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
          renderOption={(optionProps, option, { selected }) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <li {...optionProps}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: '100%' }}
              >
                {option}
                {selected && <CheckRoundedIcon fontSize="small" />}
              </Stack>
            </li>
          )}
        />
      )}
    />
  );
};

FormAutocompleteInput.defaultProps = {
  groupBy: undefined,
  disabled: false,
  label: '',
  placeholder: '',
  limitTags: undefined,
};

export default FormAutocompleteInput;
