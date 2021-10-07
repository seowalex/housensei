import {
  Circle as CircleIcon,
  ExpandMoreRounded as ExpandMoreRoundedIcon,
  VisibilityOffRounded as VisibilityOffRoundedIcon,
  VisibilityRounded as VisibilityRoundedIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Card,
  CardContent,
  Grid,
  IconButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/system';
import { SyntheticEvent, useState } from 'react';
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
import { useAppSelector } from '../../app/hooks';
import { selectHistories } from '../../reducers/history';
import { GroupColor } from '../../types/groups';
import { BTOProject, ChartDataPoint, PriceHistory } from '../../types/history';
import { FlatType, Town } from '../../types/property';
import GroupDetails from '../groups/GroupDetails';

const getInitialProjectsState = (histories: PriceHistory[]): BTOProject[][] =>
  histories.map((history) => []);

const GraphContainer = () => {
  const histories: PriceHistory[] = [
    {
      group: {
        name: 'a',
        color: GroupColor.Color1,
        filters: {
          towns: [Town.AMK, Town.BDK],
          flatTypes: [FlatType.ROOM_4, FlatType.ROOM_5],
          minStorey: 10,
          maxStorey: 15,
          startYear: 2010,
          endYear: 2015,
        },
      },
      history: [],
      projects: [
        {
          name: 'ABC',
          price: 50000,
          date: '2015-03',
        },
        {
          name: 'DEF',
          price: 150000,
          date: '2015-03',
        },
        {
          name: 'GHI',
          price: 250000,
          date: '2015-03',
        },
        {
          name: 'JKL',
          price: 350000,
          date: '2015-03',
        },
      ],
    },
    {
      group: {
        name: 'b',
        color: GroupColor.Color2,
        filters: {
          towns: [Town.PSR],
          flatTypes: [FlatType.ROOM_3],
          minLeasePeriod: 70,
          maxLeasePeriod: 99,
          startYear: 2010,
          endYear: 2015,
        },
      },
      history: [],
      projects: [
        {
          name: 'ABC',
          price: 50000,
          date: '2015-03',
        },
        {
          name: 'DEF',
          price: 150000,
          date: '2015-03',
        },
        {
          name: 'GHI',
          price: 250000,
          date: '2015-03',
        },
        {
          name: 'JKL',
          price: 550000,
          date: '2015-03',
        },
      ],
    },
  ];
  const historie = useAppSelector(selectHistories);
  const theme = useTheme();
  const [expandedGroup, setExpandedGroup] = useState<number | undefined>(
    undefined
  );
  const [projectsState, setProjectsState] = useState<BTOProject[][]>(
    getInitialProjectsState(histories)
  );

  const data: ChartDataPoint[] = [
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
    (index: number) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpandedGroup(isExpanded ? index : undefined);
    };

  const handleChangeProject =
    (index: number) => (event: SyntheticEvent, value: BTOProject[]) => {
      setProjectsState((state) => [
        ...state.slice(0, index),
        value,
        ...state.slice(index + 1),
      ]);
    };

  const graph = (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        data={data}
        height={300}
        margin={{ top: 20, left: 30, bottom: 10, right: 10 }}
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
        <ChartTooltip />
        {histories.map(({ group }, index) => (
          <Line
            type="linear"
            key={group.name}
            dataKey={group.name}
            stroke={
              expandedGroup === undefined || expandedGroup === index
                ? group.color
                : `${group.color}88`
            }
            strokeWidth={expandedGroup === index ? 3 : 2}
          />
        ))}
        {histories.map(({ group }, index) => (
          <>
            {expandedGroup === index &&
              projectsState[index].map(({ name, price, date }) => (
                <ReferenceLine
                  y={price}
                  stroke={group.color}
                  strokeWidth={2}
                  strokeDasharray="3 3"
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

  const legend = (
    <Stack spacing={0}>
      {histories.map((history, index) => {
        const { group, projects } = history;
        return (
          <Accordion
            expanded={expandedGroup === index}
            onChange={handleChangeGroup(index)}
            elevation={2}
          >
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
              <Stack direction="row" spacing={1}>
                <CircleIcon sx={{ fill: group.color }} />
                <Typography>{group.name}</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Card elevation={3}>
                  <CardContent>
                    <Stack spacing={0.5}>
                      <Typography align="center" color="text.secondary">
                        Filters
                      </Typography>
                      <GroupDetails filters={group.filters} />
                    </Stack>
                  </CardContent>
                </Card>
                <Card elevation={3}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography align="center" color="text.secondary">
                        Relevant BTO Projects
                      </Typography>
                      <Autocomplete
                        onChange={handleChangeProject(index)}
                        value={projectsState[index]}
                        multiple
                        size="small"
                        disableCloseOnSelect
                        options={projects}
                        renderOption={(props, option, { selected }) => (
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          <li {...props}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ width: '100%' }}
                            >
                              <ListItemText
                                primary={option.name}
                                secondary={option.price}
                              />
                              {selected ? (
                                <VisibilityRoundedIcon fontSize="small" />
                              ) : (
                                <VisibilityOffRoundedIcon fontSize="small" />
                              )}
                            </Stack>
                          </li>
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.name === value.name &&
                          option.date === value.date
                        }
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="BTO"
                            placeholder="Enter a BTO project name"
                          />
                        )}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );

  return (
    <Paper sx={{ p: '1rem' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {graph}
        </Grid>
        <Grid item xs={12} md={4}>
          {legend}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GraphContainer;
