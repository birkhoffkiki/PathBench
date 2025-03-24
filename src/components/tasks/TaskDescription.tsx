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
    const organDetails = `It focuses on ${task.organId.toLowerCase()} tissue samples from ${task.datasetSource} dataset.`;

    // Add metrics information
    const metricsDetails = `Performance is evaluated using ${task.evaluationMetrics.join(', ')}.`;

    // Add task-specific notes if available
    const taskNotes = task.description || '';

    return `${baseDescription} ${organDetails} ${metricsDetails} ${taskNotes}`;
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>{task.name}</CardTitle>
        <CardDescription>
          {task.taskType.replace('_', ' ')} task for {task.organId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {getTaskDescription()}
        </p>
        <div className="mt-4">
          <h4 className="text-sm font-medium">Dataset Information</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <span className="text-xs text-muted-foreground">Source:</span>
              <p className="text-sm">{task.datasetSource_full}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Samples:</span>
              <p className="text-sm">{task.cases || 'N/A'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Task Type:</span>
              <p className="text-sm capitalize">{task.taskType.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Metrics:</span>
              <p className="text-sm">{task.evaluationMetrics.join(', ')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
