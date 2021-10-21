import { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';

import { useAppDispatch } from '../../../app/hooks';

import { currencyFormatter } from '../../../app/utils';
import { EventCategory, HeatmapEventAction } from '../../../app/analytics';

interface Props {
  priceRange: number;
  setHeatmapPriceRange: ActionCreatorWithPayload<number, string>;
  min?: number;
  max?: number;
}

const PriceRange = ({ priceRange, setHeatmapPriceRange, min, max }: Props) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(priceRange);
  const [priceRangeOpen, setPriceRangeOpen] = useState(false);

  useEffect(() => {
    setValue(priceRange);
  }, [priceRange]);

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' || event.key === 'Enter') {
      if (
        value >= (min ?? Number.NEGATIVE_INFINITY) &&
        value <= (max ?? Number.POSITIVE_INFINITY)
      ) {
        dispatch(setHeatmapPriceRange(value));
      } else {
        setValue(priceRange);
      }

      setPriceRangeOpen(false);
    }
  };

  const handleBlur = () => {
    if (
      value >= (min ?? Number.NEGATIVE_INFINITY) &&
      value <= (max ?? Number.POSITIVE_INFINITY)
    ) {
      dispatch(setHeatmapPriceRange(value));
    } else {
      setValue(priceRange);
    }

    setPriceRangeOpen(false);
  };

  return priceRangeOpen ? (
    <TextField
      type="number"
      size="small"
      variant="outlined"
      value={value}
      onChange={(event) => setValue(parseInt(event.target.value, 10))}
      onBlur={handleBlur}
      onKeyDown={handleEnter}
      autoFocus
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{
              mr: '4px',
              '.MuiTypography-root': (theme) => theme.typography.body2,
            }}
          >
            $
          </InputAdornment>
        ),
      }}
      sx={{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        p: '8px 0 4px',
        '.MuiInputBase-root': {
          fontSize: (theme) => theme.typography.body2,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          px: 1,
          '.MuiInputBase-input': {
            maxWidth: 70,
            p: '3px 4px',
          },
        },
      }}
    />
  ) : (
    <Stack direction="row" alignItems="center" sx={{ p: '8px 0 4px' }}>
      <Typography variant="subtitle2">
        {currencyFormatter.format(priceRange)}
      </Typography>
      <IconButton
        size="small"
        onClick={() => {
          ReactGA.event({
            category: EventCategory.Heatmap,
            action: HeatmapEventAction.EditPrice,
          });
          setPriceRangeOpen(true);
        }}
      >
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Stack>
  );
};

export default PriceRange;
