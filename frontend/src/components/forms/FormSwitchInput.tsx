import { FormControlLabel, Switch } from '@mui/material';
import { Control, Controller, FieldValues } from 'react-hook-form';

interface Props {
  name: string;
  control: Control<FieldValues>;
  disabled?: boolean;
  label?: string;
}

const FormSwitchInput = (props: Props) => {
  const { name, control, disabled, label } = props;

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch checked={value} onChange={onChange} disabled={disabled} />
          )}
        />
      }
      label={label}
    />
  );
};

interface StaticProps {
  label: string;
}

export const StaticFormSwitchInput = (props: StaticProps) => {
  const { label } = props;
  return (
    <FormControlLabel
      control={<Switch checked={false} disabled />}
      label={label}
    />
  );
};

FormSwitchInput.defaultProps = {
  disabled: false,
  label: '',
};

export default FormSwitchInput;
