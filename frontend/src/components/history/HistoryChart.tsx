import {
  Brush,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { saveAs } from 'file-saver';
import { useCallback, useState } from 'react';
import { useCurrentPng } from 'recharts-to-png';
import { DownloadRounded as DownloadRoundedIcon } from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { ChartMode } from '../../types/history';
import { formatDate } from '../../utils/dates';
import {
  formatPrice,
  formatPriceToThousand,
  formatProjectName,
} from '../../utils/history';
import { useAppSelector } from '../../app/hooks';
import {
  selectAllBTOProjects,
  selectBTORawData,
  selectDisplayedGroupIds,
  selectGroups,
  selectMonthlyChartData,
  selectSelectedBTOProjectIds,
  selectYearlyChartData,
} from '../../reducers/history';
import { Group } from '../../types/groups';
import { selectColorTheme } from '../../reducers/settings';

interface Props {
  selectedGroup: string | undefined;
}

const HistoryChart = (props: Props) => {
  const { selectedGroup } = props;
  const groups = useAppSelector(selectGroups);

  const monthlyChartData = useAppSelector(selectMonthlyChartData);
  const yearlyChartData = useAppSelector(selectYearlyChartData);

  const btoProjects = useAppSelector(selectAllBTOProjects);
  const btoProjectsByGroup = useAppSelector(selectBTORawData);
  const selectedBTOProjectIds = useAppSelector(selectSelectedBTOProjectIds);
  const displayedGroupIds = useAppSelector(selectDisplayedGroupIds);

  const colorTheme = useAppSelector(selectColorTheme);

  const [chartMode, setChartMode] = useState<ChartMode>(ChartMode.Monthly);

  const [getPng, { ref, isLoading: isLoadingPng }] = useCurrentPng();

  const handleDownload = useCallback(async () => {
    const png = await getPng();

    if (png) {
      saveAs(png, 'housensei.png');
    }
  }, [getPng]);

  const chartData =
    chartMode === ChartMode.Monthly ? monthlyChartData : yearlyChartData;

  const getGroup = (id: string): Group | undefined => {
    const group = groups.filter((g) => g.type === 'resale' && g.id === id);
    return group.length === 0 ? undefined : group[0];
  };

  return (
    <>
      {groups.length > 0 && (
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Button startIcon={<DownloadRoundedIcon />} onClick={handleDownload}>
            {isLoadingPng ? (
              <Stack direction="row" spacing={1}>
                <CircularProgress size="1.5rem" />
                <Typography variant="inherit">Downloading...</Typography>
              </Stack>
            ) : (
              'Download Chart'
            )}
          </Button>
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
      )}
      <ResponsiveContainer width="100%" height={650}>
        <LineChart
          data={chartData}
          height={300}
          margin={{ top: 20, left: 20, bottom: 10, right: 10 }}
          ref={ref}
        >
          <CartesianGrid />
          <XAxis
            dataKey="date"
            height={50}
            tick={chartData.length > 0}
            tickFormatter={
              chartMode === ChartMode.Monthly ? formatDate : undefined
            }
            domain={['dataMin', 'dataMax']}
          >
            <Label
              value={chartMode === ChartMode.Monthly ? 'Month' : 'Year'}
              position="insideBottom"
              offset={10}
            />
          </XAxis>
          <YAxis
            tickFormatter={(value) => formatPriceToThousand(value)}
            type="number"
          >
            <Label
              value="Average Price (SGD)"
              position="insideLeft"
              angle={-90}
              offset={-5}
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <ChartTooltip
            labelFormatter={
              chartMode === ChartMode.Monthly ? formatDate : undefined
            }
            formatter={(value: number, id: string) => {
              const resaleGroupName = getGroup(id)?.name;
              const btoProjectName = btoProjects[id]
                ? formatProjectName(btoProjects[id].name)
                : '';
              return [
                value == null ? 'No Data' : `$${formatPrice(value)}`,
                resaleGroupName ?? btoProjectName,
              ];
            }}
          />
          <Brush
            dataKey="date"
            height={30}
            stroke="#888"
            tickFormatter={
              chartMode === ChartMode.Monthly ? formatDate : undefined
            }
            alwaysShowText
          />
          {colorTheme &&
            groups
              .filter((g) => g.type === 'resale')
              .map(({ id, color }) => (
                <>
                  {displayedGroupIds.has(id) && (
                    <Line
                      type="linear"
                      key={id}
                      dataKey={id}
                      stroke={colorTheme[color]}
                      strokeWidth={selectedGroup === id ? 3 : 2}
                      connectNulls
                      dot={false}
                      activeDot={{ r: 4.5 }}
                    />
                  )}
                </>
              ))}
          {colorTheme &&
            groups
              .filter((g) => g.type === 'bto')
              .map(({ id: groupId, color }) => (
                <>
                  {displayedGroupIds.has(groupId) &&
                    btoProjectsByGroup[groupId] &&
                    Object.keys(btoProjectsByGroup[groupId]).map((id) => (
                      <Line
                        type="linear"
                        key={id}
                        dataKey={id}
                        stroke={colorTheme[color]}
                        strokeWidth={selectedGroup === groupId ? 3 : 2}
                        dot={{
                          r: selectedBTOProjectIds[groupId].includes(id)
                            ? 4.5
                            : 3.5,
                          stroke: colorTheme[color],
                          fill: selectedBTOProjectIds[groupId].includes(id)
                            ? colorTheme[color]
                            : 'white',
                        }}
                        activeDot={{
                          r: selectedBTOProjectIds[groupId].includes(id)
                            ? 5.5
                            : 4.5,
                          stroke: selectedBTOProjectIds[groupId].includes(id)
                            ? 'black'
                            : 'white',
                        }}
                        isAnimationActive={false}
                      />
                    ))}
                </>
              ))}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default HistoryChart;
