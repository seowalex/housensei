import { Container } from '@mui/material';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { UseLoadScriptOptions } from '@react-google-maps/api/src/useJsApiLoader';

const apiOptions: UseLoadScriptOptions = {
  googleMapsApiKey: 'AIzaSyAG6A2F0zMMHkLByBzBe0SUGeO8r8ICWEY',
};

const mapOptions: google.maps.MapOptions = {
  center: {
    lat: 1.352083,
    lng: 103.819836,
  },
  clickableIcons: false,
  disableDefaultUI: true,
  restriction: {
    latLngBounds: {
      east: 104.04388,
      north: 1.478151,
      south: 1.207829,
      west: 103.598538,
    },
  },
  zoom: 0,
};

const Heatmap = () => {
  const { isLoaded } = useJsApiLoader(apiOptions);

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
      <GoogleMap mapContainerStyle={{ height: '100%' }} options={mapOptions} />
    </Container>
  ) : null;
};

export default Heatmap;
