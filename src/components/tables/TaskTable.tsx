// "use client";

// import { useEvaluation } from "@/context/EvaluationContext";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// interface TaskTableProps {
//   onSelectTask: (taskId: string) => void;
//   selectedTaskId?: string;
// }

// export function TaskTable({ onSelectTask, selectedTaskId }: TaskTableProps) {
//   const { getFilteredTasks, getOrganById } = useEvaluation();
//   const tasks = getFilteredTasks();

//   return (
//     <Card>
//       <CardContent className="p-0">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Task Name</TableHead>
//               <TableHead>Organ</TableHead>
//               <TableHead>Type</TableHead>
//               <TableHead>Cohort</TableHead>
//               <TableHead>Metrics</TableHead>
//               <TableHead>Source</TableHead>
//               <TableHead>Cases</TableHead>
//               <TableHead>WSIs</TableHead>
//               <TableHead>Update Time</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {tasks.map(task => {
//               const organ = getOrganById(task.organId);
//               const isSelected = task.id === selectedTaskId;

//               return (
//                 <TableRow
//                   key={task.id}
//                   className={isSelected ? "bg-muted/50" : undefined}
//                 >
//                   <TableCell className="font-medium">{task.name}</TableCell>
//                   <TableCell>{organ?.name || task.organId}</TableCell>
//                   <TableCell>
//                     <Badge variant="outline" className="capitalize">
//                       {task.taskType.replace('_', ' ')}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="font-medium">{task.cohort}</TableCell>
//                   <TableCell>
//                     <div className="flex flex-wrap gap-1">
//                       {task.evaluationMetrics.map(metric => (
//                         <Badge key={metric} variant="secondary" className="text-xs">
//                           {metric.replace('_', ' ')}
//                         </Badge>
//                       ))}
//                     </div>
//                   </TableCell>
//                   <TableCell>{task.datasetSource}</TableCell>
//                   <TableCell>{task.cases || 'N/A'}</TableCell>
//                   <TableCell>{task.wsis || 'N/A'}</TableCell>
//                   <TableCell>{task.updateTime || 'N/A'}</TableCell>
//                   <TableCell className="text-right">
//                     <Button
//                       variant={isSelected ? "default" : "ghost"}
//                       size="sm"
//                       onClick={() => onSelectTask(task.id)}
//                     >
//                       {isSelected ? "Selected" : "Select"}
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// }







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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react"; // You'll need to install lucide-react

interface TaskTableProps {
  onSelectTask: (taskId: string | undefined) => void;
  selectedTaskId?: string;
  useAllTasks?: boolean; // New prop to control whether to use all tasks or filtered tasks
}

type SortField = "name" | "organ" | "taskType" | "cohort";
type SortOrder = "asc" | "desc";

export function TaskTable({ onSelectTask, selectedTaskId, useAllTasks = false }: TaskTableProps) {
  const { getFilteredTasks, allTasks } = useEvaluation();
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const tasks = useAllTasks ? allTasks : getFilteredTasks();

  const sortedTasks = [...tasks].sort((a, b) => {
    let compareA, compareB;

    switch (sortField) {
      case "name":
        compareA = a.name?.toLowerCase();
        compareB = b.name?.toLowerCase();
        break;
      case "organ":
        compareA = a.organ?.toLowerCase();
        compareB = b.organ?.toLowerCase();
        break;
      case "taskType":
        compareA = a.taskType?.toLowerCase();
        compareB = b.taskType?.toLowerCase();
        break;
      case "cohort":
        compareA = a.cohort?.toLowerCase();
        compareB = b.cohort?.toLowerCase();
        break;
      default:
        return 0;
    }

    if (compareA === compareB) return 0;
    if (compareA === null || compareA === undefined) return 1;
    if (compareB === null || compareB === undefined) return -1;

    const comparison = compareA < compareB ? -1 : 1;
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />;
  };

  return (
    <Card>
      <CardContent className="p-0">
        {/* Mobile Card Layout */}
        <div className="block md:hidden">
          <div className="space-y-3 p-4">
            {sortedTasks.map((task) => {
              const isSelected = task.id === selectedTaskId;

              return (
                <Card
                  key={task.id}
                  className={`border cursor-pointer transition-all mobile-card ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    if (isSelected) {
                      onSelectTask(undefined);
                    } else {
                      onSelectTask(task.id);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{task.name}</h3>
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className="text-xs px-2 py-1 h-6"
                        >
                          {isSelected ? "Hide" : "View"}
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500">Organ:</span>
                          <div className="font-medium">{task.organ}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Cohort:</span>
                          <div className="font-medium">{task.cohort}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 mb-1">Type:</div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {task.taskType.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 mb-1">Metrics:</div>
                        <div className="flex flex-wrap gap-1">
                          {task.evaluationMetrics.map(metric => (
                            <Badge key={metric} variant="secondary" className="text-xs">
                              {metric.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto mobile-table-scroll">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("name")} className="cursor-pointer hover:bg-muted/50 w-96">
                  Task Name <SortIcon field="name" />
                </TableHead>
                <TableHead onClick={() => handleSort("organ")} className="cursor-pointer hover:bg-muted/50">
                  Organ <SortIcon field="organ" />
                </TableHead>
                <TableHead onClick={() => handleSort("taskType")} className="cursor-pointer hover:bg-muted/50">
                  Type <SortIcon field="taskType" />
                </TableHead>
                <TableHead onClick={() => handleSort("cohort")} className="cursor-pointer hover:bg-muted/50">
                  Cohort <SortIcon field="cohort" />
                </TableHead>
                <TableHead>Metrics</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {sortedTasks.map((task, index) => {
              const isSelected = task.id === selectedTaskId;

              return (
                <TableRow
                  key={task.id}
                  className={`
                    ${isSelected ? "bg-muted/50" : ""}
                    ${!isSelected && index % 2 === 0 ? "bg-muted/10" : ""}
                    hover:bg-muted/30
                  `}
                >
                  <TableCell className="font-medium w-48">{task.name}</TableCell>
                  <TableCell>{task.organ}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {task.taskType.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{task.cohort}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {task.evaluationMetrics.map(metric => (
                        <Badge key={metric} variant="secondary" className="text-xs">
                          {metric.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                  <Button
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      if (isSelected) {
                        onSelectTask(undefined); // Deselect the task when already selected
                      } else {
                        onSelectTask(task.id); // Select the task when not selected
                      }
                    }}
                  >
                    {isSelected ? "Hide" : "View"}
                  </Button>
                </TableCell>
                </TableRow>
              );
            })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}