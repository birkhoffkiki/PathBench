"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      <Select value={selectedMetric} onValueChange={handleChange}>
        <SelectTrigger id="metric-selector" className="w-full">
          <SelectValue placeholder="Select a metric" />
        </SelectTrigger>
        <SelectContent>
          {availableMetrics.length === 0 ? (
            <SelectItem value="none" disabled>
              No metrics available
            </SelectItem>
          ) : (
            availableMetrics.map((metric) => (
              <SelectItem key={metric} value={metric}>
                {formatMetricName(metric)}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
