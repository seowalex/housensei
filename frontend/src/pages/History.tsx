import { Container } from '@mui/material';
import GroupForm from '../components/history/GroupForm';
import GroupList from '../components/history/GroupList';

const History = () => (
  <Container sx={{ p: 3 }}>
    <GroupForm />
  </Container>
);

export default History;
