import { useState } from 'react';
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
  StandaloneSearchBox,
  useJsApiLoader,
} from '@react-google-maps/api';
import { UseLoadScriptOptions } from '@react-google-maps/api/src/useJsApiLoader';

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
  googleMapsApiKey: 'AIzaSyAG6A2F0zMMHkLByBzBe0SUGeO8r8ICWEY',
  libraries: ['places', 'visualization'],
};

const mapOptions: google.maps.MapOptions = {
  center: {
    lat: 1.352083,
    lng: 103.819836,
  },
  clickableIcons: false,
  disableDefaultUI: true,
  zoom: 12,
};

const heatmapLayerOptions: google.maps.visualization.HeatmapLayerOptions = {
  dissipating: false,
  radius: 0.05,
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
  const [town, setTown] = useState<Town | 'Islandwide'>('Islandwide');
  const [year, setYear] = useState(currentYear);

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
    if (year < 1990) {
      setYear(1990);
    } else if (year > currentYear) {
      setYear(currentYear);
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
        onBoundsChanged={() => searchBox?.setBounds(map?.getBounds() ?? null)}
        onLoad={setMap}
      >
        <HeatmapLayer
          data={[
            {
              location: new google.maps.LatLng({
                lat: 1.352083,
                lng: 103.819836,
              }),
              weight: 1,
            },
            {
              location: new google.maps.LatLng({
                lat: 1.452083,
                lng: 103.819836,
              }),
              weight: 1,
            },
            {
              location: new google.maps.LatLng({
                lat: 1.252083,
                lng: 103.819836,
              }),
              weight: 1,
            },
            {
              location: new google.maps.LatLng({
                lat: 1.352083,
                lng: 103.719836,
              }),
              weight: 1,
            },
            {
              location: new google.maps.LatLng({
                lat: 1.352083,
                lng: 103.919836,
              }),
              weight: 1,
            },
          ]}
          options={heatmapLayerOptions}
        />
      </GoogleMap>
      <ThemeProvider theme={mapTheme}>
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
      </ThemeProvider>
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
