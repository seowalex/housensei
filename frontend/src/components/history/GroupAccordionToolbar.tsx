import {
  ControlPointDuplicateRounded as ControlPointDuplicateRoundedIcon,
  DeleteRounded as DeleteRoundedIcon,
  EditRounded as EditRoundedIcon,
  MoreVertRounded as MoreVertRoundedIcon,
  VisibilityOffRounded,
  VisibilityRounded,
} from '@mui/icons-material';
import { IconButton, Popover, Stack, Tooltip } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import {
  selectIsGroupDisplayed,
  updateDisplayedGroups,
} from '../../reducers/history';

interface Props {
  groupId: string;
  onDisplayUpdateModal: () => void;
  onDisplayDeleteModal: () => void;
  onDuplicateGroup: () => void;
}

const GroupAccordionToolbar = (props: Props) => {
  const dispatch = useDispatch();
  const {
    groupId,
    onDisplayUpdateModal,
    onDisplayDeleteModal,
    onDuplicateGroup,
  } = props;
  const isGroupDisplayed = useAppSelector(selectIsGroupDisplayed(groupId));

  const [anchor, setAnchor] = useState<HTMLElement | undefined>(undefined);
  const handleToggleDisplayGroup = () => {
    dispatch(updateDisplayedGroups({ id: groupId, show: !isGroupDisplayed }));
  };
  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchor(undefined);
  };

  return (
    <>
      <Stack justifyContent="flex-end" sx={{ height: '100%' }}>
        <Tooltip
          title={isGroupDisplayed ? 'Displayed' : 'Hidden'}
          placement="right"
          arrow
        >
          <IconButton onClick={handleToggleDisplayGroup}>
            {isGroupDisplayed ? (
              <VisibilityRounded fontSize="small" />
            ) : (
              <VisibilityOffRounded fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <IconButton onClick={handleOpenMenu}>
          <MoreVertRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Popover
        anchorEl={anchor}
        open={anchor != null}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack>
          <Tooltip title="Duplicate" placement="right" arrow>
            <IconButton
              onClick={() => {
                onDuplicateGroup();
                handleCloseMenu();
              }}
            >
              <ControlPointDuplicateRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit" placement="right" arrow>
            <IconButton
              onClick={() => {
                onDisplayUpdateModal();
                handleCloseMenu();
              }}
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="right" arrow>
            <IconButton
              onClick={() => {
                onDisplayDeleteModal();
                handleCloseMenu();
              }}
              color="error"
            >
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Popover>
    </>
  );
};

export default GroupAccordionToolbar;
