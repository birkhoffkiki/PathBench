"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import React, { useMemo, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { EChartsOption, PieSeriesOption } from "echarts";


export function PieDataDistributionChart() {
  const {
    allTasks
  } = useEvaluation();

  // Use React state for responsive design instead of window object
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const chartOptions = useMemo((): EChartsOption => {
    if (allTasks.length === 0) {
      return {
        title: {
          text: "No tasks available",
          left: "center",
        },
        tooltip: {},
        series: [],
      };
    }

    // 按评估指标分组并计算任务数量
    const metricTaskCounts: Record<string, number> = {};

    // 统计每个评估指标的任务数量
    allTasks.forEach(task => {
      task.evaluationMetrics.forEach(metric => {
        metricTaskCounts[metric] = (metricTaskCounts[metric] || 0) + 1;
      });
    });

    // 格式化数据用于饼图
    const data = Object.entries(metricTaskCounts).map(([metric, taskCount]) => {
      return {
        name: metric,
        value: taskCount,
      };
    });

    //  任务总数
    const totalTasks = Object.values(metricTaskCounts).reduce((sum, count) => sum + count, 0);

    // 创建饼图系列
    const pieSeries: PieSeriesOption = {
      name: "Task Distribution",
      type: "pie",
      radius: isMobile ? ["35%", "65%"] : ["45%", "75%"], // Moderate size for better balance
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
  }, [allTasks, isMobile]);

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