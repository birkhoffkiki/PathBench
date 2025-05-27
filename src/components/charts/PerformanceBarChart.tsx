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



const generateColors = (count: number): string[] => {

  const baseColors = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#48b8b8'
  ];

  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  } else {
    const colors = [...baseColors];
    const generateColor = (index: number): string => {
      const hue = (index * 137.508) % 360;
      const saturation = 65 + Math.sin(index) * 10;
      const lightness = 55 + Math.cos(index) * 10;
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

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


    const colors = generateColors(filteredModels.length);


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


    const taskIds = new Set<string>();
    taskPerformances.forEach(p => taskIds.add(p.taskId));

    const sortedTaskIds = Array.from(taskIds);


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
          rotate: 90,
          distance: 5,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) => {
            const value = params.value;
            return value !== null && value !== undefined ? (value as number).toFixed(3) : '';
          },
          fontSize: 12,
          color: '#000',
          fontWeight: 'normal',
          align: 'left',
          verticalAlign: 'middle'
        },
        itemStyle: {
          color: colors[index]
        },
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


    const categories = sortedTaskIds.map(taskId => {
      const task = getTaskById(taskId);
      return task ? task.name : taskId;
    });

    const allValues = series.flatMap(s => s.data).filter(value => value !== null) as number[];
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);


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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const paramArray = Array.isArray(params) ? params : [params];

          const categoryName = paramArray[0].axisValue;
          const tooltipContent = [
            `<div style="
              font-weight:bold;
              margin-bottom:8px;
              padding-bottom:8px;
              border-bottom:1px solid #eee;
            ">${categoryName}</div>`
          ];


          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const values = paramArray.map((param: any) => param.value).filter((v: any) => v != null) as number[];
          const max = Math.max(...values);
          const min = Math.min(...values);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          paramArray.forEach((param: any) => {
            const value = param.value;
            const formattedValue = value !== null && value !== undefined
              ? formatNumber(value as number, 3).toFixed(3)
              : 'N/A';


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