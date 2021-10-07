import {
  Circle as CircleIcon,
  ExpandMoreRounded as ExpandMoreRoundedIcon,
  VisibilityOffRounded,
  VisibilityRounded,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Card,
  CardContent,
  Grid,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { SyntheticEvent, useState } from 'react';
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
import { GroupColor } from '../../types/groups';
import { BTOProject, PriceHistory } from '../../types/history';
import { FlatType, Town } from '../../types/property';
import GroupDetails from '../groups/GroupDetails';

const getInitialProjectsLineState = (
  histories: PriceHistory[]
): BTOProject[][] => histories.map((history) => []);

const GraphContainer = () => {
  const histories: PriceHistory[] = [
    {
      group: {
        name: 'Group 1',
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
          price: 250000,
          date: '2015-03',
        },
        {
          name: 'DEF',
          price: 250000,
          date: '2015-03',
        },
        {
          name: 'GHI',
          price: 250000,
          date: '2015-03',
        },
        {
          name: 'JKL',
          price: 250000,
          date: '2015-03',
        },
      ],
    },
    {
      group: {
        name: 'Group 2',
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
          price: 250000,
          date: '2015-03',
        },
        {
          name: 'DEF',
          price: 250000,
          date: '2015-03',
        },
        {
          name: 'GHI',
          price: 250000,
          date: '2015-03',
        },
        {
          name: 'JKL',
          price: 250000,
          date: '2015-03',
        },
      ],
    },
  ];
  const historie = useAppSelector(selectHistories);
  const [expandedGroup, setExpandedGroup] = useState<number | undefined>(
    undefined
  );
  const [projectsLineState, setProjectsLineState] = useState<BTOProject[][]>(
    getInitialProjectsLineState(histories)
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

  const handleChangeProject =
    (index: number) => (event: SyntheticEvent, value: BTOProject[]) => {
      setProjectsLineState((state) => [
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
        <Line
          type="monotone"
          dataKey="a"
          stroke={histories[0].group.color}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="b"
          stroke={histories[1].group.color}
          strokeWidth={2}
        />
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
                        value={projectsLineState[index]}
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
                                <VisibilityRounded />
                              ) : (
                                <VisibilityOffRounded />
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
