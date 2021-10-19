import {
  BedRounded as BedRoundedIcon,
  Circle as CircleIcon,
  CircleOutlined as CircleOutlinedIcon,
  RoomRounded as RoomRoundedIcon,
} from '@mui/icons-material';
import { Chip, Stack, Typography } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { selectIsGroupDisplayed } from '../../reducers/history';
import { Group } from '../../types/groups';
import { convertFlatTypeToFrontend } from '../../utils/groups';

interface Props {
  group: Group;
}

const GroupSummary = (props: Props) => {
  const { group } = props;
  const { type, color, filters, id } = group;
  const isGroupDisplayed = useAppSelector(selectIsGroupDisplayed(id));

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Chip
        icon={
          isGroupDisplayed ? (
            <CircleIcon sx={{ fill: color }} />
          ) : (
            <CircleOutlinedIcon sx={{ fill: color }} />
          )
        }
        label={type === 'resale' ? 'Resale' : 'BTO'}
        variant="outlined"
      />
      <Chip icon={<RoomRoundedIcon />} label={filters.towns[0]} size="small" />
      <Chip
        icon={<BedRoundedIcon />}
        label={convertFlatTypeToFrontend(filters.flatTypes[0])}
        size="small"
      />
    </Stack>
  );
};

export default GroupSummary;
