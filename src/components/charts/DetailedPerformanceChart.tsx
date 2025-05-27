"use client";

import React, { useMemo, memo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { performances } from '@/data/performance';
import { tasks } from '@/data/tasks';
import type { EChartsOption } from 'echarts';

interface DetailedPerformanceChartProps {
  taskId: string;
  taskName: string;
  organ: string;
}

interface ModelStats {
  modelName: string;
  mean: number;
  std: number;
  values: number[];
  min: number;
  max: number;
  cohort: string;
}

interface SingleCohortChartProps {
  taskName: string;
  organ: string;
  cohort: string;
  modelStats: ModelStats[];
  selectedMetric: string;
}

// Single cohort chart component - memoized for performance
const SingleCohortChart = memo(function SingleCohortChart({
  taskName,
  organ,
  cohort,
  modelStats,
  selectedMetric
}: SingleCohortChartProps) {
  const chartOptions = useMemo((): EChartsOption => {
    if (!modelStats || modelStats.length === 0) {
      return {
        // Disable animations for empty state
        animation: false,
        title: {
          text: `No data available for ${cohort}`,
          left: 'center',
          textStyle: { fontSize: 14, color: '#666' }
        },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: []
      };
    }

    const modelNames = modelStats.map(d => d?.modelName || '');
    const means = modelStats.map(d => d?.mean || 0);
    const stds = modelStats.map(d => d?.std || 0);

    // Calculate Y-axis range for better visualization
    const allValues = means.concat(modelStats.flatMap(d => d?.values || []));
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const range = maxValue - minValue;
    const yAxisMin = Math.max(0, minValue - range * 0.1);
    const yAxisMax = maxValue + range * 0.1;

    // Prepare scatter data (individual fold values)
    const scatterData: [number, number][] = [];
    modelStats.forEach((modelData, modelIndex) => {
      if (modelData && modelData.values) {
        modelData.values.forEach((value: number) => {
          scatterData.push([modelIndex, value]);
        });
      }
    });

    return {
      // Optimize animations for better performance
      animation: true,
      animationDuration: 200, // Faster animation
      animationEasing: 'cubicOut',
      animationDelay: function (idx: number) {
        return idx * 8; // Even faster stagger
      },
      animationDurationUpdate: 100, // Faster updates
      animationEasingUpdate: 'cubicOut',

      backgroundColor: '#fafafa',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151' },
        formatter: function(params: unknown) {
          if (Array.isArray(params) && params.length > 0) {
            const dataIndex = params[0].dataIndex;
            const modelData = modelStats[dataIndex];
            if (modelData) {
              return `
                <div style="font-weight: bold; margin-bottom: 8px;">${modelData.modelName}</div>
                <div>Mean: <span style="font-weight: bold;">${modelData.mean.toFixed(3)}</span></div>
                <div>Std: ${modelData.std.toFixed(3)}</div>
                <div>Range: ${modelData.min.toFixed(3)} - ${modelData.max.toFixed(3)}</div>
                <div>Folds: ${modelData.values.length}</div>
              `;
            }
          }
          return '';
        }
      },
      grid: {
        left: '12%',
        right: '5%',
        bottom: '7%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: modelNames,
        axisLabel: {
          rotate: 45,
          fontSize: 11,
          color: '#374151',
          interval: 0
        },
        axisLine: {
          lineStyle: { color: '#d1d5db' }
        },
        axisTick: {
          lineStyle: { color: '#d1d5db' }
        }
      },
      yAxis: {
        type: 'value',
        name: selectedMetric,
        nameLocation: 'middle',
        nameGap: 60,
        nameTextStyle: {
          fontSize: 14,
          color: '#374151',
          fontWeight: 'bold'
        },
        min: yAxisMin,
        max: yAxisMax,
        axisLabel: {
          formatter: function(value: number) {
            return value.toFixed(3);
          },
          fontSize: 11,
          color: '#374151',
          showMinLabel: true,
          showMaxLabel: true,
          // Add margin between labels to prevent overlap
          margin: 10
        },
        splitNumber: (() => {
          const range = yAxisMax - yAxisMin;
          // Adaptive split number based on range to prevent crowding
          if (range < 0.05) return 3; // Very small range, only show 3 labels
          if (range < 0.1) return 4;  // Small range, show 4 labels
          if (range < 0.2) return 5;  // Medium range, show 5 labels
          return 6; // Larger range, show up to 6 labels
        })(),
        // Add interval to control label spacing for small ranges
        ...((() => {
          const range = yAxisMax - yAxisMin;
          // For very small ranges, use larger intervals to prevent crowding
          if (range < 0.05) return { interval: (yAxisMax - yAxisMin) / 2 };
          if (range < 0.1) return { interval: (yAxisMax - yAxisMin) / 3 };
          return {}; // Let ECharts decide for larger ranges
        })()),
        axisLine: {
          lineStyle: { color: '#d1d5db' }
        },
        axisTick: {
          lineStyle: { color: '#d1d5db' }
        },
        splitLine: {
          lineStyle: {
            color: '#e5e7eb',
            type: 'dashed'
          }
        }
      },
      series: [
        // Bar chart with custom color palette
        {
          name: 'Mean Performance',
          type: 'bar',
          data: means.map((mean, index) => {
            // Custom color palette from user
            const colorPalette = [
              '#67001F', '#981328', '#B72C34', '#C5413F', '#CF5349',
              '#D86654', '#D96856', '#EC9578', '#F6B89C', '#F7BB9F',
              '#F7BCA0', '#FAD3BE', '#F8EAE3', '#F6EDE8', '#E5EEF2',
              '#E4EDF2', '#96C6DF', '#8DC1DC', '#053061'
            ];

            // Select color based on ranking (index)
            const colorIndex = index % colorPalette.length;
            const baseColor = colorPalette[colorIndex];

            return {
              value: mean,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: baseColor },
                    { offset: 1, color: baseColor }
                  ]
                },
                borderRadius: [2, 2, 0, 0],
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 4,
                shadowOffsetY: 2
              }
            };
          }),
          barWidth: '65%',
          z: 1,
          emphasis: {
            itemStyle: {
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 8,
              shadowOffsetY: 4
            }
          }
        },
        // Error bars
        {
          name: 'Error Bars',
          type: 'custom',
          renderItem: function (params: unknown, api: unknown) {
            const apiTyped = api as { value: (index: number) => number; coord: (value: [number, number]) => [number, number]; size: (value: [number, number]) => [number, number] };
            const paramsTyped = params as { dataIndex: number };
            const xValue = apiTyped.value(0);
            const yValue = apiTyped.value(1);
            const std = stds[paramsTyped.dataIndex];
            const coord = apiTyped.coord([xValue, yValue]);
            const size = apiTyped.size([1, std]);

            return {
              type: 'group',
              children: [
                // Upper error bar
                {
                  type: 'line',
                  shape: {
                    x1: coord[0], y1: coord[1] - size[1],
                    x2: coord[0], y2: coord[1] + size[1]
                  },
                  style: { stroke: '#1f2937', lineWidth: 2 }
                },
                // Upper cap
                {
                  type: 'line',
                  shape: {
                    x1: coord[0] - 5, y1: coord[1] + size[1],
                    x2: coord[0] + 5, y2: coord[1] + size[1]
                  },
                  style: { stroke: '#1f2937', lineWidth: 2 }
                },
                // Lower cap
                {
                  type: 'line',
                  shape: {
                    x1: coord[0] - 5, y1: coord[1] - size[1],
                    x2: coord[0] + 5, y2: coord[1] - size[1]
                  },
                  style: { stroke: '#1f2937', lineWidth: 2 }
                }
              ]
            };
          },
          data: means.map((mean, index) => [index, mean]),
          z: 3
        },
        // Scatter plot for individual fold values
        {
          name: 'Individual Folds',
          type: 'scatter',
          data: scatterData,
          symbolSize: 5,
          itemStyle: {
            color: '#9ca3af',
            opacity: 0.7,
            borderColor: '#6b7280',
            borderWidth: 0.5
          },
          z: 2,
          emphasis: {
            itemStyle: {
              color: '#6b7280',
              opacity: 0.9
            }
          }
        }
      ]
    };
  }, [modelStats, selectedMetric, cohort]);

  return (
    <Card className="w-full shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-3 sm:pt-4">
        <CardTitle className="text-base sm:text-lg text-gray-900 leading-tight">{taskName}</CardTitle>
        <p className="text-xs sm:text-sm text-gray-600">
          {organ} • {modelStats.length} models • {selectedMetric} • {cohort}
        </p>
      </CardHeader>
      <CardContent className="pb-2 pt-2 px-2 sm:px-6">
        <div className="h-[250px] sm:h-[350px]">
          <ReactECharts
            option={chartOptions}
            style={{ height: '100%', width: '100%' }}
            opts={{
              renderer: 'canvas', // Canvas is faster for complex charts
              devicePixelRatio: (typeof window !== 'undefined' && window.innerWidth < 768) ? 1 : 2 // Lower pixel ratio on mobile for better performance
            }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      </CardContent>
    </Card>
  );
});

export function DetailedPerformanceChart({
  taskId,
  taskName,
  organ
}: DetailedPerformanceChartProps) {

  // Optimize data processing with better caching
  const cohortCharts = useMemo(() => {
    // Get performances for this specific task - use more efficient filtering
    const taskPerformances = performances.filter(p => p.taskId === taskId);

    if (taskPerformances.length === 0) {
      return [];
    }

    // Determine the metric for this task based on available metrics
    const availableMetrics = Object.keys(taskPerformances[0]?.metrics || {});
    const selectedMetric = availableMetrics[0]; // Use the first available metric

    if (!selectedMetric) {
      return [];
    }

    // Pre-find the task to avoid repeated lookups
    const currentTask = tasks.find(t => t.id === taskId);
    const defaultCohort = currentTask?.cohort || 'unknown';

    // Group by cohort more efficiently
    const cohortGroups = new Map();
    taskPerformances.forEach(perf => {
      const cohort = defaultCohort; // Use pre-found cohort

      if (!cohortGroups.has(cohort)) {
        cohortGroups.set(cohort, []);
      }
      cohortGroups.get(cohort).push(perf);
    });

    // Create chart data for each cohort with optimized calculations
    const chartDataArray = [];
    for (const [cohort, cohortPerformances] of cohortGroups.entries()) {
      // Calculate statistics for each model in this cohort
      const modelStats = cohortPerformances.map((perf: unknown) => {
        const perfTyped = perf as { modelID: string; metrics: Record<string, number[]> };
        const values = perfTyped.metrics[selectedMetric];
        if (!values || values.length === 0) return null;

        // Optimize statistical calculations
        const sum = values.reduce((acc: number, val: number) => acc + val, 0);
        const mean = sum / values.length;

        // Calculate variance in single pass
        const variance = values.reduce((acc: number, val: number) => {
          const diff = val - mean;
          return acc + diff * diff;
        }, 0) / values.length;

        const std = Math.sqrt(variance);
        const min = Math.min(...values);
        const max = Math.max(...values);

        return {
          modelName: perfTyped.modelID,
          mean,
          std,
          values,
          min,
          max,
          cohort
        };
      }).filter(Boolean);

      // Sort by mean performance (descending)
      modelStats.sort((a: ModelStats | null, b: ModelStats | null) => (b?.mean || 0) - (a?.mean || 0));

      if (modelStats.length > 0) {
        chartDataArray.push({
          cohort,
          modelStats,
          selectedMetric
        });
      }
    }

    return chartDataArray;
  }, [taskId]);

  if (cohortCharts.length === 0) {
    return (
      <Card className="w-full shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">{taskName}</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No data available for this task</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {cohortCharts.map((chartData) => (
        <SingleCohortChart
          key={`${taskId}-${chartData.cohort}`}
          taskName={taskName}
          organ={organ}
          cohort={chartData.cohort}
          modelStats={chartData.modelStats}
          selectedMetric={chartData.selectedMetric}
        />
      ))}
    </>
  );
}
