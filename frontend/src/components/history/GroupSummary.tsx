import {
  BlurOn as BlurOnIcon,
  Circle as CircleIcon,
  VisibilityRounded as VisibilityRoundedIcon,
  VisibilityOffRounded as VisibilityOffRoundedIcon,
  CircleTwoTone,
  RoomRounded,
  BedRounded,
} from '@mui/icons-material';
import { Chip, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import {
  selectIsGroupDisplayed,
  updateDisplayedGroups,
} from '../../reducers/history';
import { selectColorTheme } from '../../reducers/settings';
import { Group } from '../../types/groups';
import { Town } from '../../types/towns';
import { convertFlatTypeToFrontend } from '../../utils/groups';

interface Props {
  group: Group;
}

const GroupSummary = (props: Props) => {
  const dispatch = useDispatch();
  const { group } = props;
  const { type, color, filters, id } = group;
  const isGroupDisplayed = useAppSelector(selectIsGroupDisplayed(id));
  const colorTheme = useAppSelector(selectColorTheme);

  const handleToggleDisplayGroup = () => {
    dispatch(updateDisplayedGroups({ id, show: !isGroupDisplayed }));
  };

  return (
    <Stack direction="row" spacing={0.2} alignItems="center">
      {colorTheme && (
        <Chip
          icon={
            isGroupDisplayed ? (
              <CircleIcon sx={{ fill: colorTheme[color] }} />
            ) : (
              <CircleTwoTone sx={{ fill: colorTheme[color] }} />
            )
          }
          label={type === 'resale' ? 'Resale' : 'BTO'}
          variant="outlined"
          onDelete={handleToggleDisplayGroup}
          deleteIcon={
            <Tooltip title={isGroupDisplayed ? 'Visible' : 'Hidden'} arrow>
              {isGroupDisplayed ? (
                <VisibilityRoundedIcon fontSize="small" />
              ) : (
                <VisibilityOffRoundedIcon fontSize="small" />
              )}
            </Tooltip>
          }
        />
      )}
      <Chip
        label={filters.towns[0] === Town.KAL ? 'Kallang' : filters.towns[0]}
        icon={<RoomRounded fontSize="small" />}
        size="small"
      />

      <Chip
        label={convertFlatTypeToFrontend(filters.flatTypes[0])}
        icon={<BedRounded fontSize="small" />}
        size="small"
      />
    </Stack>
  );
};

export default GroupSummary;
