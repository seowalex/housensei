import {
  Brush,
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
import { BTOProject, ChartMode } from '../../types/history';
import { formatDate, formatPrice } from '../../utils/history';
import { convertFlatTypeToFrontend } from '../../utils/groups';
import { useAppSelector } from '../../app/hooks';
import {
  selectGroups,
  selectMonthlyChartData,
  selectYearlyChartData,
} from '../../reducers/history';

interface Props {
  chartMode: ChartMode;
  selectedGroup: string | undefined;
  projectsState: Record<string, BTOProject[]>;
  aggregatedProjectsState: Record<string, BTOProject[]>;
}

const HistoryChart = (props: Props) => {
  const { chartMode, selectedGroup, projectsState, aggregatedProjectsState } =
    props;
  const groups = useAppSelector(selectGroups);
  const monthlyChartData = useAppSelector(selectMonthlyChartData);
  const yearlyChartData = useAppSelector(selectYearlyChartData);
  const chartData =
    chartMode === ChartMode.Monthly ? monthlyChartData : yearlyChartData;

  return (
    <ResponsiveContainer width="100%" height={650}>
      <LineChart
        data={chartData}
        height={300}
        margin={{ top: 20, left: 20, bottom: 10, right: 10 }}
      >
        <CartesianGrid />
        <XAxis
          dataKey="date"
          height={50}
          tick={chartData.length > 0}
          tickFormatter={
            chartMode === ChartMode.Monthly ? formatDate : undefined
          }
        >
          <Label
            value={chartMode === ChartMode.Monthly ? 'Month' : 'Year'}
            position="insideBottom"
            offset={10}
          />
        </XAxis>
        <YAxis
          tickFormatter={(value, index) => formatPrice(value)}
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
        />
        <Brush
          dataKey="date"
          height={30}
          stroke="#888"
          tickFormatter={
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
                  stroke={
                    selectedGroup !== id && selectedGroup != null
                      ? `${color}88`
                      : color
                  }
                  strokeWidth={selectedGroup === id ? 3 : 2}
                  strokeDasharray="7 3"
                  alwaysShow
                  ifOverflow="extendDomain"
                >
                  <Label position="insideLeft" value={price} />
                  <Label
                    position="insideRight"
                    value={`${name} (${convertFlatTypeToFrontend(flatType)})`}
                  />
                </ReferenceLine>
              ))}
            {aggregatedProjectsState[id] &&
              aggregatedProjectsState[id].map(({ name, price }) => (
                <ReferenceLine
                  y={price}
                  stroke={
                    selectedGroup !== id && selectedGroup != null
                      ? `${color}88`
                      : color
                  }
                  strokeWidth={selectedGroup === id ? 3 : 2}
                  strokeDasharray="7 3"
                  alwaysShow
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
};

export default HistoryChart;
