"use client";

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
import { Performance } from "@/types/index";
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

  // Calculate overall performance for each model to determine top 5
  const calculateOverallPerformance = () => {
    const modelPerformances = allModels.map(model => {
      const modelTasks = tasks.map(task => {
        const performance = performances.find(p =>
          p.modelID === model.name && p.taskId === task.id
        );
        const metrics = getMetricsArray(performance, task.taskType);
        return calculateAverage(metrics);
      }).filter(avg => avg !== null) as number[];

      const overallAverage = modelTasks.length > 0
        ? modelTasks.reduce((sum, avg) => sum + avg, 0) / modelTasks.length
        : 0;

      return { model, overallAverage };
    });

    // Sort by overall performance and take top 5
    return modelPerformances
      .sort((a, b) => b.overallAverage - a.overallAverage)
      .slice(0, 5)
      .map(item => item.model);
  };

  // Get top 5 models based on overall performance
  const models = calculateOverallPerformance();

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

  const getPerformanceBadge = (rank: number) => {
    switch (rank) {
      case 1: return <Badge className="bg-yellow-500 text-white text-sm px-2 py-1 font-semibold">🥇 1st</Badge>;
      case 2: return <Badge className="bg-gray-400 text-white text-sm px-2 py-1 font-semibold">🥈 2nd</Badge>;
      case 3: return <Badge className="bg-amber-600 text-white text-sm px-2 py-1 font-semibold">🥉 3rd</Badge>;
      default: return null;
    }
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
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-semibold">Overall Performance Leaderboard</CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="font-medium">{allModels.length}</span> Models
            •
              <span className="font-medium">{sortedTasks.length}</span> Tasks
            </span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Click column headers to sort • Rankings based on average performance across datasets • Showing top 5 performing models
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead
                  onClick={() => handleSort('taskName')}
                  className="cursor-pointer hover:bg-muted/50 font-semibold text-foreground min-w-[250px] px-4 py-3"
                >
                  <div className="flex items-center">
                    Task Name
                    <SortIcon field="taskName" />
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort('cohort')}
                  className="cursor-pointer hover:bg-muted/50 font-semibold text-foreground min-w-[120px] px-4 py-3"
                >
                  <div className="flex items-center">
                    Cohort
                    <SortIcon field="cohort" />
                  </div>
                </TableHead>
                {models.map((model, index) => (
                  <TableHead
                    key={model.name}
                    className="font-semibold text-foreground text-center min-w-[160px] px-4 py-3"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-base font-medium">{model.name}</div>
                      <div className="text-m text-muted-foreground">#{index + 1}</div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task, index) => {
                // Calculate rankings for current task
                const taskResults = models.map(model => {
                  const performance = performances.find(p =>
                    p.modelID === model.name && p.taskId === task.id
                  );
                  const metrics = getMetricsArray(performance, task.taskType);
                  const average = calculateAverage(metrics);
                  return { modelName: model.name, average };
                });

                // Sort valid results and get top 3
                const validResults = taskResults.filter(r => r.average !== null);
                const sortedResults = [...validResults].sort((a, b) => {
                  // For DFS, OS, and DSS tasks, higher C-Index is better
                  if (task.taskType === 'DFS Prediction' || task.taskType === 'OS Prediction' || task.taskType === 'DSS Prediction') {
                    return b.average! - a.average!;
                  }
                  // For other tasks, higher metric is better
                  return b.average! - a.average!;
                });
                const topThree = sortedResults.slice(0, 3);

                return (
                  <TableRow
                    key={task.id}
                    className={`
                      ${index % 2 === 0 ? 'bg-muted/5' : 'bg-background'}
                      hover:bg-muted/20 transition-colors
                    `}
                  >
                    <TableCell className="font-medium px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-base">{task.name}</span>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="capitalize">{task.taskType.replace('_', ' ')}</span>
                          <span>•</span>
                          <span className="font-medium text-blue-600">{task.organ}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium px-4 py-4">
                      <Badge variant="outline" className="text-sm px-2 py-1">
                        {task.cohort}
                      </Badge>
                    </TableCell>
                    {models.map(model => {
                      const result = taskResults.find(r => r.modelName === model.name);
                      const average = result?.average ?? null;
                      const rank = topThree.findIndex(r => r.modelName === model.name) + 1;
                      const performanceLevel = getPerformanceLevel(average, rank);

                      return (
                        <TableCell key={model.name} className="text-center px-4 py-4">
                          <div className="flex flex-col items-center gap-2">
                            <div className={`
                              text-lg font-mono font-semibold px-3 py-2 rounded-md min-w-[80px]
                              ${performanceLevel === 'gold' ? 'text-yellow-800 bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 shadow-md' : ''}
                              ${performanceLevel === 'silver' ? 'text-gray-800 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-400 shadow-md' : ''}
                              ${performanceLevel === 'bronze' ? 'text-amber-800 bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 shadow-md' : ''}
                              ${performanceLevel === 'standard' ? 'text-blue-700 bg-blue-50 border border-blue-300' : ''}
                              ${performanceLevel === 'none' ? 'text-muted-foreground bg-muted/20 border border-muted' : ''}
                            `}>
                              {typeof average === 'number' ? average.toFixed(3) : 'N/A'}
                            </div>
                            {rank > 0 && rank <= 3 && getPerformanceBadge(rank)}
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