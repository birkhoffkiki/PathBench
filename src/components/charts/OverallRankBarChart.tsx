"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { EChartsOption } from "echarts";

interface PerformanceBarChartProps {
  selectedMetric?: string;
}



export function OverallRankBarChart({ selectedMetric }: PerformanceBarChartProps) {
  const {
    getFilteredPerformances,
    getFilteredModels,
    getTaskById,
  } = useEvaluation();

  const chartOptions = useMemo((): EChartsOption => {
    const filteredPerformances = getFilteredPerformances();
    const filteredModels = getFilteredModels();

    if (filteredPerformances.length === 0 || !selectedMetric) {
      return {
        // Disable animations for empty state
        animation: false,
        title: {
          text: "No data available",
          left: "center",
        },
        tooltip: {},
        xAxis: [{ type: "category", data: [] }],
        yAxis: [{ type: "category", data: [] }],
        series: [],
      };
    }

    // Filter tasks that have the selected metric
    const tasks = [...new Set(filteredPerformances.filter(p => p.metrics[selectedMetric] !== undefined && p.metrics[selectedMetric] !== null).map(p => p.taskId))]
      .map(id => {
        const task = getTaskById(id);

        return {
          id,
          name: task ? `${task.name} (${task.cohort})` : id
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));


    // Pre-calculate all model scores for each task to avoid repeated calculations
    const taskScores = new Map();
    tasks.forEach(task => {
      const scores = filteredModels.map(m => {
        const performance = filteredPerformances.find(p => p.taskId === task.id && p.modelID === m.name);
        const score = performance && performance.metrics[selectedMetric]
          ? performance.metrics[selectedMetric].reduce((sum, val) => sum + val, 0) / performance.metrics[selectedMetric].length
          : -Infinity;
        return { modelName: m.name, score };
      }).sort((a, b) => b.score - a.score);

      taskScores.set(task.id, scores);
    });

    // Calculate model stats more efficiently
    const modelStats = filteredModels.map(model => {
      const rankings: number[] = [];
      let totalRank = 0;
      let validTasks = 0;

      tasks.forEach(task => {
        const taskPerformances = taskScores.get(task.id);
        const rank = taskPerformances.findIndex((p: { modelName: string; score: number }) => p.modelName === model.name) + 1;

        if (rank > 0 && taskPerformances[rank - 1].score !== -Infinity) {
          rankings.push(rank);
          totalRank += rank;
          validTasks += 1;
        } else {
          rankings.push(-1);
        }
      });

      return {
        name: model.name,
        rankings,
        averageRank: validTasks > 0 ? totalRank / validTasks : Infinity,
        taskCount: validTasks
      };
    });


    modelStats.sort((a, b) => a.averageRank - b.averageRank);


    const getColor = (index: number, total: number) => {
      const colors = [
        '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
        '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#6e7074'
      ];
      return colors[index % colors.length];
    };


    // Optimize heatmap data generation
    const heatmapData: [number, number, number][] = [];
    let maxRank = 1;

    // Pre-allocate array size for better performance
    const estimatedSize = modelStats.length * tasks.length;
    heatmapData.length = 0; // Clear array

    for (let modelIndex = 0; modelIndex < modelStats.length; modelIndex++) {
      const model = modelStats[modelIndex];
      for (let taskIndex = 0; taskIndex < model.rankings.length; taskIndex++) {
        const rank = model.rankings[taskIndex];
        if (rank > 0) {
          heatmapData.push([taskIndex, modelIndex, rank]);
          if (rank > maxRank) maxRank = rank;
        }
      }
    }

    const totalModels = filteredModels.length;

    // Calculate the maximum average rank to set proper Y-axis range
    const maxAverageRank = Math.max(...modelStats.map(m => m.averageRank));
    const yAxisMax = Math.max(totalModels, Math.ceil(maxAverageRank));

    const barData = modelStats.map((model, index) => {
      const displayValue = yAxisMax - model.averageRank + 1;

      return {
        value: displayValue > 0 ? displayValue : 0,
        itemStyle: {
          color: getColor(index, modelStats.length),
          borderRadius: [4, 4, 0, 0],
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: 1,
          shadowBlur: 3,
          shadowColor: 'rgba(0,0,0,0.2)',
          opacity: 0.9
        },
        originalRank: model.averageRank
      };
    });

    // Fixed heights for consistent display
    const barChartHeight = 350;
    const fixedCellHeight = 40; // Fixed cell height for all metrics
    const heatmapHeight = tasks.length * fixedCellHeight;
    const totalHeight = barChartHeight + heatmapHeight + 200; // Add padding

    return {
      // Drastically reduce animations for heatmap performance
      animation: true,
      animationDuration: 200, // Much faster
      animationEasing: 'linear', // Simpler easing
      animationDelay: 0, // No stagger delay
      animationDurationUpdate: 100, // Very fast updates
      animationEasingUpdate: 'linear',

      title: {
        text: `Model Rankings (${selectedMetric})`,
        left: "center",
        top: 10,
        textStyle: {
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        position: 'top',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          if (params.seriesType === 'heatmap') {
            const data = params.data as [number, number, number];
            const modelName = modelStats[data[0]].name;
            const taskName = tasks[data[1]].name;
            const rank = data[2];
            return `${modelName}<br/>${taskName}<br/>Rank: ${rank}`;
          } else {
            const model = modelStats[params.dataIndex as number];

            return `${model.name}<br/>Average Rank: ${model.averageRank.toFixed(2)}`;
          }
        },
        textStyle: {
          fontSize: 15
        }
      },
      grid: [{
        left: '8%',
        right: '8%',
        top: 140,
        height: barChartHeight,
      }, {
        left: '8%',
        right: '8%',
        top: 120 + barChartHeight + 50,
        height: heatmapHeight
      }],
      xAxis: [{
        type: 'category',
        data: modelStats.map(m => m.name),
        position: 'top',
        gridIndex: 0,
        axisLabel: {
          rotate: 45,
          interval: 0,
          fontSize: 16,
          align: 'left',
          padding: [10, 0, 0, 0]
        }
      }, {
        type: 'category',
        data: modelStats.map(m => m.name),
        position: 'top',
        gridIndex: 1,
        axisLabel: {
          show: false
        }
      }],
      yAxis: [{
        type: 'value',
        name: 'Average Rank',
        nameLocation: 'middle',
        nameGap: 45,
        nameTextStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        },
        inverse: false,
        gridIndex: 0,
        max: yAxisMax,
        axisLabel: {
          fontSize: 16,
          formatter: function(value: number) {
            const rankValue = yAxisMax - value + 1;
            return rankValue.toFixed(1);
          }
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#ddd'
          }
        }
      }, {
        type: 'category',
        name: 'Tasks',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        },
        data: tasks.map(t => t.name),
        gridIndex: 1,
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
      }],
      visualMap: {
        min: 1,
        max: totalModels,
        calculable: false,
        orient: 'vertical',
        left: 'right',
        top: 340,
        textStyle: {
          fontSize: 14
        },
        itemGap: 6,
        itemWidth: 20,
        itemHeight: 14,
        pieces: [
          { value: 1, color: '#FFD700', label: '1st' },
          { value: 2, color: '#C0C0C0', label: '2nd' },
          { value: 3, color: '#CD7F32', label: '3rd' },
          { min: 4, max: Math.min(10, totalModels), color: '#E3F2FD', label: totalModels <= 10 ? '4+' : '4-10' },
          ...(totalModels > 10 ? [
            { min: 11, max: Math.min(15, totalModels), color: '#90CAF9', label: totalModels <= 15 ? '11+' : '11-15' },
            ...(totalModels > 15 ? [{ min: 16, max: totalModels, color: '#1976D2', label: '16+' }] : [])
          ] : [])
        ]
      },
      series: [
        {
          name: 'Average Rank',
          type: 'bar',
          data: barData,
          label: {
            show: true,
            position: 'bottom',
            distance: -25,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: (params: any) => {
              const model = modelStats[params.dataIndex as number];
              return `${model.averageRank.toFixed(2)}`;
            },
            rotate: 0,
            fontSize: 16
          },
          xAxisIndex: 0,
          yAxisIndex: 0,
        },
        {
          name: 'Rankings',
          type: 'heatmap',
          data: heatmapData.map(([x, y, v]) => [y, x, v]),
          // Optimize heatmap rendering
          animation: false, // Disable animation for heatmap specifically
          itemStyle: {
            borderWidth: 0.5, // Thinner borders for better performance
            borderColor: 'rgba(255,255,255,0.3)',
          },
          label: {
            show: true,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: (params: any) => String((params.data as [number, number, number])[2]),
            fontSize: 14, // Restore original font size
            fontWeight: 'bold', // Restore bold weight
            color: '#000',
            textBorderColor: 'rgba(255,255,255,0.5)', // Restore text border
            textBorderWidth: 2
          },
          emphasis: {
            disabled: true // Disable emphasis effects for better performance
          },
          xAxisIndex: 1,
          yAxisIndex: 1
        }
      ]
    };
  }, [
    getFilteredPerformances,
    getFilteredModels,
    getTaskById,
    selectedMetric,
  ]);


  const containerHeight = useMemo(() => {
    const filteredPerformances = getFilteredPerformances();
    // Only count tasks that have the selected metric
    const tasksWithMetric = [...new Set(filteredPerformances.filter(p =>
      selectedMetric && p.metrics[selectedMetric] !== undefined && p.metrics[selectedMetric] !== null
    ).map(p => p.taskId))];

    const barChartHeight = 350;
    const fixedCellHeight = 40; // Same fixed height as in chart options
    const heatmapHeight = tasksWithMetric.length * fixedCellHeight;
    const totalHeight = barChartHeight + heatmapHeight + 300; // Add padding for title, labels, etc.

    return Math.max(800, totalHeight);
  }, [getFilteredPerformances, selectedMetric]);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Model Ranking Analysis</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {`Top: Average rankings across tasks | Bottom: Detailed rankings per task (${selectedMetric || "Select a metric"})`}
        </CardDescription>
      </CardHeader>
      <CardContent
        className="overflow-auto p-2 sm:p-6"
        style={{
          height: `calc(100vh - 150px)`,
          maxHeight: `${Math.min(containerHeight, window.innerWidth < 768 ? 600 : containerHeight)}px`,
        }}
      >
        <ReactECharts
          option={chartOptions}
          style={{
            height: `${Math.min(containerHeight - 100, window.innerWidth < 768 ? 500 : containerHeight - 100)}px`,
            width: "100%",
            minHeight: `${Math.min(containerHeight - 100, window.innerWidth < 768 ? 500 : containerHeight - 100)}px`
          }}
          opts={{
            renderer: "canvas", // Canvas is faster for heatmaps
            devicePixelRatio: window.innerWidth < 768 ? 1 : 2 // Lower pixel ratio on mobile for better performance
          }}
          notMerge={true}
          lazyUpdate={true}
        />
      </CardContent>
    </Card>
  );
}