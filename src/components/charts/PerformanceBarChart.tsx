// "use client";

// import { useEvaluation } from "@/context/EvaluationContext";
// import React, { useMemo } from "react";
// import ReactECharts from "echarts-for-react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import type { BarSeriesOption, DefaultLabelFormatterCallbackParams, EChartsOption } from "echarts";


// interface PerformanceBarChartProps {
//   selectedMetric?: string;
//   selectedTaskId?: string;
// }


// export function PerformanceBarChart({ selectedMetric, selectedTaskId }: PerformanceBarChartProps) {
//   const {
//     getFilteredPerformances,
//     getFilteredModels,
//     getTaskById,
//     getModelById
//   } = useEvaluation();

//   const chartOptions = useMemo((): EChartsOption => {
//     const filteredPerformances = getFilteredPerformances();
//     const filteredModels = getFilteredModels();

//     // Filter performances for the selected task if provided
//     const taskPerformances = selectedTaskId
//       ? filteredPerformances.filter(p => p.taskId === selectedTaskId)
//       : filteredPerformances;

//     if (taskPerformances.length === 0 || !selectedMetric) {
//       return {
//         title: {
//           text: "No data available",
//           left: "center",
//         },
//         tooltip: {},
//         xAxis: { type: "category", data: [] },
//         yAxis: { type: "value" },
//         series: [],
//       };
//     }

//     // Process data for the chart
//     const taskIds = new Set<string>();
//     taskPerformances.forEach(p => taskIds.add(p.taskId));

//     const sortedTaskIds = Array.from(taskIds);

//     // Create series for each model
//     const series: BarSeriesOption[] = filteredModels.map(model => {
//       const data = sortedTaskIds.map(taskId => {
//         const performance = taskPerformances.find(
//           p => p.modelId === model.id && p.taskId === taskId
//         );
//         return performance && performance.metrics[selectedMetric]
//           ? performance.metrics[selectedMetric] // 这是一个数组，例如 [1, 2]
//           : null;
//       });

//       return {
//         name: model.name,
//         type: "bar",
//         data: data.map(item => item ? item.reduce((sum, value) => sum + value, 0) / item.length : null), // 计算每个数组的平均值
//         label: {
//           show: true,
//           position: 'top',
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           formatter: (params: any) => {
//             const value = params.value; // 获取当前柱子的值
//             return value !== null && value !== undefined ? value.toFixed(3) : ''; // 显示平均值，保留两位小数
//           },
//         },
//       };
//     });

//     // Create x-axis categories from task names
//     const categories = sortedTaskIds.map(taskId => {
//       const task = getTaskById(taskId);
//       return task ? task.name : taskId;
//     });

//     const allValues = series.flatMap(s => s.data).filter(value => value !== null) as number[];
//     const minValue = Math.min(...allValues);
//     const maxValue = Math.max(...allValues);

//     // Create chart options
//     return {
//       title: {
//         text: selectedTaskId
//           ? `${getTaskById(selectedTaskId)?.name} - ${selectedMetric} Performance`
//           : `${selectedMetric} Performance Across Tasks`,
//         left: "center",
//       },
//       tooltip: {
//         trigger: "axis",
//         axisPointer: {
//           type: "shadow",
//         },
//       },
//       legend: {
//         data: filteredModels.map(m => m.name),
//         bottom: 0,
//         type: "scroll",
//       },
//       grid: {
//         left: "3%",
//         right: "4%",
//         bottom: "15%",
//         top: "15%",
//         containLabel: true,
//       },
//       xAxis: {
//         type: "category",
//         data: categories,
//         axisLabel: {
//           interval: 0,
//           width: 120,
//         },
//       },
//       yAxis: {
//         type: "value",
//         name: selectedMetric,
//         min: minValue * 0.9, // 设置 y 轴最小值为数据最小值的 90%
//         max: maxValue * 1.1, // 设置 y 轴最大值为数据最大值的 110%
//       },
//       series,
//     };
//   }, [
//     getFilteredPerformances,
//     getFilteredModels,
//     getTaskById,
//     selectedMetric,
//     selectedTaskId
//   ]);



//   const selectedTask = selectedTaskId ? getTaskById(selectedTaskId) : undefined;

//   return (
//     <Card className="w-full h-[500px]">
//       <CardHeader>
//         <CardTitle>Model Performance</CardTitle>
//         <CardDescription>
//           {selectedTask
//             ? `${selectedTask.name} (${selectedMetric || "Select a metric"})`
//             : `Comparison across tasks (${selectedMetric || "Select a metric"})`}
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="h-[400px]">
//         <ReactECharts
//           option={chartOptions}
//           style={{ height: "100%", width: "100%" }}
//           opts={{ renderer: "svg" }}
//         />
//       </CardContent>
//     </Card>
//   );
// }





"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BarSeriesOption, EChartsOption } from "echarts";

interface PerformanceBarChartProps {
  selectedMetric?: string;
  selectedTaskId?: string;
}

export function PerformanceBarChart({ selectedMetric, selectedTaskId }: PerformanceBarChartProps) {
  const {
    getFilteredPerformances,
    getFilteredModels,
    getTaskById,
    getModelById
  } = useEvaluation();

  const chartOptions = useMemo((): EChartsOption => {
    const filteredPerformances = getFilteredPerformances();
    const filteredModels = getFilteredModels();

    // Filter performances for the selected task if provided
    const taskPerformances = selectedTaskId
      ? filteredPerformances.filter(p => p.taskId === selectedTaskId)
      : filteredPerformances;

    if (taskPerformances.length === 0 || !selectedMetric) {
      return {
        title: {
          text: "No data available",
          left: "center",
        },
        tooltip: {},
        xAxis: { type: "category", data: [] },
        yAxis: { type: "value" },
        series: [],
      };
    }

    // Process data for the chart
    const taskIds = new Set<string>();
    taskPerformances.forEach(p => taskIds.add(p.taskId));

    const sortedTaskIds = Array.from(taskIds);

    // Create series for each model
    const series: BarSeriesOption[] = filteredModels.map(model => {
      const data = sortedTaskIds.map(taskId => {
        const performance = taskPerformances.find(
          p => p.modelId === model.id && p.taskId === taskId
        );
        return performance && performance.metrics[selectedMetric]
          ? performance.metrics[selectedMetric]
          : null;
      });

      return {
        name: model.name,
        type: "bar",
        data: data.map(item => item ? item.reduce((sum, value) => sum + value, 0) / item.length : null),
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            const value = params.value;
            return value !== null && value !== undefined ? value.toFixed(3) : '';
          },
        },
        emphasis: {
          focus: 'series'
        },
        barMaxWidth: '50%', // 控制柱子的最大宽度
      };
    });

    // Create x-axis categories from task names
    const categories = sortedTaskIds.map(taskId => {
      const task = getTaskById(taskId);
      return task ? task.name : taskId;
    });

    const allValues = series.flatMap(s => s.data).filter(value => value !== null) as number[];
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    // Create chart options
    return {
      title: {
        text: selectedTaskId
          ? `${getTaskById(selectedTaskId)?.name} - ${selectedMetric} Performance`
          : `${selectedMetric} Performance Across Tasks`,
        left: "center",
        top: 10,
        textStyle: {
          fontSize: 16,
        }
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        confine: true, // 确保提示框不会超出画布
      },
      legend: {
        data: filteredModels.map(m => m.name),
        bottom: 35,
        type: "scroll",
        width: '80%',
        textStyle: {
          overflow: 'truncate',
          width: 100,
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '25%',
        top: '15%',
        containLabel: true,
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          bottom: 80,
          height: 20,
          start: 0,
          end: Math.min(100, Math.max(100 * (6 / categories.length), 20)), // 动态计算初始显示范围
          zoomLock: false, // 允许缩放
          brushSelect: true,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          start: 0,
          end: 100,
          zoomOnMouseWheel: 'shift', // 按住 shift 键时才能缩放
          moveOnMouseMove: true, // 允许鼠标拖动
        }
      ],
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: {
          interval: 0,
          rotate: 0, // 旋转标签以防止重叠
          width: 100,
          overflow: 'break',
          formatter: (value: string) => {
            const maxLength = 50;
            if (value.length > maxLength) {
              return value.substring(0, maxLength) + '...';
            }
            return value;
          }
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: "value",
        name: selectedMetric,
        nameLocation: 'middle',
        nameGap: 50,
        min: minValue * 0.9,
        max: maxValue * 1.1,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series,
      animation: true,
    };
  }, [
    getFilteredPerformances,
    getFilteredModels,
    getTaskById,
    selectedMetric,
    selectedTaskId
  ]);

  const selectedTask = selectedTaskId ? getTaskById(selectedTaskId) : undefined;

  return (
    <Card className="w-full h-[600px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Model Performance</CardTitle>
        <CardDescription>
          {selectedTask
            ? `${selectedTask.name} (${selectedMetric || "Select a metric"})`
            : `Comparison across tasks (${selectedMetric || "Select a metric"})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[480px]">
        <ReactECharts
          option={chartOptions}
          style={{ height: "100%", width: "100%" }}
          opts={{ 
            renderer: "svg",
            width: 'auto',
            height: 'auto'
          }}
          notMerge={true}
        />
      </CardContent>
    </Card>
  );
}