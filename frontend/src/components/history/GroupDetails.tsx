import {
  ControlPointDuplicateRounded as ControlPointDuplicateRoundedIcon,
  DeleteRounded as DeleteRoundedIcon,
  EditRounded as EditRoundedIcon,
  MoreVertRounded as MoreVertRoundedIcon,
  VisibilityOffRounded as VisibilityOffRoundedIcon,
  VisibilityRounded as VisibilityRoundedIcon,
} from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import {
  selectIsGroupDisplayed,
  updateDisplayedGroups,
} from '../../reducers/history';
import { Group } from '../../types/groups';
import GroupAdditionalFilters from './GroupAdditionalFilters';

interface Props {
  group: Group;
  onDisplayUpdateModal: () => void;
  onDisplayDeleteModal: () => void;
  onDuplicateGroup: () => void;
}

const GroupDetails = (props: Props) => {
  const dispatch = useDispatch();
  const {
    group,
    onDisplayUpdateModal,
    onDisplayDeleteModal,
    onDuplicateGroup,
  } = props;
  const { name, id } = group;
  const isGroupDisplayed = useAppSelector(selectIsGroupDisplayed(id));

  const [anchor, setAnchor] = useState<HTMLElement | undefined>(undefined);
  const handleToggleDisplayGroup = () => {
    dispatch(updateDisplayedGroups({ id, show: !isGroupDisplayed }));
  };
  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchor(undefined);
  };

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography
          variant="h6"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </Typography>
        <Stack direction="row" justifyContent="flex-end">
          <Tooltip
            title={isGroupDisplayed ? 'Displayed' : 'Hidden'}
            placement="right"
            arrow
          >
            <IconButton onClick={handleToggleDisplayGroup}>
              {isGroupDisplayed ? (
                <VisibilityRoundedIcon fontSize="small" />
              ) : (
                <VisibilityOffRoundedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <IconButton onClick={handleOpenMenu}>
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
      <GroupAdditionalFilters group={group} />
      <Popover
        anchorEl={anchor}
        open={anchor != null}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onDuplicateGroup();
              handleCloseMenu();
            }}
          >
            <ListItemIcon>
              <ControlPointDuplicateRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Duplicate</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDisplayUpdateModal();
              handleCloseMenu();
            }}
          >
            <ListItemIcon>
              <EditRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDisplayDeleteModal();
              handleCloseMenu();
            }}
          >
            <ListItemIcon>
              <DeleteRoundedIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error">Delete</Typography>
            </ListItemText>
          </MenuItem>
        </MenuList>
      </Popover>
    </Stack>
  );
};

export default GroupDetails;
