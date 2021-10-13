import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  OutlinedInput,
  Slider,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import {
  GoogleMap,
  HeatmapLayer,
  InfoBox,
  Polygon,
  TransitLayer,
  useJsApiLoader,
} from '@react-google-maps/api';
import { UseLoadScriptOptions } from '@react-google-maps/api/src/useJsApiLoader';
import { InfoBoxOptions } from '@react-google-maps/infobox';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectTown, selectYear, setTown, setYear } from '../reducers/heatmap';
import {
  selectDarkMode,
  selectShowHeatmap,
  selectShowHeatmapPrices,
} from '../reducers/settings';
import {
  useGetIslandHeatmapQuery,
  useGetTownHeatmapQuery,
} from '../api/heatmap';

import { currencyFormatter, useDebounce } from '../app/utils';
import {
  googleMapsApiKey,
  singaporeCoordinates,
  townBoundaries,
  townCoordinates,
  townRegions,
} from '../app/constants';
import { Town } from '../types/towns';

import Settings from '../components/heatmap/Settings';

const apiOptions: UseLoadScriptOptions = {
  googleMapsApiKey,
  libraries: ['places', 'visualization'],
};

const infoBoxOptions: InfoBoxOptions = {
  boxStyle: {
    overflow: 'visible',
  },
  closeBoxURL: '',
  disableAutoPan: true,
  enableEventPropagation: true,
};

const currentYear = new Date().getFullYear();

const yearMarks = [
  ...Array(Math.floor((currentYear - 1990) / 10) + 1).keys(),
].map((i) => {
  const value = 1990 + i * 10;

  return { value, label: value.toString() };
});

const formatPrice = (price?: number) =>
  price ? currencyFormatter.format(price) : '';

const normaliseHeatmap = <T extends { resalePrice: number }>(heatmap?: T[]) => {
  if (!heatmap) {
    return [];
  }

  const minPrice = Math.min(...heatmap.map((point) => point.resalePrice));
  const maxPrice = Math.max(...heatmap.map((point) => point.resalePrice));

  return heatmap.map((point) =>
    Object.fromEntries(
      Object.entries(point).map(([key, value]) => [
        key,
        key === 'resalePrice'
          ? (value - minPrice) / (maxPrice - minPrice) + Number.MIN_VALUE
          : value,
      ])
    )
  ) as T[];
};

const Heatmap = () => {
  const { google } = window;
  const { isLoaded } = useJsApiLoader(apiOptions);

  const dispatch = useAppDispatch();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const darkMode = useAppSelector(selectDarkMode) ?? prefersDarkMode;
  const showHeatmap = useAppSelector(selectShowHeatmap);
  const showHeatmapPrices = useAppSelector(selectShowHeatmapPrices);
  const town = useAppSelector(selectTown);
  const year = useAppSelector(selectYear);

  const [map, setMap] = useState<google.maps.Map>();
  const [polygons, setPolygons] = useState<{
    [K in Town]?: google.maps.Polygon;
  }>({});
  const [infoBoxes, setInfoBoxes] = useState<{
    [K in Town]?: boolean;
  }>({});

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

  const mapOptions: google.maps.MapOptions = useMemo(
    () => ({
      mapId: darkMode ? '9bc9cb34c7dac68c' : null,
      center: singaporeCoordinates,
      clickableIcons: false,
      disableDefaultUI: true,
      zoom: 12,
    }),
    [darkMode]
  );

  const polygonOptions: google.maps.PolygonOptions = useMemo(
    () => ({
      fillColor: darkMode ? '#9e9e9e' : '#757575',
      fillOpacity: 0,
      strokeColor: darkMode ? '#757575' : '#616161',
      strokeWeight: 2,
      strokeOpacity: 0,
    }),
    [darkMode]
  );

  const heatmapLayerOptions: google.maps.visualization.HeatmapLayerOptions =
    useMemo(
      () => ({
        dissipating: false,
        radius: town === 'Islandwide' ? 0.035 : 0.001,
      }),
      [town]
    );

  const heatmapData = useMemo(() => {
    if (!google) {
      return [];
    }

    return town === 'Islandwide'
      ? normaliseHeatmap(islandHeatmap).map((point) => ({
          location: new google.maps.LatLng(townCoordinates[point.town as Town]),
          weight: point.resalePrice,
        }))
      : normaliseHeatmap(townHeatmap).map((point) => ({
          location: new google.maps.LatLng({
            lat: point.coordinates[0],
            lng: point.coordinates[1],
          }),
          weight: point.resalePrice,
        }));
  }, [google, town, islandHeatmap, townHeatmap]);

  useEffect(() => {
    map?.setCenter(townCoordinates[town as Town] ?? singaporeCoordinates);
    map?.setZoom(town === 'Islandwide' ? 12 : 15);
  }, [map, town]);

  useEffect(() => {
    for (const polygon of Object.values(polygons)) {
      polygon?.setOptions({
        fillOpacity: showHeatmapPrices ? 0.4 : 0,
        strokeOpacity: showHeatmapPrices ? 1 : 0,
      });
    }

    setInfoBoxes(
      Object.fromEntries(
        Object.values(Town).map((key) => [key, showHeatmapPrices])
      )
    );
  }, [showHeatmapPrices, polygons]);

  const handleYearBlur = () => {
    if (Number.isNaN(year) || year < 1990) {
      dispatch(setYear(1990));
    } else if (year > currentYear) {
      dispatch(setYear(currentYear));
    }
  };

  const handlePolygonMouseOver = (townName: string) => {
    if (!showHeatmapPrices) {
      polygons[townName as Town]?.setOptions({
        fillOpacity: 0.4,
        strokeOpacity: 1,
      });
      setInfoBoxes((prevInfoBoxes) => ({
        ...prevInfoBoxes,
        [townName]: true,
      }));
    }
  };

  const handlePolygonMouseOut = (townName: string) => {
    if (!showHeatmapPrices) {
      polygons[townName as Town]?.setOptions({
        fillOpacity: 0,
        strokeOpacity: 0,
      });
      setInfoBoxes((prevInfoBoxes) => ({
        ...prevInfoBoxes,
        [townName]: false,
      }));
    }
  };

  return isLoaded ? (
    <Container
      sx={{
        position: 'relative',
        height: (theme) => ({
          xs: `calc(100vh - ${theme.spacing(7)})`,
          sm: `calc(100vh - ${theme.spacing(8)})`,
        }),
        p: {
          xs: 0,
          sm: 0,
        },
        maxWidth: {
          lg: 'none',
        },
      }}
    >
      <GoogleMap
        mapContainerStyle={{ height: '100%' }}
        options={mapOptions}
        onLoad={setMap}
      >
        <TransitLayer />
        {showHeatmap && (
          <HeatmapLayer data={heatmapData} options={heatmapLayerOptions} />
        )}
        {town === 'Islandwide' &&
          Object.entries(townBoundaries).map(([townName, paths]) => (
            <Fragment key={townName}>
              <Polygon
                paths={paths}
                options={polygonOptions}
                onLoad={(polygon) =>
                  setPolygons((prevPolygons) => ({
                    ...prevPolygons,
                    [townName]: polygon,
                  }))
                }
                onMouseOver={() => handlePolygonMouseOver(townName)}
                onMouseOut={() => handlePolygonMouseOut(townName)}
                onClick={() => dispatch(setTown(townName as Town))}
              />
              <InfoBox
                position={townCoordinates[townName as Town]}
                options={{
                  ...infoBoxOptions,
                  visible: infoBoxes[townName as Town],
                }}
              >
                <Card
                  sx={{
                    backgroundColor: darkMode
                      ? 'rgba(18, 18, 18, 0.8)'
                      : 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    m: '-25% 50% 0 -50%',
                  }}
                >
                  <CardContent
                    sx={{ p: (theme) => `${theme.spacing(1)} !important` }}
                  >
                    <Typography variant="subtitle2">{townName}</Typography>
                    <Typography variant="caption">
                      {formatPrice(
                        islandHeatmap?.find((point) => point.town === townName)
                          ?.resalePrice
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </InfoBox>
            </Fragment>
          ))}
      </GoogleMap>
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
            renderInput={(params) => <TextField label="Town" {...params} />}
            value={town}
            onChange={(_, value) =>
              dispatch(setTown(value as Town | 'Islandwide'))
            }
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
              <CardContent sx={{ p: '12px !important' }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" gutterBottom>
                    {town === 'Islandwide'
                      ? currencyFormatter.format(
                          Math.min(
                            ...(islandHeatmap?.map(
                              (point) => point.resalePrice
                            ) ?? [])
                          )
                        )
                      : currencyFormatter.format(
                          Math.min(
                            ...(townHeatmap?.map(
                              (point) => point.resalePrice
                            ) ?? [])
                          )
                        )}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    {town === 'Islandwide'
                      ? currencyFormatter.format(
                          Math.max(
                            ...(islandHeatmap?.map(
                              (point) => point.resalePrice
                            ) ?? [])
                          )
                        )
                      : currencyFormatter.format(
                          Math.max(
                            ...(townHeatmap?.map(
                              (point) => point.resalePrice
                            ) ?? [])
                          )
                        )}
                  </Typography>
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
    </Container>
  ) : (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: (theme) => ({
          xs: `calc(100vh - ${theme.spacing(7)})`,
          sm: `calc(100vh - ${theme.spacing(8)})`,
        }),
      }}
    >
      <CircularProgress />
    </Container>
  );
};

export default Heatmap;
