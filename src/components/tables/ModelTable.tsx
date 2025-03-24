"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FaExternalLinkAlt } from 'react-icons/fa';


export function ModelTable() {
  const { getFilteredModels } = useEvaluation();
  const models = getFilteredModels();

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model Name</TableHead>
              <TableHead>Architecture</TableHead>
              <TableHead>Preraining Method</TableHead>
              <TableHead>Parameters(M)</TableHead>
              <TableHead>Training Data</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Paper</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map(model => (
              <TableRow key={model.id}>
                <TableCell className="font-medium">{model.name}</TableCell>
                <TableCell>{model.architecture}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{model.modelType}</Badge>
                </TableCell>
                <TableCell>{model.parameters}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={model.trainingData}>
                  {model.trainingData}
                </TableCell>
                <TableCell>
                <a href={model.code} target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-bold underline hover:no-underline transition-colors flex items-center gap-1">
                <model.code_name className="inline-block" /></a>
                </TableCell>
                <TableCell>
                <a href={model.paper} target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-bold underline hover:no-underline transition-colors flex items-center gap-1">
                <model.paper_pub className="inline-block" /></a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
