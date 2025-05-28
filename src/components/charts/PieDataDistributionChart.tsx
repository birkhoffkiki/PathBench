"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import React, { useMemo, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent } from "@/components/ui/card";
import type { EChartsOption, PieSeriesOption } from "echarts";


interface PieDataDistributionChartProps {
  selectedMetrics?: string[];
}

export function PieDataDistributionChart({ selectedMetrics = [] }: PieDataDistributionChartProps) {
  const {
    getFilteredTasks,
    getFilteredPerformances
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
    const filteredPerformances = getFilteredPerformances();

    if (filteredTasks.length === 0 || filteredPerformances.length === 0) {
      return {
        title: {
          text: "No tasks available",
          left: "center",
        },
        tooltip: {},
        series: [],
      };
    }

    // 按评估指标分组并计算任务数量 - 基于实际的performance数据
    const metricTaskSets: Record<string, Set<string>> = {};

    // 获取所有filtered tasks的ID集合
    const filteredTaskIds = new Set(filteredTasks.map(task => task.id));

    // 确定要显示的metrics
    // 如果没有选择metrics或选择了所有metrics，显示所有可用的metrics
    // 如果选择了特定metrics，只显示选中的metrics
    const allAvailableMetrics = new Set<string>();
    filteredPerformances.forEach((performance: any) => {
      if (filteredTaskIds.has(performance.taskId)) {
        Object.keys(performance.metrics).forEach(metric => {
          if (performance.metrics[metric] && performance.metrics[metric].length > 0) {
            allAvailableMetrics.add(metric);
          }
        });
      }
    });

    const allMetricsArray = Array.from(allAvailableMetrics);
    const isOverallMode = selectedMetrics.length === 0 ||
                         (selectedMetrics.length === allMetricsArray.length &&
                          selectedMetrics.every(m => allMetricsArray.includes(m)));

    const metricsToShow = isOverallMode ? allMetricsArray : selectedMetrics;

    // 统计每个评估指标在filtered tasks中的实际分布
    filteredPerformances.forEach((performance: any) => {
      // 只处理filtered tasks中的performance
      if (filteredTaskIds.has(performance.taskId)) {
        Object.keys(performance.metrics).forEach(metric => {
          // 只统计要显示的metrics
          if (metricsToShow.includes(metric)) {
            // 检查这个metric是否有有效数据
            if (performance.metrics[metric] && performance.metrics[metric].length > 0) {
              // 使用Set来确保每个task只被计算一次
              if (!metricTaskSets[metric]) {
                metricTaskSets[metric] = new Set();
              }
              metricTaskSets[metric].add(performance.taskId);
            }
          }
        });
      }
    });

    // 转换Set为数字计数
    const finalMetricCounts: Record<string, number> = {};
    Object.entries(metricTaskSets).forEach(([metric, taskSet]) => {
      finalMetricCounts[metric] = taskSet.size;
    });

    // 格式化数据用于饼图
    const data = Object.entries(finalMetricCounts).map(([metric, taskCount]) => {
      return {
        name: metric,
        value: taskCount,
      };
    });



    // 创建饼图系列
    const pieSeries: PieSeriesOption = {
      name: "Task Distribution",
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
        text: "Task Distribution by Metric",
        top: isMobile ? '2%' : '1%', // Higher on mobile too
        left: "center",
        z: 0,
        textStyle: {
          fontSize: isMobile ? 14 : 18, // Larger font on desktop
          fontWeight: 'bold',
        }
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} Tasks ({d}%)",
        z: 4,
      },
      legend: {
        orient: "vertical",
        left: isMobile ? 5 : 10,
        top: isMobile ? '47.5%' : '47.5%', // Adjust for fewer legend items
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
  }, [getFilteredTasks, getFilteredPerformances, selectedMetrics, isMobile, isMediumScreen]);

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