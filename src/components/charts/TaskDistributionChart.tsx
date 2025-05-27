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
          textStyle: {
            fontSize: (typeof window !== 'undefined' && window.innerWidth < 768) ? 14 : 16,
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: (typeof window !== 'undefined' && window.innerWidth < 768) ? "horizontal" : "vertical",
          left: (typeof window !== 'undefined' && window.innerWidth < 768) ? "center" : 5,
          top: (typeof window !== 'undefined' && window.innerWidth < 768) ? 'bottom' : '42.5%',
          bottom: (typeof window !== 'undefined' && window.innerWidth < 768) ? 10 : undefined,
          type: "scroll",
          z: 0,
          textStyle: {
            fontSize: (typeof window !== 'undefined' && window.innerWidth < 768) ? 12 : 14,
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
          textStyle: {
            fontSize: (typeof window !== 'undefined' && window.innerWidth < 768) ? 14 : 16,
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: (typeof window !== 'undefined' && window.innerWidth < 768) ? "horizontal" : "vertical",
          left: (typeof window !== 'undefined' && window.innerWidth < 768) ? "center" : 0,
          top: (typeof window !== 'undefined' && window.innerWidth < 768) ? 'bottom' : '42.5%',
          bottom: (typeof window !== 'undefined' && window.innerWidth < 768) ? 10 : undefined,
          type: "scroll",
          z: 0,
          textStyle: {
            fontSize: (typeof window !== 'undefined' && window.innerWidth < 768) ? 12 : 14,
            color: '#333',
          },
        },
        series: [pieSeries],
      };
    }
  }, [getFilteredTasks, chartType]);

  return (
    <Card className="w-full h-[250px] sm:h-[300px]">
      <CardContent className="h-[250px] sm:h-[300px] p-2 sm:p-6">
        <ReactECharts
          option={chartOptions}
          style={{ height: "100%", width: "100%" }}
          opts={{
            renderer: "svg",
            devicePixelRatio: (typeof window !== 'undefined' && window.innerWidth < 768) ? 1 : 2
          }}
        />
      </CardContent>
    </Card>
  );
}
