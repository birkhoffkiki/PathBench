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
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-xs sm:text-sm font-medium">Filter by Model</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[120px] sm:max-h-[180px] overflow-y-auto">
        <div className="space-y-2 sm:space-y-3">
          {allModels.map(model => (
            <div key={model.name} className="flex items-center space-x-2">
              <Checkbox
                id={`model-${model.name}`}
                checked={selectedModelIds.includes(model.name)}
                onCheckedChange={() => toggleModelSelection(model.name)}
                className="h-3 w-3 sm:h-4 sm:w-4"
              />
              <Label
                htmlFor={`model-${model.name}`}
                className="text-xs sm:text-sm font-normal leading-tight"
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
