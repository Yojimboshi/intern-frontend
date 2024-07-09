// src\views\apps\v2Pools\components\PoolChart.tsx
import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { PoolDetails } from 'src/pages/apps/v2Pools/index';

interface PoolChartProps {
  selectedPoolDetails?: PoolDetails;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any;
  label?: string;
  tokenA?: string;
  tokenB?: string;
  tokenAPrice?: number;
  tokenBPrice?: number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, tokenA, tokenB, tokenAPrice, tokenBPrice }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{label}</p> {/* Display the label */}
        <p className="label">{`1 ${tokenB} = ${tokenAPrice?.toFixed(4)} ${tokenA}`}</p>
        <p className="label">{`1 ${tokenA} = ${tokenBPrice?.toFixed(4)} ${tokenB}`}</p>
      </div>
    );
  }

  return null;
};

const PoolChart: React.FC<PoolChartProps> = ({ selectedPoolDetails }) => {
  const chartData = useMemo(() => {
    if (!selectedPoolDetails) {
      return [];
    }

    const k = selectedPoolDetails.tokenAReserve * selectedPoolDetails.tokenBReserve;
    const points = [];

    // Determine the zoom factor; smaller values will zoom in more
    const zoomFactor = 10;
    const startXB = selectedPoolDetails.tokenBReserve / zoomFactor;

    // Generate points for the curve
    for (let x = startXB; x < selectedPoolDetails.tokenBReserve; x += startXB / 100) {
      const y = k / x;
      if (isFinite(y) && y <= selectedPoolDetails.tokenAReserve) {
        points.push({ x, y });
      }
    }

    // To ensure smoothness, let's add more points closer to the current reserves
    const additionalPoints = 50; // Number of additional points
    const step = (selectedPoolDetails.tokenBReserve - startXB) / additionalPoints;
    for (let i = 0; i <= additionalPoints; i++) {
      const x = startXB + (step * i);
      const y = k / x;
      points.push({ x, y });
    }

    // Sort points by x to ensure the line is drawn correctly
    points.sort((a, b) => a.x - b.x);

    return points;
  }, [selectedPoolDetails]);


  const tokenAPrice = selectedPoolDetails
    ? (selectedPoolDetails.tokenBReserve / selectedPoolDetails.tokenAReserve)
    : undefined;
  const tokenBPrice = tokenAPrice
    ? (1 / tokenAPrice)
    : undefined;

  return (
    <LineChart
      width={600}
      height={300}
      data={chartData}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        type="number"
        dataKey="x"
        domain={[0, selectedPoolDetails ? selectedPoolDetails.tokenBReserve : 'auto']}
        label={selectedPoolDetails ? { value: selectedPoolDetails.tokenB, position: 'insideBottomRight', offset: -10 } : ""}
      />
      <YAxis
        type="number"
        dataKey="y"
        domain={[0, selectedPoolDetails ? selectedPoolDetails.tokenAReserve : 'auto']}
        label={selectedPoolDetails ? { value: selectedPoolDetails.tokenA, angle: -90, position: 'insideLeft' } : ""}
      />
      <Tooltip content={(props) => (
        <CustomTooltip
          {...props}
          tokenA={selectedPoolDetails?.tokenA}
          tokenB={selectedPoolDetails?.tokenB}
          tokenAPrice={tokenAPrice}
          tokenBPrice={tokenBPrice}
        />
      )} />
      <Legend />
      <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} dot={false} />
    </LineChart>
  );
};

export default PoolChart;
