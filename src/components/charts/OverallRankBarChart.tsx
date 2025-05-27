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


    const tasks = [...new Set(filteredPerformances.map(p => p.taskId))]
      .map(id => {
        const task = getTaskById(id);

        return {
          id,
          name: task ? `${task.name} (${task.datasetSource})` : id
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));


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


    modelStats.sort((a, b) => a.averageRank - b.averageRank);


    const getColor = (index: number, total: number) => {
      const colors = [
        '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
        '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#6e7074'
      ];
      return colors[index % colors.length];
    };


    const heatmapData: [number, number, number][] = [];
    modelStats.forEach((model, modelIndex) => {
      model.rankings.forEach((rank, taskIndex) => {
        if (rank > 0) {
          heatmapData.push([taskIndex, modelIndex, rank]);
        }
      });
    });


    const totalModels = filteredModels.length;

    const barData = modelStats.map((model, index) => {
      const displayValue = totalModels - model.averageRank + 1;

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
        axisLabel: {
          fontSize: 16,

          formatter: function(value: number) {

            const rankValue = totalModels - value + 1;
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
        max: filteredModels.length,
        calculable: true,
        orient: 'vertical',
        left: 'right',
        top: 340,
        textStyle: {
          fontSize: 16
        },

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
          itemStyle: {
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.6)',
          },
          label: {
            show: true,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: (params: any) => String((params.data as [number, number, number])[2]),
            fontSize: 16,
            fontWeight: 'bold',
            color: '#000',
            textBorderColor: 'rgba(255,255,255,0.5)',
            textBorderWidth: 2
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              borderWidth: 2,
              borderColor: '#ffffff'
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


  const containerHeight = useMemo(() => {
    const tasks = [...new Set(getFilteredPerformances().map(p => p.taskId))];
    const minHeightPerTask = 50;
    const totalTaskHeight = tasks.length * minHeightPerTask;
    return Math.max(800, totalTaskHeight + 450);
  }, [getFilteredPerformances]);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle>Model Ranking Analysis</CardTitle>
        <CardDescription>
          {`Top: Average rankings across tasks | Bottom: Detailed rankings per task (${selectedMetric || "Select a metric"})`}
        </CardDescription>
      </CardHeader>
      <CardContent
        className="overflow-auto"
        style={{
          height: `calc(100vh - 200px)`,
          maxHeight: `${containerHeight - 100}px`,
        }}
      >
        <ReactECharts
          option={chartOptions}
          style={{
            height: "100%",
            width: "100%",
            minHeight: `${containerHeight - 100}px`
          }}
          opts={{ renderer: "svg" }}
        />
      </CardContent>
    </Card>
  );
}