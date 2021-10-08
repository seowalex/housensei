import {
  Circle as CircleIcon,
  CircleOutlined as CircleOutlinedIcon,
} from '@mui/icons-material';
import { Chip, Stack, Typography } from '@mui/material';
import { Group } from '../../types/groups';

interface Props {
  group: Group;
}

const GroupSummary = (props: Props) => {
  const { group } = props;
  const { type, color, name } = group;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Chip
        icon={
          type === 'resale' ? (
            <CircleIcon sx={{ fill: color }} />
          ) : (
            <CircleOutlinedIcon sx={{ fill: color }} />
          )
        }
        label={type === 'resale' ? 'Resale' : 'BTO'}
        variant="outlined"
      />
      <Typography variant="h6">{name}</Typography>
    </Stack>
  );
};

export default GroupSummary;
