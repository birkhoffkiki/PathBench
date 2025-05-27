"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { EChartsOption, PieSeriesOption } from "echarts";


export function PieDataDistributionChart() {
  const {
    allTasks,
    allPerformances
  } = useEvaluation();

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

    // 按organ分组并计算任务数量
    const organTaskCounts: Record<string, number> = {};
    allTasks.forEach(task => {
      const organ = task.organ;
      organTaskCounts[organ] = (organTaskCounts[organ] || 0) + 1;
    });

    // 格式化数据用于饼图
    const data = Object.entries(organTaskCounts).map(([organ, taskCount]) => {
      return {
        name: organ,
        value: taskCount,
      };
    });

    //  任务总数
    const totalTasks = Object.values(organTaskCounts).reduce((sum, count) => sum + count, 0);

    // 创建饼图系列
    const pieSeries: PieSeriesOption = {
      name: "Task Distribution",
      type: "pie",
      radius: ["45%", "75%"],
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
        z: 0,
        textStyle: {
          fontSize: (typeof window !== 'undefined' && window.innerWidth < 768) ? 14 : 16,
        }
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} Tasks ({d}%)",
        z: 4,
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
  }, [allTasks]);

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