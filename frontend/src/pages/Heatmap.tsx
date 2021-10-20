import { CircularProgress, Container } from '@mui/material';
import { useJsApiLoader } from '@react-google-maps/api';
import { UseLoadScriptOptions } from '@react-google-maps/api/src/useJsApiLoader';

import Map from '../components/heatmap/Map';

const apiOptions: UseLoadScriptOptions = {
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  libraries: ['geometry', 'places', 'visualization'],
};

const Heatmap = () => {
  const { isLoaded } = useJsApiLoader(apiOptions);

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
      <Map />
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
