import { ExpandMoreRounded as ExpandMoreRoundedIcon } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppSelector } from '../../app/hooks';
import { selectHistories } from '../../reducers/history';

const GraphContainer = () => {
  const histories = useAppSelector(selectHistories);
  const [expandedGroup, setExpandedGroup] = useState<number | undefined>(
    undefined
  );

  const data = [
    {
      date: '2018-01',
      a: 100000,
      b: 200000,
    },
    {
      date: '2019-01',
      a: 200000,
      b: 300000,
    },
    {
      date: '2020-01',
      a: 300000,
      b: 100000,
    },
    {
      date: '2021-01',
      a: 350000,
      b: 150000,
    },
  ];

  const handleChangeGroup =
    (index: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedGroup(isExpanded ? index : undefined);
    };

  const graph = (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        data={data}
        height={300}
        margin={{ left: 30, bottom: 10, right: 10 }}
      >
        <CartesianGrid />
        <XAxis dataKey="date">
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
        <Tooltip />
        <Line type="monotone" dataKey="a" stroke="#8884d8" />
        <Line type="monotone" dataKey="b" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );

  const legend = (
    <Stack spacing={0}>
      <Accordion expanded={expandedGroup === 0} onChange={handleChangeGroup(0)}>
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
          <Typography>Group 1</Typography>
        </AccordionSummary>
        <AccordionDetails />
      </Accordion>
    </Stack>
  );

  return (
    <Paper sx={{ p: '1rem' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {graph}
          {/* <Box sx={{ p: '1rem' }}></Box> */}
        </Grid>
        <Grid item xs={12} md={4}>
          {legend}
          {/* <Box sx={{ p: '1rem' }}></Box> */}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GraphContainer;
