import { useState } from 'react';
import {
  Autocomplete,
  CircularProgress,
  Container,
  Grid,
  TextField,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  GoogleMap,
  HeatmapLayer,
  StandaloneSearchBox,
  useJsApiLoader,
} from '@react-google-maps/api';
import { UseLoadScriptOptions } from '@react-google-maps/api/src/useJsApiLoader';

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

const Heatmap = () => {
  const { google } = window;
  const { isLoaded } = useJsApiLoader(apiOptions);
  const [map, setMap] = useState<google.maps.Map>();
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const heatmapData = google
    ? [
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
      ]
    : [];

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

  return isLoaded ? (
    <Container
      sx={{
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
        <HeatmapLayer data={heatmapData} options={heatmapLayerOptions} />
        <ThemeProvider theme={mapTheme}>
          <Grid container spacing={2} sx={{ p: 2 }}>
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
                options={['Islandwide', 'Ang Mo Kio', 'Yishun']}
                renderInput={(params) => <TextField label="Town" {...params} />}
                defaultValue="Islandwide"
                blurOnSelect
                disableClearable
              />
            </Grid>
          </Grid>
        </ThemeProvider>
      </GoogleMap>
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
