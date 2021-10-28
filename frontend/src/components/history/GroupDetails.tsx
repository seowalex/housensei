import {
  ControlPointDuplicateRounded as ControlPointDuplicateRoundedIcon,
  DeleteRounded as DeleteRoundedIcon,
  EditRounded as EditRoundedIcon,
  MoreVertRounded as MoreVertRoundedIcon,
} from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import { MouseEvent, useState } from 'react';
import { Group } from '../../types/groups';
import GroupAdditionalFilters from './GroupAdditionalFilters';

interface Props {
  group: Group;
  onDisplayUpdateModal: () => void;
  onDisplayDeleteModal: () => void;
  onDuplicateGroup: () => void;
}

const GroupDetails = (props: Props) => {
  const {
    group,
    onDisplayUpdateModal,
    onDisplayDeleteModal,
    onDuplicateGroup,
  } = props;
  const { name, id } = group;

  const [anchor, setAnchor] = useState<HTMLElement | undefined>(undefined);
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
        <IconButton onClick={handleOpenMenu}>
          <MoreVertRoundedIcon fontSize="small" />
        </IconButton>
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
