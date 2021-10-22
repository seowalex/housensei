import { CheckCircleRounded, Circle } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { useAppSelector } from '../../app/hooks';
import { selectColorTheme } from '../../reducers/settings';
import { GroupColor } from '../../types/groups';

interface ButtonProps {
  color: GroupColor;
  value: GroupColor;
  onChange: (color: GroupColor) => void;
  iconColor: string;
}

const FormColorButton = (props: ButtonProps) => {
  const { color, value, onChange, iconColor } = props;

  return (
    <IconButton size="small" onClick={() => onChange(color)}>
      {color === value ? (
        <CheckCircleRounded fontSize="small" htmlColor={iconColor} />
      ) : (
        <Circle fontSize="small" htmlColor={iconColor} />
      )}
    </IconButton>
  );
};

interface Props {
  name: string;
  control: Control<FieldValues>;
}

const FormColorInput = (props: Props) => {
  const { name, control } = props;
  const colorTheme = useAppSelector(selectColorTheme);

  const colors = [...Array(Object.keys(GroupColor).length / 2).keys()];
  const firstRowColors = colors.slice(0, Math.floor(colors.length / 2));
  const secondRowColors = colors.slice(Math.floor(colors.length / 2));

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Stack>
          <Stack direction="row">
            {firstRowColors.map((c) => {
              const color: GroupColor = c;
              return (
                <FormColorButton
                  color={color}
                  value={value}
                  onChange={onChange}
                  iconColor={colorTheme[color]}
                />
              );
            })}
          </Stack>
          <Stack direction="row">
            {secondRowColors.map((c) => {
              const color: GroupColor = c;
              return (
                <FormColorButton
                  color={color}
                  value={value}
                  onChange={onChange}
                  iconColor={colorTheme[color]}
                />
              );
            })}
          </Stack>
        </Stack>
      )}
    />
  );
};

export default FormColorInput;
