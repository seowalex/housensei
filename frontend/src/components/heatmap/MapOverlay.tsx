import { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  OutlinedInput,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { matchSorter } from 'match-sorter';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectTown,
  selectYear,
  setTown,
  setYear,
} from '../../reducers/heatmap';
import {
  selectHeatmapPriceRangeLower,
  selectHeatmapPriceRangeUpper,
  selectShowHeatmap,
  setHeatmapPriceRangeLower,
  setHeatmapPriceRangeUpper,
} from '../../reducers/settings';
import {
  useGetIslandHeatmapQuery,
  useGetTownHeatmapQuery,
} from '../../api/heatmap';

import { useDebounce } from '../../app/utils';
import { townSorter } from '../../utils/towns';
import {
  singaporeCoordinates,
  townCoordinates,
  townRegions,
} from '../../app/constants';
import { Town } from '../../types/towns';

import Settings from './Settings';
import PriceRange from './PriceRange';

interface Props {
  map?: google.maps.Map;
}

const currentYear = new Date().getFullYear();

const yearMarks = [
  ...Array(Math.floor((currentYear - 1990) / 10) + 1).keys(),
].map((i) => {
  const value = 1990 + i * 10;

  return { value, label: value.toString() };
});

const MapOverlay = ({ map }: Props) => {
  const dispatch = useAppDispatch();
  const showHeatmap = useAppSelector(selectShowHeatmap);
  const town = useAppSelector(selectTown);
  const year = useAppSelector(selectYear);

  const [showSettings, setShowSettings] = useState(false);

  const debouncedYear = useDebounce(year, 500);

  const { data: islandHeatmap } = useGetIslandHeatmapQuery(
    town === 'Islandwide' ? debouncedYear : skipToken
  );
  const { data: townHeatmap } = useGetTownHeatmapQuery(
    town === 'Islandwide'
      ? skipToken
      : {
          year: debouncedYear,
          town,
        }
  );

  const defaultPriceRangeLower = useMemo(() => {
    if (town === 'Islandwide') {
      if (islandHeatmap) {
        return (
          Math.floor(
            Math.min(...islandHeatmap.map((point) => point.resalePrice)) /
              100000
          ) * 100000
        );
      }

      return null;
    }

    if (townHeatmap) {
      return (
        Math.floor(
          Math.min(...townHeatmap.map((point) => point.resalePrice)) / 100000
        ) * 100000
      );
    }

    return null;
  }, [town, islandHeatmap, townHeatmap]);
  const defaultPriceRangeUpper = useMemo(() => {
    if (town === 'Islandwide') {
      if (islandHeatmap) {
        return (
          Math.ceil(
            Math.max(...islandHeatmap.map((point) => point.resalePrice)) /
              100000
          ) * 100000
        );
      }

      return null;
    }

    if (townHeatmap) {
      return (
        Math.ceil(
          Math.max(...townHeatmap.map((point) => point.resalePrice)) / 100000
        ) * 100000
      );
    }

    return null;
  }, [town, islandHeatmap, townHeatmap]);

  const priceRangeLower = useAppSelector(selectHeatmapPriceRangeLower);
  const priceRangeUpper = useAppSelector(selectHeatmapPriceRangeUpper);

  useEffect(() => {
    if (Number.isNaN(priceRangeLower) && defaultPriceRangeLower) {
      dispatch(setHeatmapPriceRangeLower(defaultPriceRangeLower));
    }
  }, [dispatch, priceRangeLower, defaultPriceRangeLower]);

  useEffect(() => {
    if (Number.isNaN(priceRangeUpper) && defaultPriceRangeUpper) {
      dispatch(setHeatmapPriceRangeUpper(defaultPriceRangeUpper));
    }
  }, [dispatch, priceRangeUpper, defaultPriceRangeUpper]);

  const handleTownChange = (_: React.SyntheticEvent, townName: string) => {
    dispatch(setTown(townName as Town | 'Islandwide'));
    map?.setCenter(townCoordinates[townName as Town] ?? singaporeCoordinates);
    map?.setZoom(townName === 'Islandwide' ? 12 : 15);
  };

  const handleYearBlur = () => {
    if (Number.isNaN(year) || year < 1990) {
      dispatch(setYear(1990));
    } else if (year > currentYear) {
      dispatch(setYear(currentYear));
    }
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ position: 'absolute', top: 0, p: 2, pointerEvents: 'none' }}
      >
        <Grid item xs={12} md="auto">
          <Autocomplete
            options={['Islandwide'].concat(
              Object.values(Town).sort(
                (a, b) =>
                  townRegions[a].localeCompare(townRegions[b]) ||
                  a.localeCompare(b)
              )
            )}
            groupBy={(option) => townRegions[option as Town] ?? ''}
            filterOptions={(options, { inputValue }) =>
              matchSorter(options, inputValue, {
                sorter: townSorter(
                  (option) => townRegions[option as Town] ?? ''
                ),
              })
            }
            renderInput={(params) => <TextField label="Town" {...params} />}
            value={town}
            onChange={handleTownChange}
            blurOnSelect
            disableClearable
            sx={{
              width: {
                xs: '100%',
                md: 200,
              },
              pointerEvents: 'auto',
              '.MuiInputBase-root': {
                backgroundColor: (theme) => theme.palette.background.default,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md="auto">
          <Card
            sx={{
              width: {
                xs: '100%',
                md: 400,
              },
              pointerEvents: 'auto',
              overflow: 'visible',
            }}
          >
            <CardContent
              sx={{
                p: (theme) =>
                  `0 ${theme.spacing(2)} ${theme.spacing(1)} !important`,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography gutterBottom>Year</Typography>
                <Box
                  sx={{
                    p: (theme) => `${theme.spacing(2)} ${theme.spacing(2)} 0`,
                    flexGrow: 1,
                  }}
                >
                  <Slider
                    track={false}
                    min={1990}
                    max={currentYear}
                    marks={yearMarks}
                    value={year}
                    onChange={(_, value) => dispatch(setYear(value as number))}
                    valueLabelDisplay="auto"
                  />
                </Box>
                <OutlinedInput
                  value={year}
                  size="small"
                  onChange={(event) =>
                    dispatch(setYear(parseInt(event.target.value, 10)))
                  }
                  onBlur={handleYearBlur}
                  inputProps={{
                    min: 1990,
                    max: currentYear,
                    type: 'number',
                  }}
                  sx={{
                    '.MuiInputBase-input': {
                      maxWidth: '70px',
                    },
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs
          sx={{
            display: 'flex',
            alignItems: 'start',
            flexDirection: 'row-reverse',
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowSettings(true)}
            sx={{
              p: '12px',
              minWidth: 'auto',
              pointerEvents: 'auto',
            }}
          >
            <SettingsIcon />
          </Button>
          <Settings
            open={showSettings}
            onClose={() => setShowSettings(false)}
          />
        </Grid>
      </Grid>
      {showHeatmap && (
        <Grid
          container
          sx={{ position: 'absolute', bottom: 0, p: 2, pointerEvents: 'none' }}
        >
          <Grid item xs={12}>
            <Card
              sx={{
                width: {
                  xs: '100%',
                  md: 600,
                },
                pointerEvents: 'auto',
              }}
            >
              <CardContent
                sx={{ position: 'relative', p: '0 12px 12px !important' }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 0,
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  Average Resale Price
                </Typography>
                <Stack direction="row" justifyContent="space-between">
                  <PriceRange
                    priceRange={priceRangeLower}
                    setHeatmapPriceRange={setHeatmapPriceRangeLower}
                    max={priceRangeUpper}
                  />
                  <PriceRange
                    priceRange={priceRangeUpper}
                    setHeatmapPriceRange={setHeatmapPriceRangeUpper}
                    min={priceRangeLower}
                  />
                </Stack>
                <Box
                  sx={{
                    height: 16,
                    width: '100%',
                    background:
                      'linear-gradient(to right, rgba(102, 255, 0, 1), rgba(147, 255, 0, 1), rgba(193, 255, 0, 1), rgba(238, 255, 0, 1), rgba(244, 227, 0, 1), rgba(249, 198, 0, 1), rgba(255, 170, 0, 1), rgba(255, 113, 0, 1), rgba(255, 57, 0, 1), rgba(255, 0, 0, 1))',
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default MapOverlay;
