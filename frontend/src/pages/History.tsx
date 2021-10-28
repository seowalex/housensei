import { Container, Grid, LinearProgress, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import GroupList from '../components/history/GroupList';
import HistoryChart from '../components/history/HistoryChart';
import { useAppSelector } from '../app/hooks';
import { selectGroups, selectIsLoadingChartData } from '../reducers/history';

const History = () => {
  const isLoadingChart = useAppSelector(selectIsLoadingChartData);

  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(
    undefined
  );
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
        {showLoadingBar && <LinearProgress />}
        <Paper sx={{ p: '1rem' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8} data-tour="history-chart">
              <HistoryChart selectedGroup={selectedGroup} />
            </Grid>
            <Grid item xs={12} md={4}>
              <GroupList
                selectedGroup={selectedGroup}
                onChangeSelectedGroup={handleChangeSelectedGroup}
              />
            </Grid>
          </Grid>
        </Paper>
      </Stack>
    </Container>
  );
};

export default History;
