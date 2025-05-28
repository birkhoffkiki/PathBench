"use client";

import React from "react";
import { useEvaluation } from "@/context/EvaluationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Performance, Task } from "@/types/index";
import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";


type SortField = 'taskName' | 'cohort' | string;
type SortDirection = 'asc' | 'desc' | null;

export function LeaderboardTable() {
  const { getFilteredModels, getFilteredPerformances, getFilteredTasks } = useEvaluation();
  const allModels = getFilteredModels();
  const performances = getFilteredPerformances();
  const tasks = getFilteredTasks();

  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const getMetricsArray = (performance: Performance | null | undefined, taskType: string) => {
    if (!performance) return null;
    if (taskType === 'Classification') return performance.metrics['AUC'];
    if (taskType === 'OS Prediction') return performance.metrics['C-Index'];
    if (taskType === 'DFS Prediction') return performance.metrics['C-Index'];
    if (taskType === 'DSS Prediction') return performance.metrics['C-Index'];
    if (taskType === 'Report Generation') return performance.metrics['BLEU'];
    return null;
  };

  const calculateAverage = (metricsArray: number[] | null | undefined) => {
    if (!metricsArray || metricsArray.length === 0) return null;
    return metricsArray.reduce((sum, val) => sum + val, 0) / metricsArray.length;
  };

  // Calculate top 5 models for each task
  const calculateTaskTopModels = (task: Task) => {
    const taskResults = allModels.map(model => {
      const performance = performances.find(p =>
        p.modelID === model.name && p.taskId === task.id
      );
      const metrics = getMetricsArray(performance, task.taskType);
      const average = calculateAverage(metrics);
      return { model, average };
    });

    // Sort by performance and take top 5
    return taskResults
      .filter(result => result.average !== null)
      .sort((a, b) => b.average! - a.average!)
      .slice(0, 5)
      .map(result => result.model);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc');
      if (sortDirection === 'desc') {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };



  const getPerformanceLevel = (average: number | null, rank: number) => {
    if (average === null) return 'none';
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    // All non-top-3 performances use blue styling
    return 'standard';
  };



  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="ml-1 h-3 w-3 text-muted-foreground" />;
    }
    return sortDirection === 'asc' ?
      <ChevronUp className="ml-1 h-3 w-3" /> :
      <ChevronDown className="ml-1 h-3 w-3" />;
  };

  // Sort tasks if needed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: string | number = '';
    let bValue: string | number = '';

    if (sortField === 'taskName') {
      aValue = a.name;
      bValue = b.name;
    } else if (sortField === 'cohort') {
      aValue = a.cohort;
      bValue = b.cohort;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
  });

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
      <CardHeader className="pb-3 sm:pb-4 border-b border-slate-200/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Performance Leaderboard
            </CardTitle>
            <p className="text-sm text-slate-600 font-medium">
              Comparative Analysis of Model Performance Across Tasks
            </p>
          </div>
          <div className="flex flex-row gap-3 sm:gap-3 text-xs sm:text-sm w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200 flex-1 sm:flex-none justify-center sm:justify-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-semibold text-blue-700">{allModels.length}</span>
              <span className="text-blue-600">Models</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200 flex-1 sm:flex-none justify-center sm:justify-start">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="font-semibold text-emerald-700">{sortedTasks.length}</span>
              <span className="text-emerald-600">Tasks</span>
            </div>
          </div>
        </div>
        <div className="text-xs sm:text-sm text-slate-500 mt-3 hidden sm:flex items-center gap-2">
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <span>Click column headers to sort</span>
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <span>Displaying top 5 performing models per task</span>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2 sm:pt-0">
        {/* Mobile Card Layout */}
        <div className="block sm:hidden">
          <div className="space-y-4 px-4 pt-2 pb-4">
            {sortedTasks.map((task) => (
              <Card key={task.id} className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-sm leading-tight mb-2">{task.name}</h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium capitalize">
                          {task.taskType.replace('_', ' ')}
                        </span>
                        <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                        <span className="font-semibold text-blue-600">{task.organ}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold ml-3">
                      {task.cohort}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {calculateTaskTopModels(task).slice(0, 3).map((model, index) => {
                      const performance = performances.find(p =>
                        p.modelID === model.name && p.taskId === task.id
                      );
                      const metrics = getMetricsArray(performance, task.taskType);
                      const average = calculateAverage(metrics);
                      const rank = index + 1;

                      const getMobileRankDisplay = (rank: number) => {
                        switch (rank) {
                          case 1: return { icon: "🥇", text: "#1" };
                          case 2: return { icon: "🥈", text: "#2" };
                          case 3: return { icon: "🥉", text: "#3" };
                          default: return { icon: "", text: `#${rank}` };
                        }
                      };

                      const rankDisplay = getMobileRankDisplay(rank);

                      return (
                        <div key={model.name} className="flex justify-between items-center py-2 px-3 bg-white rounded-lg border border-slate-200/60 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 min-w-[45px]">
                              {rankDisplay.icon && <span className="text-base">{rankDisplay.icon}</span>}
                              <span className="text-xs font-bold text-slate-600">{rankDisplay.text}</span>
                            </div>
                            <span className="text-slate-800 text-sm font-bold">{model.name}</span>
                          </div>
                          <span className="text-sm font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                            {typeof average === 'number' ? average.toFixed(3) : 'N/A'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden sm:block overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                <TableHead
                  onClick={() => handleSort('taskName')}
                  className="cursor-pointer hover:bg-slate-200/50 font-bold text-slate-700 w-[220px] px-3 py-4 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-slate-600 rounded-full"></div>
                    <span className="text-base font-bold">Task Name</span>
                    <SortIcon field="taskName" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort('cohort')}
                  className="cursor-pointer hover:bg-slate-200/50 font-bold text-slate-700 w-[90px] px-3 py-4 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold">Cohort</span>
                    <SortIcon field="cohort" />
                  </div>
                </TableHead>
                {[1, 2, 3, 4, 5].map((rank) => {
                  const getHeaderContent = (rank: number) => {
                    switch (rank) {
                      case 1: return { icon: "🥇", text: "#1" };
                      case 2: return { icon: "🥈", text: "#2" };
                      case 3: return { icon: "🥉", text: "#3" };
                      case 4: return { icon: "", text: "#4" };
                      case 5: return { icon: "", text: "#5" };
                      default: return { icon: "", text: `#${rank}` };
                    }
                  };

                  const content = getHeaderContent(rank);

                  return (
                    <TableHead
                      key={rank}
                      className="font-bold text-slate-700 text-center w-[130px] px-2 py-4 bg-gradient-to-b from-slate-50 to-slate-100"
                    >
                      <div className="flex flex-col items-center gap-1">
                        {content.icon && <div className="text-2xl">{content.icon}</div>}
                        <div className="text-sm font-bold text-slate-600">{content.text}</div>
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task, index) => {
                // Get top 5 models for this specific task
                const topModels = calculateTaskTopModels(task);

                return (
                  <TableRow
                    key={task.id}
                    className={`
                      ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}
                      hover:bg-blue-50/50 transition-all duration-200 border-b border-slate-200/60
                    `}
                  >
                    <TableCell className="font-medium px-3 py-3">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-slate-800 text-base leading-tight">{task.name}</span>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium capitalize">
                            {task.taskType.replace('_', ' ')}
                          </span>
                          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                          <span className="font-semibold text-blue-600">{task.organ}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium px-3 py-3">
                      <Badge variant="outline" className="text-sm px-2 py-1 bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">
                        {task.cohort}
                      </Badge>
                    </TableCell>
                    {[1, 2, 3, 4, 5].map((rank) => {
                      const model = topModels[rank - 1];
                      if (!model) {
                        return (
                          <TableCell key={rank} className="text-center px-2 py-3">
                            <div className="flex flex-col items-center gap-2 py-2">
                              <div className="text-sm text-slate-400 font-medium">—</div>
                              <div className="text-sm text-slate-300 bg-slate-50 px-2 py-1 rounded border">
                                No Data
                              </div>
                            </div>
                          </TableCell>
                        );
                      }

                      const performance = performances.find(p =>
                        p.modelID === model.name && p.taskId === task.id
                      );
                      const metrics = getMetricsArray(performance, task.taskType);
                      const average = calculateAverage(metrics);
                      const performanceLevel = getPerformanceLevel(average, rank);

                      return (
                        <TableCell key={rank} className="text-center px-2 py-3">
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-sm font-bold text-slate-700 truncate max-w-[120px]">
                              {model.name}
                            </div>
                            <div className={`
                              text-base font-mono font-bold px-3 py-2 rounded-lg min-w-[80px] border-2 transition-all duration-200
                              ${performanceLevel === 'gold' ? 'text-amber-800 bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-300 shadow-sm' : ''}
                              ${performanceLevel === 'silver' ? 'text-slate-700 bg-gradient-to-br from-slate-50 to-gray-100 border-slate-300 shadow-sm' : ''}
                              ${performanceLevel === 'bronze' ? 'text-orange-800 bg-gradient-to-br from-orange-50 to-amber-100 border-orange-300 shadow-sm' : ''}
                              ${performanceLevel === 'standard' ? 'text-blue-700 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' : ''}
                              ${performanceLevel === 'none' ? 'text-slate-500 bg-slate-50 border-slate-200' : ''}
                            `}>
                              {typeof average === 'number' ? average.toFixed(3) : 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}