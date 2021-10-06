import { Container, Grid } from '@mui/material';
import GroupContainer from '../components/groups/GroupContainer';
import GraphContainer from '../components/history/GraphContainer';

const History = () => (
  <Container sx={{ p: 3 }}>
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <GroupContainer />
      </Grid>
      <Grid item>
        <GraphContainer />
      </Grid>
    </Grid>
  </Container>
);

export default History;
