"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import React, { useMemo, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent } from "@/components/ui/card";
import type { EChartsOption, PieSeriesOption } from "echarts";

interface TaskDistributionChartProps {
  chartType?: "organ" | "taskType";
}

export function TaskDistributionChart({ chartType = "organ" }: TaskDistributionChartProps) {
  const {
    getFilteredTasks,
  } = useEvaluation();

  // Use React state for responsive design instead of window object
  const [isMobile, setIsMobile] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsMediumScreen(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

      // Format data for pie chart (let ECharts use default colors)
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
        radius: isMobile ? ["35%", "65%"] : isMediumScreen ? ["40%", "70%"] : ["45%", "75%"], // Responsive sizes: mobile, medium, desktop
        center: isMobile ? ["65%", "55%"] : ["60%", "55%"], // Move down for more space from title
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
            fontSize: isMobile ? 14 : 16,
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
          top: isMobile ? '2%' : '1%', // Higher on mobile too
          left: "center",
          textStyle: {
            fontSize: isMobile ? 14 : 18, // Larger font on desktop
            fontWeight: 'bold',
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: isMobile ? 5 : 10,
          top: isMobile ? '30%' : '30%', // Move down to match pie chart center
          bottom: undefined,
          type: "scroll",
          z: 0,
          textStyle: {
            fontSize: isMobile ? 13 : 16, // Larger font for mobile too
            color: '#333',
          },
          itemWidth: isMobile ? 12 : 16, // Slightly larger icons for mobile
          itemHeight: isMobile ? 12 : 16,
          itemGap: isMobile ? 8 : 15, // More spacing for mobile
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

      // Format data for pie chart with custom order
      const taskTypeOrder = ['Classification', 'DFS Prediction', 'DSS Prediction', 'OS Prediction'];
      const data = taskTypeOrder
        .filter(taskType => taskTypeCounts[taskType] > 0) // Only include types that exist
        .map(taskType => ({
          name: taskType,
          value: taskTypeCounts[taskType],
        }));

      // Create pie series
      const pieSeries: PieSeriesOption = {
        name: "Task Type Distribution",
        type: "pie",
        radius: isMobile ? ["35%", "65%"] : isMediumScreen ? ["35%", "65%"] : ["45%", "75%"], // Responsive sizes: mobile, medium, desktop
        center: isMobile ? ["65%", "55%"] : ["70%", "55%"], // Move down and right for better spacing
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
            fontSize: isMobile ? 14 : 16,
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
          top: isMobile ? '2%' : '1%', // Higher on mobile too
          left: "center",
          textStyle: {
            fontSize: isMobile ? 14 : 18, // Larger font on desktop
            fontWeight: 'bold',
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: isMobile ? 5 : 2.5,
          top: isMobile ? '37.5%' : '37.5%', // Move down to match pie chart center
          bottom: undefined,
          type: "scroll",
          z: 0,
          textStyle: {
            fontSize: isMobile ? 13 : 16, // Larger font for mobile too
            color: '#333',
          },
          itemWidth: isMobile ? 12 : 16, // Slightly larger icons for mobile
          itemHeight: isMobile ? 12 : 16,
          itemGap: isMobile ? 8 : 15, // More spacing for mobile
        },
        series: [pieSeries],
      };
    }
  }, [getFilteredTasks, chartType, isMobile, isMediumScreen]);

  return (
    <Card className="w-full h-[250px] sm:h-[350px]">
      <CardContent className="h-[250px] sm:h-[350px] p-2 sm:p-6">
        <ReactECharts
          option={chartOptions}
          style={{ height: "100%", width: "100%" }}
          opts={{
            renderer: "svg",
            devicePixelRatio: isMobile ? 1 : 2
          }}
        />
      </CardContent>
    </Card>
  );
}
