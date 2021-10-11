import {
  Button,
  ButtonGroup,
  Container,
  Grid,
  Paper,
  Stack,
} from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { BTOProject, ChartMode } from '../types/history';
import GroupList from '../components/history/GroupList';
import { selectBTOProjectsRecord } from '../reducers/history';
import HistoryChart from '../components/history/HistoryChart';

const History = () => {
  const btoProjects = useAppSelector(selectBTOProjectsRecord);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(
    undefined
  );
  const [projectsState, setProjectsState] = useState<
    Record<string, BTOProject[]>
  >({});
  const [chartMode, setChartMode] = useState<ChartMode>(ChartMode.Monthly);

  useEffect(() => {
    setProjectsState((s) => {
      const prevState = { ...s };
      const btoProjectIds = Object.keys(btoProjects);
      const removedIds = Object.keys(prevState).filter(
        (id) => !btoProjectIds.includes(id)
      );
      removedIds.forEach((id) => {
        delete prevState[id];
      });
      btoProjectIds.forEach((id) => {
        prevState[id] = [];
      });

      return prevState;
    });
  }, [btoProjects]);

  const handleChangeSelectedGroup = (id: string) => (isExpanded: boolean) => {
    setSelectedGroup(isExpanded ? id : undefined);
  };

  const handleChangeProject =
    (id: string) => (event: SyntheticEvent, value: BTOProject[]) => {
      setProjectsState({ ...projectsState, [id]: value });
    };

  return (
    <Container sx={{ p: 3 }}>
      <Paper sx={{ p: '1rem' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <HistoryChart
              chartMode={chartMode}
              selectedGroup={selectedGroup}
              projectsState={projectsState}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack
              alignItems="center"
              justifyContent="space-between"
              sx={{ height: '100%' }}
            >
              <GroupList
                selectedGroup={selectedGroup}
                onChangeSelectedGroup={handleChangeSelectedGroup}
                projectsState={projectsState}
                onChangeProject={handleChangeProject}
              />
              <ButtonGroup>
                <Button
                  variant={
                    chartMode === ChartMode.Monthly ? 'contained' : 'outlined'
                  }
                  onClick={() => setChartMode(ChartMode.Monthly)}
                >
                  Monthly
                </Button>
                <Button
                  variant={
                    chartMode === ChartMode.Yearly ? 'contained' : 'outlined'
                  }
                  onClick={() => setChartMode(ChartMode.Yearly)}
                >
                  Yearly
                </Button>
              </ButtonGroup>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default History;
