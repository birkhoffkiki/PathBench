// "use client";

// import { useEvaluation } from "@/context/EvaluationContext";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import React from "react";

// interface ModelSummaryProps {
//   selectedModelIds?: string[];
// }

// export function ModelSummary({ selectedModelIds }: ModelSummaryProps) {
//   const { models, getFilteredModels } = useEvaluation();

//   // Get models to display
//   const displayModels = selectedModelIds && selectedModelIds.length > 0
//     ? models.filter(model => selectedModelIds.includes(model.id))
//     : getFilteredModels();

//   // Format number with commas
//   const formatNumber = (num: number | undefined) => {
//     if (num === undefined) return "N/A";
//     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Model Details</CardTitle>
//         <CardDescription>
//           Detailed information about {displayModels.length} selected models
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Architecture</TableHead>
//               <TableHead>Parameters</TableHead>
//               <TableHead>Training Dataset</TableHead>
//               <TableHead>Paper</TableHead>
//               <TableHead>Code</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {displayModels.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} className="text-center">
//                   No models selected. Use the filters to select models.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               displayModels.map((model) => (
//                 <TableRow key={model.id}>
//                   <TableCell className="font-medium">{model.name}</TableCell>
//                   <TableCell>{model.architecture}</TableCell>
//                   <TableCell>{model.parameters}</TableCell>
//                   <TableCell>{model.trainingData}</TableCell>
//                   <TableCell>{model.paper}</TableCell>
//                   <TableCell>{model.code}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// }
