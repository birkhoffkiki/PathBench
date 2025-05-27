"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface MetricSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MetricSelector({ value, onChange }: MetricSelectorProps) {
  const { getAvailableMetrics } = useEvaluation();
  const metrics = getAvailableMetrics();

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-xs sm:text-sm font-medium">Select Metric</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={onChange} className="flex flex-col gap-1 sm:gap-2">
          {metrics.map(metric => (
            <div key={metric} className="flex items-center space-x-2 py-0.5 sm:py-1 touch-target">
              <RadioGroupItem
                value={metric}
                id={`metric-${metric}`}
                className="h-3 w-3 sm:h-4 sm:w-4"
              />
              <Label
                htmlFor={`metric-${metric}`}
                className="cursor-pointer text-xs sm:text-sm leading-tight"
              >
                {metric.replace('_', ' ')}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
