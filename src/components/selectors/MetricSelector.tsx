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
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Select Metric</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={onChange} className="flex flex-col gap-2">
          {metrics.map(metric => (
            <div key={metric} className="flex items-center space-x-2 py-1">
              <RadioGroupItem value={metric} id={`metric-${metric}`} />
              <Label htmlFor={`metric-${metric}`} className="cursor-pointer">
                {metric.replace('_', ' ')}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
