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

const formatNumber = (value: number, decimals: number = 3): number => {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};


// 添加颜色生成工具函数
const generateColors = (count: number): string[] => {
  // 预定义的基础颜色方案
  const baseColors = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#48b8b8'
  ];

  if (count <= baseColors.length) {
    // 如果模型数量小于等于基础颜色数量，直接返回对应数量的颜色
    return baseColors.slice(0, count);
  } else {
    // 如果模型数量超过基础颜色，生成额外的颜色
    const colors = [...baseColors];
    const generateColor = (index: number): string => {
      // 使用 HSL 色彩空间生成颜色
      // H: 色相 (0-360)
      // S: 饱和度 (0-100%)
      // L: 亮度 (0-100%)
      const hue = (index * 137.508) % 360; // 使用黄金角度来分散色相
      const saturation = 65 + Math.sin(index) * 10; // 60-70% 的饱和度
      const lightness = 55 + Math.cos(index) * 10;  // 50-60% 的亮度
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    // 生成额外需要的颜色
    for (let i = baseColors.length; i < count; i++) {
      colors.push(generateColor(i));
    }
    return colors;
  }
};


export function PerformanceBarChart({ selectedMetric, selectedTaskId }: PerformanceBarChartProps) {
  const {
    getFilteredPerformances,
    getFilteredModels,
    getTaskById,
  } = useEvaluation();

  const chartOptions = useMemo((): EChartsOption => {
    const filteredPerformances = getFilteredPerformances();
    const filteredModels = getFilteredModels();

    // 生成与模型数量相匹配的颜色方案
    const colors = generateColors(filteredModels.length);

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
    const series: BarSeriesOption[] = filteredModels.map((model, index) => {
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
          rotate: 90, // 标签旋转90度
          distance: 5, // 调整标签与柱子的距离
          formatter: (params: any) => {
            const value = params.value;
            return value !== null && value !== undefined ? value.toFixed(3) : '';
          },
          fontSize: 12, // 基础字体大小
          color: '#000',
          fontWeight: 'normal',
          align: 'left',
          verticalAlign: 'middle'
        },
        itemStyle: {
          color: colors[index] // 使用对应索引的颜色
        },
        // 在 emphasis 中保持一致的颜色，但可以调整透明度
        emphasis: {
          itemStyle: {
            color: colors[index],
            opacity: 0.8
          }
        },

        barMaxWidth: '50%',
        animation: true,
        animationDuration: 300
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
      color: colors,
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
        confine: true,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          color: '#333',
        },
        formatter: (params: any) => {
          if (!Array.isArray(params)) {
            params = [params];
          }

          const categoryName = params[0].axisValue;
          const tooltipContent = [
            `<div style="
              font-weight:bold;
              margin-bottom:8px;
              padding-bottom:8px;
              border-bottom:1px solid #eee;
            ">${categoryName}</div>`
          ];

          // 计算最大值和最小值
          const values = params.map((param: any) => param.value).filter((v: any) => v != null);
          const max = Math.max(...values);
          const min = Math.min(...values);

          params.forEach((param: any) => {
            const value = param.value;
            const formattedValue = value !== null && value !== undefined
              ? formatNumber(value, 3).toFixed(3)
              : 'N/A';

            // 为最大值和最小值添加特殊标记
            let specialMarker = '';
            if (value === max) specialMarker = ' 📈';
            if (value === min) specialMarker = ' 📉';

            tooltipContent.push(
              `<div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin:3px 0;
                ${value === max ? 'color:#f5222d;' : ''}
                ${value === min ? 'color:#52c41a;' : ''}
              ">
                <span>${param.marker}${param.seriesName}${specialMarker}</span>
                <span style="font-weight:bold;margin-left:15px;">${formattedValue}</span>
              </div>`
            );
          });

          // 添加额外的统计信息
          if (values.length > 0) {
            const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
            tooltipContent.push(
              `<div style="
                margin-top:8px;
                padding-top:8px;
                border-top:1px solid #eee;
                font-size:0.9em;
                color:#666;
              ">
                Average: ${formatNumber(avg, 3).toFixed(3)}
              </div>`
            );
          }

          return tooltipContent.join('');
        }
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
          end: Math.min(100, Math.max(100 * (6 / categories.length), 20)),
          zoomLock: false,
          brushSelect: true,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          start: 0,
          end: 100,
          zoomOnMouseWheel: 'shift',
          moveOnMouseMove: true,
        }
      ],
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: {
          interval: 0,
          rotate: 0,
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
        min: formatNumber(minValue * 0.9, 1),
        max: formatNumber(maxValue * 1, 1),
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series,
      animation: true,
      // 添加字体大小自适应配置
      media: [
        {
          query: {}, // 默认配置
          option: {
            series: series.map(s => ({
              ...s,
              label: {
                ...s.label,
                fontSize: 12 // 基础字体大小
              }
            }))
          }
        },
        {
          query: {
            maxWidth: 500 // 当宽度小于500px时
          },
          option: {
            series: series.map(s => ({
              ...s,
              label: {
                ...s.label,
                fontSize: 10 // 较小字体
              }
            }))
          }
        },
        {
          query: {
            maxWidth: 300 // 当宽度小于300px时
          },
          option: {
            series: series.map(s => ({
              ...s,
              label: {
                ...s.label,
                fontSize: 8 // 最小字体
              }
            }))
          }
        }
      ]
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