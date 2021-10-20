import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  Stack,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectShowHeatmap,
  selectShowHeatmapPrices,
  setShowHeatmap,
  setShowHeatmapPrices,
} from '../../../reducers/settings';
import { selectTown } from '../../../reducers/heatmap';

interface Props extends DialogProps {
  onClose: () => void;
}

const Settings = ({ onClose, ...props }: Props) => {
  const dispatch = useAppDispatch();
  const showHeatmap = useAppSelector(selectShowHeatmap);
  const showHeatmapPrices = useAppSelector(selectShowHeatmapPrices);
  const town = useAppSelector(selectTown);

  return (
    <Dialog onClose={onClose} {...props}>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SettingsIcon />
          <Typography variant="h6">Settings</Typography>
        </Stack>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: (theme) => theme.spacing(1),
            right: (theme) => theme.spacing(1),
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={showHeatmap}
                onChange={(event) =>
                  dispatch(setShowHeatmap(event.target.checked))
                }
              />
            }
            label="Show heatmap"
          />
          <FormControlLabel
            control={
              <Switch
                checked={showHeatmapPrices}
                onChange={(event) =>
                  dispatch(setShowHeatmapPrices(event.target.checked))
                }
              />
            }
            disabled={town !== 'Islandwide'}
            label="Show towns/prices"
          />
        </FormGroup>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
