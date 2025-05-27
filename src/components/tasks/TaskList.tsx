"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";

interface TaskListProps {
  onSelectTask: (taskId: string) => void;
  selectedTaskId?: string;
}

export function TaskList({ onSelectTask, selectedTaskId }: TaskListProps) {
  const { getFilteredTasks } = useEvaluation();

  const filteredTasks = getFilteredTasks();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Available Tasks</CardTitle>
        <CardDescription>
          {filteredTasks.length} tasks available based on current filters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Organ</TableHead>
                <TableHead>Task Type</TableHead>
                <TableHead>Cohort</TableHead>
                <TableHead>Metrics</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No tasks available. Try changing your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => {
                  return (
                    <TableRow
                      key={task.id}
                      className={`cursor-pointer hover:bg-muted/50 ${
                        selectedTaskId === task.id ? "bg-muted" : ""
                      }`}
                      onClick={() => onSelectTask(task.id)}
                    >
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>{task.organ}</TableCell>
                      <TableCell className="capitalize">{task.taskType.replace('_', ' ')}</TableCell>
                      <TableCell>{task.cohort}</TableCell>
                      <TableCell>{task.evaluationMetrics.join(", ")}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
