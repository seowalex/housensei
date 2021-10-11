import {
  Button,
  ButtonGroup,
  Container,
  Grid,
  Paper,
  Stack,
} from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppSelector } from '../app/hooks';
import { BTOProject } from '../types/history';
import GroupList from '../components/history/GroupList';
import {
  selectBTOProjectsRecord,
  selectMonthlyChartData,
  selectGroups,
  selectYearlyChartData,
} from '../reducers/history';
import { formatDate, formatPrice } from '../utils/history';
import { convertFlatTypeToFrontend } from '../utils/groups';

enum ChartMode {
  Monthly,
  Yearly,
}

const History = () => {
  const groups = useAppSelector(selectGroups);
  const monthlyChartData = useAppSelector(selectMonthlyChartData);
  const yearlyChartData = useAppSelector(selectYearlyChartData);
  const btoProjects = useAppSelector(selectBTOProjectsRecord);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(
    undefined
  );
  const [projectsState, setProjectsState] = useState<
    Record<string, BTOProject[]>
  >({});
  const [chartMode, setChartMode] = useState<ChartMode>(ChartMode.Monthly);
  const chartData =
    chartMode === ChartMode.Monthly ? monthlyChartData : yearlyChartData;

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

  const graph = (
    <ResponsiveContainer width="100%" height={650}>
      <LineChart
        data={chartData}
        height={300}
        margin={{ top: 20, left: 20, bottom: 10, right: 10 }}
      >
        <CartesianGrid />
        <XAxis
          dataKey="date"
          tick={chartData.length > 0}
          tickFormatter={
            chartMode === ChartMode.Monthly ? formatDate : undefined
          }
        >
          <Label
            value={chartMode === ChartMode.Monthly ? 'Month' : 'Year'}
            position="insideBottom"
            offset={-10}
          />
        </XAxis>
        <YAxis tickFormatter={(value, index) => formatPrice(value)}>
          <Label
            value="Average Price (SGD)"
            position="insideLeft"
            angle={-90}
            offset={-10}
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <ChartTooltip
          labelFormatter={
            chartMode === ChartMode.Monthly ? formatDate : undefined
          }
        />
        {groups.map(({ id, name, color }) => (
          <Line
            type="linear"
            key={name}
            dataKey={name}
            stroke={
              selectedGroup !== id && selectedGroup != null
                ? `${color}88`
                : color
            }
            strokeWidth={selectedGroup === id ? 3 : 2}
            connectNulls
            dot={false}
          />
        ))}
        {groups.map(({ id, color }) => (
          <>
            {projectsState[id] &&
              projectsState[id].map(({ name, price, flatType }) => (
                <ReferenceLine
                  y={price}
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  ifOverflow="extendDomain"
                >
                  <Label position="insideLeft" value={price} />
                  <Label
                    position="insideRight"
                    value={`${name} (${convertFlatTypeToFrontend(flatType)})`}
                  />
                </ReferenceLine>
              ))}
          </>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <Container sx={{ p: 3 }}>
      <Paper sx={{ p: '1rem' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            {graph}
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
