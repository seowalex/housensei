import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  OutlinedInput,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
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
import { Settings as SettingsIcon } from '@mui/icons-material';

import { useAppSelector } from '../app/hooks';
import { selectDarkMode } from '../reducers/settings';
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
} from '../app/constants';
import { Town } from '../types/towns';
import { mapTownToRegion } from '../utils/towns';

const apiOptions: UseLoadScriptOptions = {
  googleMapsApiKey,
  libraries: ['places', 'visualization'],
};

const infoBoxOptions: InfoBoxOptions = {
  boxStyle: {
    overflow: 'visible',
  },
  closeBoxURL: '',
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

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const darkMode = useAppSelector(selectDarkMode) ?? prefersDarkMode;

  const [map, setMap] = useState<google.maps.Map>();
  const [polygons, setPolygons] = useState<{
    [K in Town]?: google.maps.Polygon;
  }>({});
  const [infoBoxes, setInfoBoxes] = useState<{
    [K in Town]?: boolean;
  }>({});

  const [town, setTown] = useState<Town | 'Islandwide'>('Islandwide');
  const [year, setYear] = useState(currentYear);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
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
    if (showOverlay) {
      for (const polygon of Object.values(polygons)) {
        polygon?.setOptions({
          fillOpacity: 0.4,
          strokeOpacity: 1,
        });
      }

      setInfoBoxes((prevInfoBoxes) =>
        Object.fromEntries(Object.keys(prevInfoBoxes).map((key) => [key, true]))
      );
    } else {
      for (const polygon of Object.values(polygons)) {
        polygon?.setOptions({
          fillOpacity: 0,
          strokeOpacity: 0,
        });
      }

      setInfoBoxes((prevInfoBoxes) =>
        Object.fromEntries(
          Object.keys(prevInfoBoxes).map((key) => [key, false])
        )
      );
    }
  }, [showOverlay, polygons]);

  const handleYearBlur = () => {
    if (Number.isNaN(year) || year < 1990) {
      setYear(1990);
    } else if (year > currentYear) {
      setYear(currentYear);
    }
  };

  const handlePolygonMouseOver = (townName: string) => {
    if (!showOverlay) {
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
    if (!showOverlay) {
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
        height: {
          xs: 'calc(100vh - 56px)',
          sm: 'calc(100vh - 64px)',
        },
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
        {Object.entries(townBoundaries).map(([townName, paths]) => (
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
              onClick={() => setTown(townName as Town)}
              visible={town === 'Islandwide'}
            />
            <InfoBox
              position={townCoordinates[townName as Town]}
              options={{
                ...infoBoxOptions,
                visible: town === 'Islandwide' && infoBoxes[townName as Town],
              }}
              onLoad={() =>
                setInfoBoxes((prevInfoBoxes) => ({
                  ...prevInfoBoxes,
                  [townName]: false,
                }))
              }
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
                <CardContent sx={{ p: '8px !important' }}>
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
              Object.values(Town).sort((left, right) => {
                const leftTown = mapTownToRegion(left);
                const rightTown = mapTownToRegion(right);
                if (leftTown.localeCompare(rightTown) === 0) {
                  return left.localeCompare(right);
                }
                return leftTown.localeCompare(rightTown);
              })
            )}
            groupBy={(option) => {
              if (option === 'Islandwide') {
                return '';
              }
              return mapTownToRegion(option as Town);
            }}
            renderInput={(params) => <TextField label="Town" {...params} />}
            value={town}
            onChange={(_, value) => setTown(value as Town | 'Islandwide')}
            blurOnSelect
            disableClearable
            sx={{
              width: {
                xs: '100%',
                md: 200,
              },
              pointerEvents: 'auto',
              '.MuiInputBase-root': {
                backgroundColor: darkMode ? '#121212' : '#fff',
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
            }}
          >
            <CardContent sx={{ pb: '8px !important' }}>
              <Grid container columnSpacing={2}>
                <Grid item xs={12}>
                  <Typography gutterBottom>Year</Typography>
                </Grid>
                <Grid item xs>
                  <Box sx={{ px: 2 }}>
                    <Slider
                      min={1990}
                      max={currentYear}
                      marks={yearMarks}
                      value={year}
                      onChange={(_, value) => setYear(value as number)}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Grid>
                <Grid item>
                  <OutlinedInput
                    value={year}
                    size="small"
                    onChange={(event) =>
                      setYear(parseInt(event.target.value, 10))
                    }
                    onBlur={handleYearBlur}
                    inputProps={{
                      min: 1990,
                      max: currentYear,
                      type: 'number',
                    }}
                  />
                </Grid>
              </Grid>
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
          <Dialog open={showSettings} onClose={() => setShowSettings(false)}>
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showHeatmap}
                      onChange={(event) => setShowHeatmap(event.target.checked)}
                    />
                  }
                  label="Show heatmap"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={showOverlay}
                      onChange={(event) => setShowOverlay(event.target.checked)}
                    />
                  }
                  label="Show towns/prices"
                />
              </FormGroup>
            </DialogContent>
          </Dialog>
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
        height: {
          xs: 'calc(100vh - 56px)',
          sm: 'calc(100vh - 64px)',
        },
      }}
    >
      <CircularProgress />
    </Container>
  );
};

export default Heatmap;
