"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, Target, Database } from "lucide-react";
import React from "react";
import { getOrganColor } from "@/utils/organColors";

interface TaskListProps {
  onSelectTask: (taskId: string) => void;
  selectedTaskId?: string;
}

export function TaskList({ onSelectTask, selectedTaskId }: TaskListProps) {
  const { getFilteredTasks } = useEvaluation();

  const filteredTasks = getFilteredTasks();

  return (
    <Card className="w-full shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Available Tasks
        </CardTitle>
        <CardDescription className="text-gray-600">
          {filteredTasks.length} tasks available based on current filters
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b-2 border-gray-200">
                <TableHead className="font-bold text-gray-700 text-sm py-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Task Name
                  </div>
                </TableHead>
                <TableHead className="font-bold text-gray-700 text-sm py-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Organ
                  </div>
                </TableHead>
                <TableHead className="font-bold text-gray-700 text-sm py-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Task Type
                  </div>
                </TableHead>
                <TableHead className="font-bold text-gray-700 text-sm py-4">Cohort</TableHead>
                <TableHead className="font-bold text-gray-700 text-sm py-4">Metrics</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No tasks available. Try changing your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task, index) => {
                  const isSelected = selectedTaskId === task.id;
                  const organColor = getOrganColor(task.organ);
                  return (
                    <TableRow
                      key={task.id}
                      className={`
                        cursor-pointer transition-all duration-200 border-b border-gray-200/60
                        ${isSelected ? "bg-blue-50/50 border-l-4 border-l-blue-500" : ""}
                        ${!isSelected && index % 2 === 0 ? "bg-gray-50/30" : "bg-white"}
                        hover:bg-blue-50/30
                      `}
                      onClick={() => onSelectTask(task.id)}
                    >
                      <TableCell className="font-semibold text-gray-900 py-4">
                        <div className="line-clamp-2 leading-tight">{task.name}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: organColor }}
                          ></div>
                          <span className="font-medium text-gray-700">{task.organ}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="capitalize font-medium bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100">
                          {task.taskType.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700 py-4">{task.cohort}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {task.evaluationMetrics.map(metric => (
                            <Badge key={metric} variant="secondary" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
                              {metric.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
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
