"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import React, { useMemo } from "react";

interface MetricSelectorProps {
  selectedTaskId?: string;
  selectedMetric?: string;
  onSelectMetric: (metric: string) => void;
}

export function MetricSelector({
  selectedTaskId,
  selectedMetric,
  onSelectMetric
}: MetricSelectorProps) {
  const { getTaskById, getFilteredTasks } = useEvaluation();

  // Get available metrics based on selected task
  const availableMetrics = useMemo(() => {
    if (selectedTaskId) {
      const task = getTaskById(selectedTaskId);
      return task ? task.evaluationMetrics : [];
    }

    // If no task is selected, collect metrics from all filtered tasks
    const filteredTasks = getFilteredTasks();
    const metricSet = new Set<string>();

    filteredTasks.forEach(task => {
      task.evaluationMetrics.forEach(metric => {
        metricSet.add(metric);
      });
    });

    return Array.from(metricSet);
  }, [selectedTaskId, getTaskById, getFilteredTasks]);

  // Format metric for display
  const formatMetricName = (metric: string) => {
    return metric
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle selection change
  const handleChange = (value: string) => {
    onSelectMetric(value);
  };

  return (
    <div className="w-full max-w-sm">
      <label htmlFor="metric-selector" className="block text-sm font-medium mb-2">
        Select Metric
      </label>
      {availableMetrics.length === 0 ? (
        <p className="text-sm text-gray-500">No metrics available</p>
      ) : (
        <RadioGroup value={selectedMetric} onValueChange={handleChange} className="flex flex-col gap-2">
          {availableMetrics.map((metric) => (
            <div key={metric} className="flex items-center space-x-2 py-1">
              <RadioGroupItem value={metric} id={`metric-${metric}`} />
              <Label htmlFor={`metric-${metric}`} className="cursor-pointer">
                {formatMetricName(metric)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
}
