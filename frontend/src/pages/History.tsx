import { Container, Grid, Paper } from '@mui/material';
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
  selectChartData,
  selectGroups,
} from '../reducers/history';

const History = () => {
  const groups = useAppSelector(selectGroups);
  const chartData = useAppSelector(selectChartData);
  const btoProjects = useAppSelector(selectBTOProjectsRecord);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(
    undefined
  );
  const [projectsState, setProjectsState] = useState<
    Record<string, BTOProject[]>
  >({});

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

  const handleChangeSelectedGroup =
    (id: string) => (event: SyntheticEvent, isExpanded: boolean) => {
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
        margin={{ top: 20, left: 30, bottom: 10, right: 10 }}
      >
        <CartesianGrid />
        <XAxis dataKey="date" tick={chartData.length > 0}>
          <Label value="Year" position="insideBottom" offset={-10} />
        </XAxis>
        <YAxis>
          <Label
            value="Average Price (SGD)"
            position="insideLeft"
            angle={-90}
            offset={-20}
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <ChartTooltip />
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
          />
        ))}
        {groups.map(({ id, color }) => (
          <>
            {projectsState[id] &&
              projectsState[id].map(({ name, price }) => (
                <ReferenceLine
                  y={price}
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  ifOverflow="extendDomain"
                >
                  <Label position="insideLeft" value={price} />
                  <Label position="insideRight" value={name} />
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
            <GroupList
              selectedGroup={selectedGroup}
              onChangeSelectedGroup={handleChangeSelectedGroup}
              projectsState={projectsState}
              onChangeProject={handleChangeProject}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default History;
