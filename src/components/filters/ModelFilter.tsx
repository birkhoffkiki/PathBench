"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function ModelFilter() {
  const {
    allModels,
    selectedModelIds,
    toggleModelSelection
  } = useEvaluation();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Filter by Model</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[180px] overflow-y-auto">
        <div className="space-y-3">
          {allModels.map(model => (
            <div key={model.id} className="flex items-center space-x-2">
              <Checkbox
                id={`model-${model.id}`}
                checked={selectedModelIds.includes(model.id)}
                onCheckedChange={() => toggleModelSelection(model.id)}
              />
              <Label
                htmlFor={`model-${model.id}`}
                className="text-sm font-normal"
              >
                {model.name}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
