"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function TaskTypeFilter() {
  const {
    allTaskTypes,
    selectedTaskTypes,
    toggleTaskTypeSelection
  } = useEvaluation();

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-xs sm:text-sm font-medium">Filter by Task Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 sm:space-y-3">
          {allTaskTypes.map(taskType => (
            <div key={taskType} className="flex items-center space-x-2">
              <Checkbox
                id={`task-type-${taskType}`}
                checked={selectedTaskTypes.includes(taskType)}
                onCheckedChange={() => toggleTaskTypeSelection(taskType)}
                className="h-3 w-3 sm:h-4 sm:w-4"
              />
              <Label
                htmlFor={`task-type-${taskType}`}
                className="text-xs sm:text-sm font-normal capitalize leading-tight"
              >
                {taskType.replace('_', ' ')}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
