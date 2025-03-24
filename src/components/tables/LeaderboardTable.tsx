
"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Performance } from "@/types/index";


export function LeaderboardTable() {
  const { getFilteredModels, getFilteredPerformances, getFilteredTasks } = useEvaluation();
  const models = getFilteredModels();
  const performances = getFilteredPerformances();
  const tasks = getFilteredTasks();

  const getMetricsArray = (performance: Performance | null | undefined, taskType: string) => {
    if (!performance) return null;
    if (taskType === 'classification') return performance.metrics['AUC'];
    if (taskType === 'survival') return performance.metrics['C-Index'];
    return null;
  };

  const calculateAverage = (metricsArray: number[] | null | undefined) => {
    if (!metricsArray || metricsArray.length === 0) return null;
    return metricsArray.reduce((sum, val) => sum + val, 0) / metricsArray.length;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Source</TableHead>
              {models.map(model => (
                <TableHead key={model.id} className="font-medium">{model.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map(task => {
              // Calculate rankings for current task
              const taskResults = models.map(model => {
                const performance = performances.find(p => 
                  p.modelId === model.id && p.taskId === task.id
                );
                const metrics = getMetricsArray(performance, task.taskType);
                const average = calculateAverage(metrics);
                return { modelId: model.id, average };
              });

              // Sort valid results and get top 3
              const validResults = taskResults.filter(r => r.average !== null);
              const sortedResults = [...validResults].sort((a, b) => b.average! - a.average!);
              const topThree = sortedResults.slice(0, 3);

              return (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell className="font-medium">{task.datasetSource}</TableCell>
                  {models.map(model => {
                    const result = taskResults.find(r => r.modelId === model.id);
                    const average = result?.average ?? 'N/A';
                    const rank = topThree.findIndex(r => r.modelId === model.id) + 1;

                    return (
                      <TableCell key={model.id}>
                        <div className="flex items-center gap-1">
                          {typeof average === 'number' ? average.toFixed(3) : average}
                          {rank === 1 && '🥇'}
                          {rank === 2 && '🥈'}
                          {rank === 3 && '🥉'}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}