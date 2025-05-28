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
import React from "react";
import { ChevronUp, ChevronDown, Eye, EyeOff, Activity, Target, Database } from "lucide-react";
import { TaskDescription } from "@/components/tasks/TaskDescription";
import { getOrganColor, getOrganColorWithOpacity } from "@/utils/organColors";

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
    <Card className="w-full shadow-lg border-0 bg-white">
      <CardContent className="p-0">
        {/* Mobile Card Layout */}
        <div className="block md:hidden">
          <div className="space-y-3 p-4">
            {sortedTasks.map((task) => {
              const isSelected = task.id === selectedTaskId;
              const organColor = getOrganColor(task.organ);

              return (
                <div key={task.id} className="space-y-0">
                  <Card
                    className={`
                      ${isSelected ? "ring-2 ring-blue-500 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 shadow-lg border-blue-200" : "bg-white shadow-sm hover:shadow-md border-gray-200 hover:border-blue-300"}
                      transition-all duration-300 border-l-4 ${isSelected ? "border-l-blue-500" : "border-l-gray-300"}
                    `}
                  >
                    <CardContent className="p-5">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-base leading-tight mb-2 line-clamp-2">{task.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize text-xs font-medium bg-gray-50 border-gray-300">
                                <Activity className="w-3 h-3 mr-1" />
                                {task.taskType.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="text-xs px-3 py-1.5 h-auto font-medium shrink-0 shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              if (isSelected) {
                                onSelectTask(undefined);
                              } else {
                                onSelectTask(task.id);
                              }
                            }}
                          >
                            {isSelected ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                            {isSelected ? "Hide" : "View"}
                          </Button>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                              <Target className="w-3 h-3" />
                              <span>Organ</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: organColor }}
                              ></div>
                              <span className="font-semibold text-gray-900 text-sm">{task.organ}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                              <Database className="w-3 h-3" />
                              <span>Cohort</span>
                            </div>
                            <div className="font-semibold text-gray-900 text-sm">{task.cohort}</div>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500 font-medium">Evaluation Metrics</div>
                          <div className="flex flex-wrap gap-1.5">
                            {task.evaluationMetrics.map(metric => (
                              <Badge key={metric} variant="secondary" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                                {metric.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Expandable Task Description for Mobile */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isSelected ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    {isSelected && (
                      <div className="pt-2">
                        <TaskDescription taskId={task.id} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto mobile-table-scroll">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b-2 border-gray-200">
                <TableHead onClick={() => handleSort("name")} className="cursor-pointer hover:bg-gray-100/70 transition-colors duration-200 w-[28%] font-bold text-gray-700 text-sm py-3 px-2">
                  <div className="flex items-center gap-1">
                    <Activity className="w-4 h-4" />
                    Task Name <SortIcon field="name" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("organ")} className="cursor-pointer hover:bg-gray-100/70 transition-colors duration-200 w-[12%] font-bold text-gray-700 text-sm py-3 px-2">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Organ <SortIcon field="organ" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("taskType")} className="cursor-pointer hover:bg-gray-100/70 transition-colors duration-200 w-[18%] font-bold text-gray-700 text-sm py-3 px-2">
                  <div className="flex items-center gap-1">
                    <Database className="w-4 h-4" />
                    Type <SortIcon field="taskType" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("cohort")} className="cursor-pointer hover:bg-gray-100/70 transition-colors duration-200 w-[12%] font-bold text-gray-700 text-sm py-3 px-2">
                  Cohort <SortIcon field="cohort" />
                </TableHead>
                <TableHead className="font-bold text-gray-700 text-sm py-3 px-2 w-[20%]">Metrics</TableHead>
                <TableHead className="text-center font-bold text-gray-700 text-sm py-3 px-2 w-[10%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {sortedTasks.map((task, index) => {
              const isSelected = task.id === selectedTaskId;
              const organColor = getOrganColor(task.organ);

              return (
                <React.Fragment key={task.id}>
                  <TableRow
                    className={`
                      ${isSelected ? "bg-blue-50/50 border-l-4 border-l-blue-500" : ""}
                      ${!isSelected && index % 2 === 0 ? "bg-gray-50/30" : "bg-white"}
                      hover:bg-blue-50/30 transition-all duration-200 border-b border-gray-200/60
                    `}
                  >
                    <TableCell className="font-semibold text-gray-900 py-3 px-2">
                      <div className="line-clamp-2 leading-tight text-sm">{task.name}</div>
                    </TableCell>
                    <TableCell className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: organColor }}
                        ></div>
                        <span className="font-medium text-gray-700 text-sm truncate">{task.organ}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-2">
                      <Badge variant="outline" className="capitalize font-medium bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 text-xs">
                        {task.taskType.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-gray-700 py-3 px-2 text-sm truncate">{task.cohort}</TableCell>
                    <TableCell className="py-3 px-2">
                      <div className="flex flex-wrap gap-1">
                        {task.evaluationMetrics.map(metric => (
                          <Badge key={metric} variant="secondary" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                            {metric.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-3 px-2">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs px-2 py-1"
                      onClick={() => {
                        if (isSelected) {
                          onSelectTask(undefined); // Deselect the task when already selected
                        } else {
                          onSelectTask(task.id); // Select the task when not selected
                        }
                      }}
                    >
                      {isSelected ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                      {isSelected ? "Hide" : "View"}
                    </Button>
                  </TableCell>
                  </TableRow>

                  {/* Expandable Task Description for Desktop */}
                  {isSelected && (
                    <TableRow key={`${task.id}-description`} className="bg-gradient-to-r from-blue-50/30 to-indigo-50/20">
                      <TableCell colSpan={6} className="p-0">
                        <div className="overflow-hidden transition-all duration-300 ease-in-out">
                          <div className="p-6 bg-gradient-to-r from-blue-50/40 to-indigo-50/30 border-l-4 border-l-blue-500">
                            <TaskDescription taskId={task.id} />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}