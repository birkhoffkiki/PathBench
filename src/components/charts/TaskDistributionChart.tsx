"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { EChartsOption, PieSeriesOption } from "echarts";

interface TaskDistributionChartProps {
  chartType?: "organ" | "taskType";
}

export function TaskDistributionChart({ chartType = "organ" }: TaskDistributionChartProps) {
  const {
    getFilteredTasks,
  } = useEvaluation();

  const chartOptions = useMemo((): EChartsOption => {
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
      return {
        title: {
          text: "No tasks available",
          left: "center",
        },
        tooltip: {},
        series: [],
      };
    }

    // Generate data based on chart type
    if (chartType === "organ") {
      // Count tasks by organ
      const organCounts: Record<string, number> = {};
      filteredTasks.forEach(task => {
        const organ = task.organ;
        organCounts[organ] = (organCounts[organ] || 0) + 1;
      });

      // Format data for pie chart
      const data = Object.entries(organCounts).map(([organ, count]) => {
        return {
          name: organ,
          value: count,
        };
      });

      // Create pie series
      const pieSeries: PieSeriesOption = {
        name: "Organ Distribution",
        type: "pie",
        radius: ["45%", "75%"], // Donut chart
        center: ["65%", "60%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data,
      };

      return {
        // Optimize animations for better performance
        animation: true,
        animationDuration: 600,
        animationEasing: 'cubicOut',
        animationDelay: function (idx: number) {
          return idx * 50;
        },
        animationDurationUpdate: 300,
        animationEasingUpdate: 'cubicOut',

        title: {
          text: "Task Distribution by Organ",
          top: '4.5%',
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: 5,
          top: '42.5%',
          type: "scroll",
          z: 0,
          textStyle: {
            fontSize: 14,
            color: '#333',
          },
        },
        series: [pieSeries],
      };
    } else {
      // Count tasks by task type
      const taskTypeCounts: Record<string, number> = {};
      filteredTasks.forEach(task => {
        const taskType = task.taskType;
        taskTypeCounts[taskType] = (taskTypeCounts[taskType] || 0) + 1;
      });

      // Format data for pie chart
      const data = Object.entries(taskTypeCounts).map(([taskType, count]) => {
        return {
          name: taskType.replace('_', ' '),
          value: count,
        };
      });

      // Create pie series
      const pieSeries: PieSeriesOption = {
        name: "Task Type Distribution",
        type: "pie",
        radius: ["45%", "75%"],
        center: ["70%", "60%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data,
      };

      return {
        // Optimize animations for better performance
        animation: true,
        animationDuration: 600,
        animationEasing: 'cubicOut',
        animationDelay: function (idx: number) {
          return idx * 50;
        },
        animationDurationUpdate: 300,
        animationEasingUpdate: 'cubicOut',

        title: {
          text: "Task Distribution by Type",
          top: '4.5%',
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: 0,
          top: '42.5%',
          type: "scroll",
          z: 0,
          textStyle: {
            fontSize: 14,
            color: '#333',
          },
        },
        series: [pieSeries],
      };
    }
  }, [getFilteredTasks, chartType]);

  return (
    <Card className="w-full h-[300px]">
      <CardContent className="h-[300px]">
        <ReactECharts
          option={chartOptions}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </CardContent>
    </Card>
  );
}
