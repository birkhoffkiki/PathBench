"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import React, { useMemo, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EChartsOption } from "echarts";

interface PerformanceBarChartProps {
  selectedMetrics?: string[];
}



export function OverallRankBarChart({ selectedMetrics = [] }: PerformanceBarChartProps) {
  const {
    getFilteredPerformances,
    getFilteredModels,
    getTaskById,
  } = useEvaluation();

  // Mobile responsiveness state
  const [isMobile, setIsMobile] = useState(false);
  const [showAllModels, setShowAllModels] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const chartOptions = useMemo((): EChartsOption => {
    const filteredPerformances = getFilteredPerformances();
    const filteredModels = getFilteredModels();

    if (filteredPerformances.length === 0) {
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

    // Get all available metrics from filtered tasks
    const allAvailableMetrics = new Set<string>();
    const allTasksWithMetrics = [...new Set(filteredPerformances.map(p => p.taskId))]
      .map(id => {
        const task = getTaskById(id);
        const taskPerformances = filteredPerformances.filter(p => p.taskId === id);
        const availableMetrics = new Set<string>();

        taskPerformances.forEach(p => {
          Object.keys(p.metrics).forEach(metric => {
            if (p.metrics[metric] !== undefined && p.metrics[metric] !== null) {
              availableMetrics.add(metric);
              allAvailableMetrics.add(metric);
            }
          });
        });

        return {
          id,
          name: task ? `${task.name} (${task.cohort})` : id,
          availableMetrics: Array.from(availableMetrics),
          task
        };
      })
      .filter(t => t.availableMetrics.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name));

    // Determine if we should show overall ranking
    const allMetricsArray = Array.from(allAvailableMetrics);
    const isOverallMode = selectedMetrics.length === 0 ||
                         (selectedMetrics.length === allMetricsArray.length &&
                          selectedMetrics.every(m => allMetricsArray.includes(m)));

    // Filter tasks based on selected metrics (if any)
    const tasks = isOverallMode
      ? allTasksWithMetrics
      : allTasksWithMetrics.filter(t => selectedMetrics.some(metric => t.availableMetrics.includes(metric)));

    // Pre-calculate all model scores for each task to avoid repeated calculations
    const taskScores = new Map();
    tasks.forEach(taskInfo => {
      const scores = filteredModels.map(m => {
        const performance = filteredPerformances.find(p => p.taskId === taskInfo.id && p.modelID === m.name);

        if (!isOverallMode) {
          // Selected metrics mode - calculate average score across selected metrics
          if (!performance) {
            return { modelName: m.name, score: -Infinity };
          }

          let totalScore = 0;
          let validMetrics = 0;

          selectedMetrics.forEach(metric => {
            if (performance.metrics[metric] && performance.metrics[metric].length > 0) {
              const metricScore = performance.metrics[metric].reduce((sum: number, val: number) => sum + val, 0) / performance.metrics[metric].length;
              totalScore += metricScore;
              validMetrics += 1;
            }
          });

          const averageScore = validMetrics > 0 ? totalScore / validMetrics : -Infinity;
          return { modelName: m.name, score: averageScore };
        } else {
          // Overall ranking mode - calculate average rank across all available metrics for this task
          if (!performance) {
            return { modelName: m.name, score: -Infinity };
          }

          const taskMetrics = taskInfo.availableMetrics;
          let totalRank = 0;
          let validMetrics = 0;

          taskMetrics.forEach(metric => {
            if (performance.metrics[metric] && performance.metrics[metric].length > 0) {
              const metricScore = performance.metrics[metric].reduce((sum: number, val: number) => sum + val, 0) / performance.metrics[metric].length;

              // Get all models' scores for this metric to calculate rank
              const allScoresForMetric = filteredModels.map(model => {
                const modelPerf = filteredPerformances.find(p => p.taskId === taskInfo.id && p.modelID === model.name);
                return modelPerf && modelPerf.metrics[metric] && modelPerf.metrics[metric].length > 0
                  ? modelPerf.metrics[metric].reduce((sum: number, val: number) => sum + val, 0) / modelPerf.metrics[metric].length
                  : -Infinity;
              }).filter(score => score !== -Infinity).sort((a, b) => b - a);

              const rank = allScoresForMetric.indexOf(metricScore) + 1;
              if (rank > 0) {
                totalRank += rank;
                validMetrics += 1;
              }
            }
          });

          const averageRank = validMetrics > 0 ? totalRank / validMetrics : Infinity;
          // Convert rank to score (lower rank = higher score for sorting)
          const score = validMetrics > 0 ? (filteredModels.length + 1 - averageRank) : -Infinity;
          return { modelName: m.name, score };
        }
      }).sort((a, b) => b.score - a.score);

      taskScores.set(taskInfo.id, scores);
    });

    // Calculate model stats more efficiently
    const allModelStats = filteredModels.map(model => {
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

    allModelStats.sort((a, b) => a.averageRank - b.averageRank);

    // For mobile, limit to top 5 models unless user wants to see all
    const maxModelsToShow = isMobile && !showAllModels ? 5 : allModelStats.length;
    const modelStats = allModelStats.slice(0, maxModelsToShow);


    const getColor = (index: number) => {
      const colors = [
        '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
        '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#6e7074'
      ];
      return colors[index % colors.length];
    };


    // Optimize heatmap data generation
    const heatmapData: [number, number, number][] = [];
    let maxRank = 1;

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
          color: getColor(index),
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
    const barChartHeight = isMobile ? 200 : 350;
    const fixedCellHeight = isMobile ? 25 : 40; // Smaller cells on mobile
    const heatmapHeight = tasks.length * fixedCellHeight;

    return {
      // Drastically reduce animations for heatmap performance
      animation: true,
      animationDuration: 200, // Much faster
      animationEasing: 'linear', // Simpler easing
      animationDelay: 0, // No stagger delay
      animationDurationUpdate: 100, // Very fast updates
      animationEasingUpdate: 'linear',

      title: {
        text: `Model Rankings (${isOverallMode ? 'Overall' : selectedMetrics.join(', ')})`,
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
      grid: isMobile ? [{
        left: '12%',
        right: '12%',
        top: 100,
        height: barChartHeight,
      }, {
        left: '12%',
        right: '12%',
        top: 100 + barChartHeight + 50, // More space for legend in between
        height: heatmapHeight
      }] : [{
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
      xAxis: isMobile ? [{
        type: 'category',
        data: modelStats.map(m => m.name),
        position: 'top',
        gridIndex: 0,
        axisLabel: {
          rotate: 45,
          interval: 0,
          fontSize: 10,
          align: 'left',
          padding: [6, 0, 0, 0]
        }
      }, {
        type: 'category',
        data: modelStats.map(m => m.name),
        position: 'top',
        gridIndex: 1,
        axisLabel: {
          show: false
        }
      }] : [{
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
      yAxis: isMobile ? [{
        type: 'value',
        name: 'Average Rank',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 12,
          fontWeight: 'bold'
        },
        inverse: false,
        gridIndex: 0,
        max: yAxisMax,
        axisLabel: {
          fontSize: 10,
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
        nameGap: 40,
        nameTextStyle: {
          fontSize: 12,
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
      }] : [{
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
      visualMap: isMobile ? {
        min: 1,
        max: totalModels,
        calculable: false,
        orient: 'horizontal',
        left: 'center',
        top: 100 + barChartHeight + 5, // Position between bar chart and heatmap
        textStyle: {
          fontSize: 9
        },
        itemGap: 8, // Increase gap between items
        itemWidth: 12,
        itemHeight: 10,
        textGap: 3, // Gap between color block and text
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
      } : {
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
      series: isMobile ? [
        {
          name: 'Average Rank',
          type: 'bar',
          data: barData,
          label: {
            show: true,
            position: 'bottom',
            distance: -15,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: (params: any) => {
              const model = modelStats[params.dataIndex as number];
              return `${model.averageRank.toFixed(1)}`;
            },
            rotate: 0,
            fontSize: 10
          },
          xAxisIndex: 0,
          yAxisIndex: 0,
        },
        {
          name: 'Rankings',
          type: 'heatmap',
          data: heatmapData.map(([x, y, v]) => [y, x, v]),
          animation: false,
          itemStyle: {
            borderWidth: 0.5,
            borderColor: 'rgba(255,255,255,0.3)',
          },
          label: {
            show: true,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: (params: any) => String((params.data as [number, number, number])[2]),
            fontSize: 10,
            fontWeight: 'bold',
            color: '#000',
            textBorderColor: 'rgba(255,255,255,0.5)',
            textBorderWidth: 1
          },
          emphasis: {
            disabled: true
          },
          xAxisIndex: 1,
          yAxisIndex: 1
        }
      ] : [
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
    selectedMetrics,
    isMobile,
    showAllModels,
  ]);


  const containerHeight = useMemo(() => {
    const filteredPerformances = getFilteredPerformances();
    // Count tasks that have the selected metrics (or all tasks if no metric selected)
    const tasksWithMetric = [...new Set(filteredPerformances.filter(p => {
      if (selectedMetrics.length === 0) {
        // If no metric selected, include all tasks that have any metrics
        return Object.keys(p.metrics).some(metric =>
          p.metrics[metric] !== undefined && p.metrics[metric] !== null
        );
      }
      // If metrics selected, include tasks that have any of the selected metrics
      return selectedMetrics.some(metric =>
        p.metrics[metric] !== undefined && p.metrics[metric] !== null
      );
    }).map(p => p.taskId))];

    if (isMobile) {
      const barChartHeight = 200;
      const fixedCellHeight = 25;
      const heatmapHeight = tasksWithMetric.length * fixedCellHeight;
      const totalHeight = barChartHeight + heatmapHeight + 200; // Space for legend in middle
      return Math.max(500, totalHeight);
    }

    const barChartHeight = 350;
    const fixedCellHeight = 40; // Same fixed height as in chart options
    const heatmapHeight = tasksWithMetric.length * fixedCellHeight;
    const totalHeight = barChartHeight + heatmapHeight + 300; // Add padding for title, labels, etc.

    return Math.max(800, totalHeight);
  }, [getFilteredPerformances, selectedMetrics, isMobile]);

  // Get total number of models for mobile display
  const totalModels = getFilteredModels().length;

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Model Ranking Analysis</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {(() => {
            // Determine display text based on selection
            const allAvailableMetrics = new Set<string>();
            getFilteredPerformances().forEach(p => {
              Object.keys(p.metrics).forEach(metric => {
                if (p.metrics[metric] !== undefined && p.metrics[metric] !== null) {
                  allAvailableMetrics.add(metric);
                }
              });
            });
            const allMetricsArray = Array.from(allAvailableMetrics);
            const isOverall = selectedMetrics.length === 0 ||
                             (selectedMetrics.length === allMetricsArray.length &&
                              selectedMetrics.every(m => allMetricsArray.includes(m)));
            const displayText = isOverall ? "Overall" : selectedMetrics.join(', ');

            return isMobile
              ? `${displayText} rankings`
              : `Top: Average rankings across tasks | Bottom: Detailed rankings per task (${displayText})`;
          })()}
        </CardDescription>
        {isMobile && totalModels > 5 && (
          <div className="mt-2">
            <Button
              variant={showAllModels ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAllModels(!showAllModels)}
              className="text-xs"
            >
              Show All {totalModels} Models
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent
        className="overflow-auto p-2 sm:p-6"
        style={{
          height: isMobile ? 'auto' : `calc(100vh - 150px)`,
          maxHeight: `${containerHeight}px`,
        }}
      >
        <ReactECharts
          option={chartOptions}
          style={{
            height: `${containerHeight - 100}px`,
            width: "100%",
            minHeight: `${containerHeight - 100}px`
          }}
          opts={{
            renderer: "canvas", // Canvas is faster for heatmaps
            devicePixelRatio: isMobile ? 1 : 2 // Lower pixel ratio on mobile for better performance
          }}
          notMerge={true}
          lazyUpdate={true}
        />
      </CardContent>
    </Card>
  );
}