import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { Ghost } from 'react-kawaii';

const NotFound = () => {
  const history = useHistory();
  const theme = useTheme();

  const colors = [
    theme.palette.primary.light,
    theme.palette.secondary.light,
    theme.palette.error.light,
    theme.palette.warning.light,
    theme.palette.info.light,
    theme.palette.success.light,
  ];

  return (
    <Container sx={{ height: 'calc(100vh - 64px)', p: 3 }}>
      <Stack justifyContent="center" sx={{ height: '100%' }}>
        <Box sx={{ textAlign: 'center', my: 2 }}>
          <Ghost
            size={200}
            mood="sad"
            color={colors[Math.floor(Math.random() * colors.length)]}
          />
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
