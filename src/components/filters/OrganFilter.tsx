"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function OrganFilter() {
  const {
    allOrgans,
    selectedOrganIds,
    toggleOrganSelection
  } = useEvaluation();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Filter by Organ</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[180px] overflow-y-auto">
        <div className="space-y-3">
          {allOrgans.map(organ => (
            <div key={organ.id} className="flex items-center space-x-2">
              <Checkbox
                id={`organ-${organ.id}`}
                checked={selectedOrganIds.includes(organ.id)}
                onCheckedChange={() => toggleOrganSelection(organ.id)}
              />
              <Label
                htmlFor={`organ-${organ.id}`}
                className="text-sm font-normal"
              >
                {organ.name}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
