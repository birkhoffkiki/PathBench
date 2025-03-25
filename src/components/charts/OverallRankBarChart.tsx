
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

    // 修改任务名称的生成逻辑
    const tasks = [...new Set(filteredPerformances.map(p => p.taskId))]
      .map(id => {
        const task = getTaskById(id);
        // 合并 task.name 和 task.dataSource
        return {
          id,
          name: task ? `${task.name} (${task.datasetSource})` : id
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));



    // Calculate rankings and average rank for each model
    const modelStats = filteredModels.map(model => {
      const rankings: number[] = [];
      let totalRank = 0;
      let validTasks = 0;

      tasks.forEach(task => {
        const taskPerformances = filteredPerformances
          .filter(p => p.taskId === task.id)
          .map(p => ({
            modelId: p.modelId,
            score: p.metrics[selectedMetric]
              ? p.metrics[selectedMetric].reduce((sum, val) => sum + val, 0) / p.metrics[selectedMetric].length
              : -Infinity
          }))
          .sort((a, b) => b.score - a.score);

        const rank = taskPerformances.findIndex(p => p.modelId === model.id) + 1;
        if (rank > 0) {
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

    // Sort by average rank
    modelStats.sort((a, b) => a.averageRank - b.averageRank);

    // Color generation function
    const getColor = (index: number, total: number) => {
      const colors = [
        '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
        '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#6e7074'
      ];
      return colors[index % colors.length];
    };

    // Prepare heatmap data
    const heatmapData: [number, number, number][] = [];
    modelStats.forEach((model, modelIndex) => {
      model.rankings.forEach((rank, taskIndex) => {
        if (rank > 0) {
          heatmapData.push([taskIndex, modelIndex, rank]);
        }
      });
    });

    // Prepare bar chart data
    const barData = modelStats.map((model, index) => ({
      value: model.averageRank,
      itemStyle: {
        color: getColor(index, modelStats.length),
        borderRadius: [4, 4, 0, 0], // Rounded top corners
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        shadowBlur: 3,
        shadowColor: 'rgba(0,0,0,0.2)',
        opacity: 0.9
      },
      tooltip: {
        formatter: `${model.name}\nAverage Rank: ${model.averageRank.toFixed(2)} from ${tasks.length} Tasks`
      }
    }));

    return {
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
            const modelName = modelStats[params.data[0]].name;
            const taskName = tasks[params.data[1]].name;
            const rank = params.data[2];
            return `${modelName}<br/>${taskName}<br/>Rank: ${rank}`;
          } else {
            const model = modelStats[params.dataIndex];
            return `${model.name}<br/>Average Rank: ${params.value.toFixed(2)}`;
          }
        },
        textStyle: {
          fontSize: 15
        }
      },
      grid: [{
        left: '8%',
        right: '8%',
        top: 120,
        height: 350,
      }, {
        left: '8%',
        right: '8%',
        top: 520,
        bottom: '8%'
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
          align: 'left'
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
        nameTextStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        },
        nameLocation: 'middle',
        nameGap: 40,
        inverse: false,
        gridIndex: 0,
        axisLabel: {
          formatter: '{value}'
        }
      }, {
        type: 'category',
        name: 'Tasks',
        nameLocation: 'middle',
        nameGap: 40,
        data: tasks.map(t => t.name),
        gridIndex: 1,
        axisLabel: {
          show: false  // 隐藏标签
        },
        axisTick: {
          show: false  // 隐藏刻度线
        }
      }],
      visualMap: {
        min: 1,
        max: filteredModels.length,
        calculable: true,
        orient: 'vertical',
        left: 'right',
        // bottom: '2%',
        top: 340,
        inRange: {
          color: ['#f6eff7', '#bdc9e1', '#67a9cf', '#02818a']
        }
      },
      series: [
        {
          name: 'Average Rank',
          type: 'bar',
          data: barData,
          label: {
            show: true,
            position: 'insideBottom',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: (params: any) => {
              const model = modelStats[params.dataIndex];
              return `${params.value.toFixed(2)}`;
            },
            rotate: 0,
            fontSize: 16
          },
          xAxisIndex: 0,
          yAxisIndex: 0,
          // barMaxWidth: 20
        },
        {
          name: 'Rankings',
          type: 'heatmap',
          data: heatmapData.map(([x, y, v]) => [y, x, v]),
          label: {
            show: true,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: (params: any) => params.data[2],
            fontSize: 10
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
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


  // 动态计算容器高度
  const containerHeight = useMemo(() => {
    const tasks = [...new Set(getFilteredPerformances().map(p => p.taskId))];
    const minHeightPerTask = 40;
    const totalTaskHeight = tasks.length * minHeightPerTask;
    return Math.max(800, totalTaskHeight + 400); // 最小高度800px
  }, [getFilteredPerformances]);


  return (
    <Card className="w-full overflow-hidden"> {/* 添加 overflow-hidden */}
      <CardHeader>
        <CardTitle>Model Ranking Analysis</CardTitle>
        <CardDescription>
          {`Top: Average rankings across tasks | Bottom: Detailed rankings per task (${selectedMetric || "Select a metric"})`}
        </CardDescription>
      </CardHeader>
      <CardContent
        className="overflow-auto" // 添加 overflow-auto
        style={{
          height: `calc(100vh - 200px)`, // 使用视口高度减去头部空间
          maxHeight: `${containerHeight - 100}px`,  // 保持最大高度限制
        }}
      >
        <ReactECharts
          option={chartOptions}
          style={{
            height: "100%",
            width: "100%",
            minHeight: `${containerHeight - 100}px` // 确保图表有最小高度
          }}
          opts={{ renderer: "svg" }}
        />
      </CardContent>
    </Card>
  );
}