import { useState } from 'react';
import { Container, TextField } from '@mui/material';
import {
  GoogleMap,
  StandaloneSearchBox,
  useJsApiLoader,
} from '@react-google-maps/api';
import { UseLoadScriptOptions } from '@react-google-maps/api/src/useJsApiLoader';

const apiOptions: UseLoadScriptOptions = {
  googleMapsApiKey: 'AIzaSyAG6A2F0zMMHkLByBzBe0SUGeO8r8ICWEY',
  libraries: ['places'],
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

const Heatmap = () => {
  const { isLoaded } = useJsApiLoader(apiOptions);
  const [map, setMap] = useState<google.maps.Map>();
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();

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
      />
      <StandaloneSearchBox
        onPlacesChanged={setMapViewport}
        onLoad={setSearchBox}
      >
        <TextField
          variant="outlined"
          placeholder="Search..."
          sx={{
            position: 'absolute',
            top: 0,
            p: 2,
            width: {
              xs: '100%',
              md: 400,
            },
            '.MuiInputBase-root': {
              backgroundColor: '#fff',
              color: 'rgba(0, 0, 0, 0.87)',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.87)',
              },
            },
          }}
        />
      </StandaloneSearchBox>
    </Container>
  ) : null;
};

export default Heatmap;
