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
import { useCallback } from 'react';
import { useCurrentPng } from 'recharts-to-png';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { ChartMode } from '../../types/history';
import {
  formatDate,
  formatPrice,
  formatPriceToThousand,
  formatProjectName,
} from '../../utils/history';
import { useAppSelector } from '../../app/hooks';
import {
  selectAllBTOProjects,
  selectBTORawData,
  selectGroups,
  selectMonthlyChartData,
  selectSelectedBTOProjectIds,
  selectYearlyChartData,
} from '../../reducers/history';
import { Group } from '../../types/groups';

interface Props {
  chartMode: ChartMode;
  selectedGroup: string | undefined;
}

const HistoryChart = (props: Props) => {
  const { chartMode, selectedGroup } = props;
  const groups = useAppSelector(selectGroups);

  const monthlyChartData = useAppSelector(selectMonthlyChartData);
  const yearlyChartData = useAppSelector(selectYearlyChartData);

  const btoProjects = useAppSelector(selectAllBTOProjects);
  const btoProjectsByGroup = useAppSelector(selectBTORawData);
  const selectedBTOProjectIds = useAppSelector(selectSelectedBTOProjectIds);

  const [getPng, { ref, isLoading }] = useCurrentPng();

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
          {groups
            .filter((g) => g.type === 'resale')
            .map(({ id, color }) => (
              <Line
                type="linear"
                key={id}
                dataKey={id}
                stroke={`${color}cc`}
                strokeWidth={selectedGroup === id ? 3 : 2}
                connectNulls
                dot={false}
                activeDot={{ r: 4.5 }}
              />
            ))}
          {groups
            .filter((g) => g.type === 'bto')
            .map(({ id: groupId, color }) => (
              <>
                {btoProjectsByGroup[groupId] &&
                  Object.keys(btoProjectsByGroup[groupId]).map((id) => (
                    <Line
                      type="linear"
                      key={id}
                      dataKey={id}
                      stroke={`${color}cc`}
                      strokeWidth={selectedGroup === groupId ? 3 : 2}
                      dot={{
                        r: 3.5,
                        stroke: selectedBTOProjectIds[groupId].includes(id)
                          ? 'black'
                          : `${color}cc`,
                        fill: selectedBTOProjectIds[groupId].includes(id)
                          ? `${color}cc`
                          : 'white',
                      }}
                      activeDot={{
                        r: 4.5,
                        stroke: selectedBTOProjectIds[groupId].includes(id)
                          ? 'black'
                          : 'white',
                      }}
                    />
                  ))}
              </>
            ))}
        </LineChart>
      </ResponsiveContainer>
      {groups.length > 0 && (
        <Button onClick={handleDownload}>
          {isLoading ? (
            <Stack direction="row" spacing={1}>
              <CircularProgress size="1.5rem" />
              <Typography variant="inherit">Downloading...</Typography>
            </Stack>
          ) : (
            'Download Chart'
          )}
        </Button>
      )}
    </>
  );
};

export default HistoryChart;
