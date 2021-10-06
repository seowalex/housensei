import { Fragment, useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  OutlinedInput,
  Slider,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import {
  GoogleMap,
  HeatmapLayer,
  InfoBox,
  Polygon,
  StandaloneSearchBox,
  TransitLayer,
  useJsApiLoader,
} from '@react-google-maps/api';
import { UseLoadScriptOptions } from '@react-google-maps/api/src/useJsApiLoader';
import { InfoBoxOptions } from '@react-google-maps/infobox';

import { useDebounce } from '../app/utils';
import {
  googleMapsApiKey,
  singaporeCoordinates,
  townBoundaries,
  townCoordinates,
} from '../app/constants';
import { Town } from '../app/types';

const mapTheme = createTheme({
  components: {
    MuiFormControl: {
      defaultProps: {
        sx: {
          width: {
            xs: '100%',
            md: 400,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
        },
      },
    },
  },
});

const apiOptions: UseLoadScriptOptions = {
  googleMapsApiKey,
  libraries: ['places', 'visualization'],
};

const mapOptions: google.maps.MapOptions = {
  center: singaporeCoordinates,
  clickableIcons: false,
  disableDefaultUI: true,
  zoom: 12,
};

const heatmapLayerOptions: google.maps.visualization.HeatmapLayerOptions = {
  dissipating: false,
  radius: 0.03,
};

const polygonOptions: google.maps.PolygonOptions = {
  fillColor: '#ef5350',
  fillOpacity: 0,
  strokeColor: '#d32f2f',
  strokeWeight: 2,
  strokeOpacity: 0,
};

const infoBoxOptions: InfoBoxOptions = {
  boxStyle: {
    overflow: 'visible',
  },
  closeBoxURL: '',
  enableEventPropagation: true,
  visible: false,
};

const currentYear = new Date().getFullYear();

const yearMarks = [
  ...Array(Math.floor((currentYear - 1990) / 10) + 1).keys(),
].map((i) => {
  const value = 1990 + i * 10;

  return { value, label: value.toString() };
});

const Heatmap = () => {
  const { google } = window;
  const { isLoaded } = useJsApiLoader(apiOptions);

  const [map, setMap] = useState<google.maps.Map>();
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const [polygons, setPolygons] = useState<{
    [K in Town]?: google.maps.Polygon;
  }>({});
  const [infoBoxes, setInfoBoxes] = useState<{
    [K in Town]?: boolean;
  }>({});
  const [town, setTown] = useState<Town | 'Islandwide'>('Islandwide');
  const [year, setYear] = useState(currentYear);

  const debouncedYear = useDebounce(year, 500);

  useEffect(() => {
    map?.setCenter(townCoordinates[town as Town] ?? singaporeCoordinates);
    map?.setZoom(town === 'Islandwide' ? 12 : 15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [town]);

  const setMapViewport = () => {
    if (!map || !searchBox) {
      return;
    }

    const places = searchBox.getPlaces();

    if (places?.length === 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    places?.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        return;
      }

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    map.fitBounds(bounds);
  };

  const handleYearBlur = () => {
    if (Number.isNaN(year) || year < 1990) {
      setYear(1990);
    } else if (year > currentYear) {
      setYear(currentYear);
    }
  };

  const handlePolygonMouseOver = (townName: string) => {
    polygons[townName as Town]?.setOptions({
      fillOpacity: 0.4,
      strokeOpacity: 1,
    });
    setInfoBoxes((prevInfoBoxes) => ({
      ...prevInfoBoxes,
      [townName]: true,
    }));
  };

  const handlePolygonMouseOut = (townName: string) => {
    polygons[townName as Town]?.setOptions({
      fillOpacity: 0,
      strokeOpacity: 0,
    });
    setInfoBoxes((prevInfoBoxes) => ({
      ...prevInfoBoxes,
      [townName]: false,
    }));
  };

  return isLoaded ? (
    <ThemeProvider theme={mapTheme}>
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
          onBoundsChanged={() => searchBox?.setBounds(map?.getBounds() ?? null)}
          onLoad={setMap}
        >
          <TransitLayer />
          <HeatmapLayer
            data={Object.values(townCoordinates).map(
              (coordinates: google.maps.LatLngLiteral) => ({
                location: new google.maps.LatLng(coordinates),
                weight: Math.random(),
              })
            )}
            options={heatmapLayerOptions}
          />
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
                  visible:
                    town === 'Islandwide' &&
                    (infoBoxes[townName as Town] ?? false),
                }}
              >
                <Card
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    m: '-25% 50% 0 -50%',
                  }}
                >
                  <CardContent sx={{ p: '8px !important' }}>
                    <Typography variant="subtitle2">{townName}</Typography>
                    <Typography variant="caption">S$123,456</Typography>
                  </CardContent>
                </Card>
              </InfoBox>
            </Fragment>
          ))}
        </GoogleMap>
        <Grid container spacing={2} sx={{ position: 'absolute', top: 0, p: 2 }}>
          <Grid item xs={12} md="auto">
            <StandaloneSearchBox
              onPlacesChanged={setMapViewport}
              onLoad={setSearchBox}
            >
              <TextField placeholder="Search..." />
            </StandaloneSearchBox>
          </Grid>
          <Grid item xs={12} md="auto">
            <Autocomplete
              options={['Islandwide'].concat(
                Object.values(Town).sort((a, b) => a.localeCompare(b))
              )}
              renderInput={(params) => <TextField label="Town" {...params} />}
              value={town}
              onChange={(_, value) => setTown(value as Town | 'Islandwide')}
              blurOnSelect
              disableClearable
            />
          </Grid>
          <Grid item xs={12} md="auto">
            <Card
              sx={{
                width: {
                  xs: '100%',
                  md: 600,
                },
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
        </Grid>
      </Container>
    </ThemeProvider>
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
