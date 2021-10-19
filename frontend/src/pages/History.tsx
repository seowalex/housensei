import {
  Button,
  ButtonGroup,
  Container,
  Grid,
  LinearProgress,
  Paper,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ChartMode } from '../types/history';
import GroupList from '../components/history/GroupList';
import HistoryChart from '../components/history/HistoryChart';
import { useAppSelector } from '../app/hooks';
import { selectGroups, selectIsLoadingChartData } from '../reducers/history';

const History = () => {
  const groups = useAppSelector(selectGroups);
  const isLoadingChart = useAppSelector(selectIsLoadingChartData);

  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(
    undefined
  );
  const [chartMode, setChartMode] = useState<ChartMode>(ChartMode.Monthly);
  const [showLoadingBar, setShowLoadingBar] = useState<boolean>(false);

  useEffect(() => {
    if (isLoadingChart) {
      setShowLoadingBar(isLoadingChart);
    } else {
      setTimeout(() => setShowLoadingBar(isLoadingChart), 1000);
    }
  }, [isLoadingChart]);

  const handleChangeSelectedGroup = (id: string) => (isExpanded: boolean) => {
    setSelectedGroup(isExpanded ? id : undefined);
  };

  return (
    <Container sx={{ p: 3 }}>
      <Stack>
        <Paper sx={{ p: '1rem' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <HistoryChart
                chartMode={chartMode}
                selectedGroup={selectedGroup}
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
                />
                {groups.filter((group) => group.type === 'resale').length >
                  0 && (
                  <ButtonGroup>
                    <Button
                      variant={
                        chartMode === ChartMode.Monthly
                          ? 'contained'
                          : 'outlined'
                      }
                      onClick={() => setChartMode(ChartMode.Monthly)}
                    >
                      Monthly
                    </Button>
                    <Button
                      variant={
                        chartMode === ChartMode.Yearly
                          ? 'contained'
                          : 'outlined'
                      }
                      onClick={() => setChartMode(ChartMode.Yearly)}
                    >
                      Yearly
                    </Button>
                  </ButtonGroup>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
        {showLoadingBar && <LinearProgress />}
      </Stack>
    </Container>
  );
};

export default History;
