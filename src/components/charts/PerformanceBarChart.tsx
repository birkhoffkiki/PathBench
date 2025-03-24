"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BarSeriesOption, DefaultLabelFormatterCallbackParams, EChartsOption } from "echarts";


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
          ? performance.metrics[selectedMetric] // 这是一个数组，例如 [1, 2]
          : null;
      });

      return {
        name: model.name,
        type: "bar",
        data: data.map(item => item ? item.reduce((sum, value) => sum + value, 0) / item.length : null), // 计算每个数组的平均值
        label: {
          show: true,
          position: 'top',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) => {
            const value = params.value; // 获取当前柱子的值
            return value !== null && value !== undefined ? value.toFixed(3) : ''; // 显示平均值，保留两位小数
          },
        },
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
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: filteredModels.map(m => m.name),
        bottom: 0,
        type: "scroll",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: {
          interval: 0,
          rotate: 0,
          // overflow: "",
          width: 120,
        },
      },
      yAxis: {
        type: "value",
        name: selectedMetric,
        min: minValue * 0.9, // 设置 y 轴最小值为数据最小值的 90%
        max: maxValue * 1.1, // 设置 y 轴最大值为数据最大值的 110%
      },
      series,
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
    <Card className="w-full h-[500px]">
      <CardHeader>
        <CardTitle>Model Performance</CardTitle>
        <CardDescription>
          {selectedTask
            ? `${selectedTask.name} (${selectedMetric || "Select a metric"})`
            : `Comparison across tasks (${selectedMetric || "Select a metric"})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ReactECharts
          option={chartOptions}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </CardContent>
    </Card>
  );
}

