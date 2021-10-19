import { CheckRounded as CheckRoundedIcon } from '@mui/icons-material';
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
} from '@mui/material';
import { matchSorter } from 'match-sorter';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import { townSorter } from '../../utils/towns';

interface Props {
  name: string;
  control: Control<FieldValues>;
  options: string[];
  groupBy?: (option: string) => string;
  disabled?: boolean;
  multiple?: boolean;
  label?: string;
  placeholder?: string;
  limitTags?: number;
  requiredMessage?: string;
  errors?: FieldErrors<FieldValues>;
}

const FormAutocompleteInput = (props: Props) => {
  const {
    name,
    control,
    options,
    groupBy,
    disabled,
    multiple,
    label,
    placeholder,
    limitTags,
    requiredMessage,
    errors,
  } = props;
  const error = errors != null ? errors[name] : undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControl error={error != null} sx={{ width: '100%' }}>
          <Autocomplete
            onChange={(e, data) => onChange(data)}
            value={value}
            multiple={multiple}
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
            filterOptions={(filterOptions, { inputValue }) =>
              matchSorter(filterOptions, inputValue, {
                sorter: townSorter(groupBy),
              })
            }
          />
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
      rules={{
        required: requiredMessage ?? false,
      }}
    />
  );
};

FormAutocompleteInput.defaultProps = {
  groupBy: undefined,
  disabled: false,
  multiple: false,
  label: '',
  placeholder: '',
  limitTags: undefined,
  requiredMessage: undefined,
  errors: undefined,
};

export default FormAutocompleteInput;
