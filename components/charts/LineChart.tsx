import React from 'react';
import { Canvas, Path, Skia, Text, Circle, matchFont } from '@shopify/react-native-skia';
import { GlucoseReading } from '../../types';

interface LineChartProps {
  data: GlucoseReading[];
  width: number;
  height: number;
}

export const LineChart: React.FC<LineChartProps> = ({ data, width, height }) => {
  if (data.length < 2) {
    return null;
  }

  try {
    const font = matchFont({ fontSize: 12 });
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Sort data by timestamp
  const sortedData = [...data].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  // Find min and max values for scaling
  const values = sortedData.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  // Create path for the line
  const path = Skia.Path.Make();
  const points = sortedData.map((point, index) => {
    const x = padding + (index / (sortedData.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
    return { x, y, value: point.value };
  });

  // Draw the line path
  if (points.length > 0) {
    path.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      path.lineTo(points[i].x, points[i].y);
    }
  }

  return (
    <Canvas style={{ width, height }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
        const y = padding + chartHeight * ratio;
        const gridPath = Skia.Path.Make();
        gridPath.moveTo(padding, y);
        gridPath.lineTo(padding + chartWidth, y);
        
        return (
          <Path
            key={`grid-${index}`}
            path={gridPath}
            color="#858585"
            style="stroke"
            strokeWidth={0.5}
            opacity={0.3}
          />
        );
      })}

      {/* Main line */}
      <Path
        path={path}
        color="#161616"
        style="stroke"
        strokeWidth={2}
        strokeJoin="round"
        strokeCap="round"
      />

      {/* Data points */}
      {points.map((point, index) => (
        <Circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={4}
          color="#161616"
        />
      ))}

      {/* Y-axis labels */}
      {[0, 0.5, 1].map((ratio, index) => {
        const value = Math.round(minValue + ratio * valueRange);
        const y = padding + chartHeight * (1 - ratio);
        
        return (
          <Text
            key={`y-label-${index}`}
            x={15}
            y={y + 5}
            text={value.toString()}
            color="#858585"
            font={font}
          />
        );
      })}

      {/* X-axis labels (first and last date) */}
      {sortedData.length > 1 && (
        <>
          <Text
            x={padding}
            y={height - 10}
            text={sortedData[0].timestamp.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
            color="#858585"
            font={font}
          />
          <Text
            x={padding + chartWidth - 30}
            y={height - 10}
            text={sortedData[sortedData.length - 1].timestamp.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
            color="#858585"
            font={font}
          />
        </>
      )}
    </Canvas>
  );
  } catch {
    // Fallback if Skia fails to render
    return null;
  }
};