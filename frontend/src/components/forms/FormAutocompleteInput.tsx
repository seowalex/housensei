import { CheckRounded as CheckRoundedIcon } from '@mui/icons-material';
import { Autocomplete, Stack, TextField } from '@mui/material';
import { matchSorter } from 'match-sorter';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { townSorter } from '../../utils/towns';

interface Props {
  name: string;
  control: Control<FieldValues>;
  options: string[];
  groupBy?: (option: string) => string;
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
          filterOptions={(filterOptions, { inputValue }) =>
            matchSorter(filterOptions, inputValue, {
              sorter: townSorter(groupBy),
            })
          }
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
