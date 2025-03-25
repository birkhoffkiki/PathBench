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
    getOrganById,
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
        const organId = task.organId;
        organCounts[organId] = (organCounts[organId] || 0) + 1;
      });

      // Format data for pie chart
      const data = Object.entries(organCounts).map(([organId, count]) => {
        const organ = getOrganById(organId);
        return {
          name: organ ? organ.name : organId,
          value: count,
        };
      });

      // Create pie series
      const pieSeries: PieSeriesOption = {
        name: "Organ Distribution",
        type: "pie",
        radius: ["40%", "70%"], // Donut chart
        center: ["60%", "50%"],
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
        title: {
          text: "Task Distribution by Organ",
          left: "right",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: 10,
          top: "middle",
          type: "scroll",
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
        radius: ["40%", "70%"],
        center: ["60%", "50%"],
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
        title: {
          text: "Task Distribution by Type",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: 10,
          top: "middle",
          type: "scroll",
        },
        series: [pieSeries],
      };
    }
  }, [getFilteredTasks, getOrganById, chartType]);

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
