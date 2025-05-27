"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskDescriptionProps {
  taskId?: string;
}

export function TaskDescription({ taskId }: TaskDescriptionProps) {
  const { getTaskById } = useEvaluation();

  const task = taskId ? getTaskById(taskId) : undefined;

  if (!task) {
    return null;
  }

  // Get a detailed description based on task properties
  const getTaskDescription = () => {
    const descriptions: Record<string, string> = {
      'detection': 'This task involves detecting the presence of specific pathological features or abnormalities in tissue samples.',
      'segmentation': 'This task requires pixel-level segmentation of pathological regions, cells, or structures in tissue images.',
      'classification': 'This task involves classifying tissue samples into diagnostic categories based on pathological features.',
      'regression': 'This task requires predicting continuous values such as biomarker expression levels or survival time.',
      'whole_slide_analysis': 'This task involves analyzing entire gigapixel-sized whole slide images to identify regions of interest.',
    };

    const baseDescription = descriptions[task.taskType] || 'This task evaluates model performance on specific pathological criteria.';

    // Add organ-specific details
    const organDetails = `It focuses on ${task.organ.toLowerCase()} tissue samples from ${task.cohort} cohort.`;

    // Add metrics information
    const metricsDetails = `Performance is evaluated using ${task.evaluationMetrics.join(', ')}.`;

    // Add task-specific notes if available
    const taskNotes = task.description || '';

    return `${baseDescription} ${organDetails} ${metricsDetails} ${taskNotes}`;
  };

  return (
    <Card className="w-full mt-3 sm:mt-4">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">{task.name}</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {task.taskType.replace('_', ' ')} task for {task.organ}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {getTaskDescription()}
        </p>
        <div>
          <h4 className="text-sm sm:text-base font-medium mb-3">Dataset Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Cohort:</span>
              <p className="text-sm font-medium">{task.cohort}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Organ:</span>
              <p className="text-sm font-medium">{task.organ}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Task Type:</span>
              <p className="text-sm font-medium capitalize">{task.taskType.replace('_', ' ')}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Metrics:</span>
              <p className="text-sm font-medium">{task.evaluationMetrics.join(', ')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
