// "use client";

// import { useEvaluation } from "@/context/EvaluationContext";
// import { Filters, TaskType } from "@/types";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import React from "react";

// export function FilterSection() {
//   const {
//     organs,
//     models,
//     filters,
//     setFilters,
//     getTaskTypes
//   } = useEvaluation();

//   const taskTypes = getTaskTypes();

//   const handleOrganChange = (organId: string, checked: boolean) => {
//     setFilters({
//       ...filters,
//       organs: checked
//         ? [...filters.organs, organId]
//         : filters.organs.filter(id => id !== organId)
//     });
//   };

//   const handleTaskTypeChange = (taskType: TaskType, checked: boolean) => {
//     setFilters({
//       ...filters,
//       taskTypes: checked
//         ? [...filters.taskTypes, taskType]
//         : filters.taskTypes.filter(type => type !== taskType)
//     });
//   };

//   const handleModelChange = (modelId: string, checked: boolean) => {
//     setFilters({
//       ...filters,
//       models: checked
//         ? [...filters.models, modelId]
//         : filters.models.filter(id => id !== modelId)
//     });
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setFilters({
//       organs: [],
//       taskTypes: [],
//       models: []
//     });
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Filters</CardTitle>
//         <CardDescription>
//           Filter tasks and models by organ, task type, and model
//           <button
//             onClick={clearFilters}
//             className="ml-2 text-sm text-blue-500 hover:underline"
//           >
//             Clear All
//           </button>
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Organ Filters */}
//           <div>
//             <h3 className="font-medium mb-2">Organs</h3>
//             <div className="space-y-2 max-h-[200px] overflow-auto pr-2">
//               {organs.map((organ) => (
//                 <div key={organ.id} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`organ-${organ.id}`}
//                     checked={filters.organs.includes(organ.id)}
//                     onCheckedChange={(checked) => handleOrganChange(organ.id, checked as boolean)}
//                   />
//                   <Label htmlFor={`organ-${organ.id}`} className="cursor-pointer">
//                     {organ.name}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Task Type Filters */}
//           <div>
//             <h3 className="font-medium mb-2">Task Types</h3>
//             <div className="space-y-2">
//               {taskTypes.map((taskType) => (
//                 <div key={taskType} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`taskType-${taskType}`}
//                     checked={filters.taskTypes.includes(taskType)}
//                     onCheckedChange={(checked) => handleTaskTypeChange(taskType, checked as boolean)}
//                   />
//                   <Label htmlFor={`taskType-${taskType}`} className="cursor-pointer capitalize">
//                     {taskType.replace('_', ' ')}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Model Filters */}
//           <div>
//             <h3 className="font-medium mb-2">Models</h3>
//             <div className="space-y-2 max-h-[200px] overflow-auto pr-2">
//               {models.map((model) => (
//                 <div key={model.id} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`model-${model.id}`}
//                     checked={filters.models.includes(model.id)}
//                     onCheckedChange={(checked) => handleModelChange(model.id, checked as boolean)}
//                   />
//                   <Label htmlFor={`model-${model.id}`} className="cursor-pointer">
//                     {model.name} ({model.version})
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
