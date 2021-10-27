import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  Grid,
  IconButton,
  OutlinedInput,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { matchSorter } from 'match-sorter';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectTown,
  selectYear,
  setTown,
  setYear,
} from '../../../reducers/heatmap';
import {
  selectHeatmapPriceRangeLower,
  selectHeatmapPriceRangeUpper,
  selectShowHeatmap,
  selectShowHeatmapOverlay,
  setHeatmapPriceRangeLower,
  setHeatmapPriceRangeUpper,
  setShowHeatmapOverlay,
} from '../../../reducers/settings';
import {
  useGetIslandHeatmapQuery,
  useGetTownHeatmapQuery,
} from '../../../api/heatmap';

import { useDebounce } from '../../../app/utils';
import { townSorter } from '../../../utils/towns';
import {
  singaporeCoordinates,
  townCoordinates,
  townRegions,
} from '../../../app/constants';
import { Town } from '../../../types/towns';

import Settings from './Settings';
import PriceRange from './PriceRange';
import { EventCategory, HeatmapEventAction } from '../../../app/analytics';

interface Props {
  map?: google.maps.Map;
  searchBox?: google.maps.places.SearchBox;
  setSearchBox: Dispatch<
    SetStateAction<google.maps.places.SearchBox | undefined>
  >;
  setSearchMarkers: Dispatch<SetStateAction<google.maps.LatLng[]>>;
}

const currentYear = new Date().getFullYear();

const yearMarks = [
  ...Array(Math.floor((currentYear - 1990) / 10) + 1).keys(),
].map((i) => {
  const value = 1990 + i * 10;

  return { value, label: value.toString() };
});

const MapOverlay = ({
  map,
  searchBox,
  setSearchBox,
  setSearchMarkers,
}: Props) => {
  const dispatch = useAppDispatch();
  const showHeatmapOverlay = useAppSelector(selectShowHeatmapOverlay);
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

  const setMapViewport = () => {
    if (!map || !searchBox) {
      return;
    }

    const places = searchBox.getPlaces();

    if (places?.length === 0) {
      return;
    }

    setSearchMarkers([]);

    const bounds = new google.maps.LatLngBounds();

    places?.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        return;
      }

      const { location } = place.geometry;

      if (location) {
        setSearchMarkers((markers) => [...markers, location]);
      }

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    map.fitBounds(bounds);
  };

  const handleTownChange = (_: React.SyntheticEvent, townName: string) => {
    dispatch(setTown(townName as Town | 'Islandwide'));
    map?.setCenter(townCoordinates[townName as Town] ?? singaporeCoordinates);
    map?.setZoom(townName === 'Islandwide' ? 12 : 15);
    ReactGA.event({
      category: EventCategory.Heatmap,
      action: HeatmapEventAction.ChangeTown,
    });
  };

  const handleYearBlur = () => {
    if (Number.isNaN(year) || year < 1990) {
      dispatch(setYear(1990));
    } else if (year > currentYear) {
      dispatch(setYear(currentYear));
    }
    ReactGA.event({
      category: EventCategory.Heatmap,
      action: HeatmapEventAction.AdjustYear,
    });
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => dispatch(setShowHeatmapOverlay(true))}
        sx={{
          p: 1,
          minWidth: 'auto',
          position: 'absolute',
          top: 0,
          right: 0,
          m: 1,
          pointerEvents: 'auto',
        }}
      >
        <KeyboardArrowDownIcon />
      </Button>
      <Collapse
        in={showHeatmapOverlay}
        sx={{ position: 'absolute', top: 0, width: '100%' }}
      >
        <Grid
          component={Paper}
          container
          spacing={2}
          sx={{ p: 1 }}
          alignItems="center"
        >
          <Grid item xs={12} md="auto">
            <StandaloneSearchBox
              onPlacesChanged={() => {
                ReactGA.event({
                  category: EventCategory.Heatmap,
                  action: HeatmapEventAction.SearchAddr,
                });
                setMapViewport();
              }}
              onLoad={setSearchBox}
            >
              <TextField
                placeholder="Search..."
                size="small"
                sx={{
                  width: {
                    xs: '100%',
                    md: 400,
                  },
                  '.MuiInputBase-root': {
                    backgroundColor: (theme) =>
                      theme.palette.background.default,
                  },
                }}
              />
            </StandaloneSearchBox>
          </Grid>
          <Grid item xs={12} md="auto">
            <Autocomplete
              size="small"
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
              renderOption={(props, option) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <li data-tour={`heatmap-town-${option}`} {...props}>
                  {option}
                </li>
              )}
              value={town}
              onChange={handleTownChange}
              blurOnSelect
              disableClearable
              data-tour="heatmap-town-dropdown"
              sx={{
                width: {
                  xs: '100%',
                  md: 200,
                },
                '.MuiInputBase-root': {
                  backgroundColor: (theme) => theme.palette.background.default,
                },
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md="auto"
            sx={{
              width: {
                xs: '100%',
                md: 400,
              },
              overflow: 'visible',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Divider orientation="vertical" flexItem />
              <Typography gutterBottom>Year</Typography>
              <Box
                sx={{
                  p: (theme) => `${theme.spacing(2)} ${theme.spacing(2)} 0`,
                  flexGrow: 1,
                }}
              >
                <Slider
                  track={false}
                  size="small"
                  min={1990}
                  max={currentYear}
                  marks={yearMarks}
                  value={year}
                  onChange={(_, value) => dispatch(setYear(value as number))}
                  onChangeCommitted={() => {
                    ReactGA.event({
                      category: EventCategory.Heatmap,
                      action: HeatmapEventAction.AdjustYear,
                    });
                  }}
                  sx={{
                    p: '0px !important',
                    '.MuiSlider-markLabel': {
                      top: 10,
                    },
                  }}
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
            <Stack direction="row">
              <IconButton onClick={() => setShowSettings(true)}>
                <SettingsIcon />
              </IconButton>
              <IconButton
                onClick={() => dispatch(setShowHeatmapOverlay(false))}
              >
                <KeyboardArrowUpIcon />
              </IconButton>
            </Stack>
            <Settings
              open={showSettings}
              onClose={() => setShowSettings(false)}
            />
          </Grid>
        </Grid>
      </Collapse>
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
              data-tour="heatmap-price"
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
