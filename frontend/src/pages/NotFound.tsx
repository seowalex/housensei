import { useHistory } from 'react-router-dom';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import SadGhost from '../components/common/SadGhost';

const NotFound = () => {
  const history = useHistory();

  return (
    <Container
      sx={{
        height: {
          xs: 'calc(100vh - 56px)',
          sm: 'calc(100vh - 64px)',
        },
        p: 3,
      }}
    >
      <Stack justifyContent="center" sx={{ height: '100%' }}>
        <Box sx={{ textAlign: 'center', my: 2 }}>
          <SadGhost />
        </Box>
        <Typography variant="h1" align="center">
          404
        </Typography>
        <Typography component="h2" variant="h4" align="center">
          Sorry!
        </Typography>
        <Typography align="center">
          The page you&apos;re looking for was not found.
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          spacing={1}
          sx={{ my: 3 }}
        >
          <Button variant="outlined" onClick={history.goBack}>
            Go back
          </Button>
          <Button variant="contained" href="/">
            Go to home page
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default NotFound;
