"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { EChartsOption, PieSeriesOption } from "echarts";


export function PieDataDistributionChart() {
  const {
    allTasks,
    getOrganById
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

    // 按organId分组并汇总wsis数量
    const organWsisCounts: Record<string, number> = {};
    allTasks.forEach(task => {
      const organId = task.organId;
      organWsisCounts[organId] = (organWsisCounts[organId] || 0) + task.wsis;
    });

    // 格式化数据用于饼图
    const data = Object.entries(organWsisCounts).map(([organId, wsisCount]) => {
      const organ = getOrganById(organId);
      return {
        name: organ ? organ.name : organId,
        value: wsisCount,
      };
    });

    //  WSI总数
    const totalWsis = Object.values(organWsisCounts).reduce((sum, count) => sum + count, 0);

    // 创建饼图系列
    const pieSeries: PieSeriesOption = {
      name: "WSIs Distribution",
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
      title: {
        text: "WSI Distribution by Organ",
        top: '4.5%',
        left: "center",
        z: 0,
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} WSIs ({d}%)",
        z: 4,
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
  }, [allTasks, getOrganById]);

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