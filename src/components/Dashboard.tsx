// "use client";

// import { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ModelFilter } from "@/components/filters/ModelFilter";
// import { TaskTypeFilter } from "@/components/filters/TaskTypeFilter";
// import { OrganFilter } from "@/components/filters/OrganFilter";

// import { TaskDistributionChart } from "@/components/charts/TaskDistributionChart";
// import { PerformanceBarChart } from "@/components/charts/PerformanceBarChart";
// import { OverallRankBarChart } from "@/components/charts/OverallRankBarChart"
// import { PieDataDistributionChart } from "@/components/charts/PieDataDistributionChart";


// import { ModelTable } from "@/components/tables/ModelTable";
// import { MetricSelector } from "@/components/selectors/MetricSelector";
// import { TaskTable } from "@/components/tables/TaskTable";
// import { TaskDescription } from "@/components/tasks/TaskDescription";
// import { Footer } from "@/components/layout/Footer";
// import { LeaderboardTable } from "@/components/tables/LeaderboardTable"


// const PARTNERS = [
//   {
//     id: 1,
//     name: "",
//     url: "https://hkustsmartlab.github.io/",
//     logo: "/images/smartlab.png",
//     bgColor: "bg-white-50" // 新增品牌色背景

//   },
//   {
//     id: 2,
//     name: "",
//     url: "https://hkust.edu.hk/",
//     logo: "https://hkust.edu.hk/sites/default/files/images/UST_L3.svg",
//     bgColor: "bg-white-50"

//   },
// ];


// export function Dashboard() {
//   // States for selections
//   const [selectedMetric, setSelectedMetric] = useState<string>("AUC");
//   const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();

//   return (
//     <div className="container mx-auto py-6">
//       <header className="pb-6 mb-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           {/* <h1 className="text-4xl font-bold tracking-tight">PathBench</h1> */}
//           <div className="mb-2">
//             <img
//               src="/images/pathbench.svg"
//               alt="PathBench Logo"
//               className="h-20 object-contain"
//             />
//           </div>
//           <p className="text-muted-foreground">
//             Join the World's First Open, Multi-Task, and Multi-Organ Benchmark for Pathology Foundation Models
//           </p>
//         </div>

//         {/* 新增合作机构logo区域*/}
//         <div className="flex flex-wrap gap-3 justify-end">
//           {PARTNERS.map((partner) => (
//             <a
//               key={partner.id}
//               href={partner.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className={`
//                 group relative
//                 p-2 rounded-lg
//                 transition-all duration-300
//                 hover:scale-105 hover:shadow-md
//                 ${partner.bgColor}
//               `}
//               title={`Visit ${partner.name}`}
//             >
//               <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
//               <img
//                 src={partner.logo}
//                 alt={partner.name}
//                 className="h-12 object-contain contrast-125 brightness-95 hover:contrast-100 transition-filter"
//               />
//               {/* 微光效果 */}
//               <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
//             </a>
//           ))}
//         </div>
//       </header>



//       <Tabs defaultValue="overview">

//         <TabsList className="bg-gray-50 p-1.5 rounded-xl border border-gray-100 w-auto space-x-1">
//           <TabsTrigger
//             value="overview"
//             className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-6 py-2 rounded-lg transition-all hover:bg-gray-100/70 text-gray-600"
//           >
//             <span className="text-sm font-medium">Overview</span>
//           </TabsTrigger>
//           <TabsTrigger
//             value="leaderboard"
//             className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-6 py-2 rounded-lg transition-all hover:bg-gray-100/70 text-gray-600"
//           >
//             <span className="text-sm font-medium">Leaderboard</span>
//           </TabsTrigger>
//           <TabsTrigger
//             value="performance"
//             className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-6 py-2 rounded-lg transition-all hover:bg-gray-100/70 text-gray-600"
//           >
//             <span className="text-sm font-medium">Performance</span>
//           </TabsTrigger>
//           <TabsTrigger
//             value="models"
//             className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-6 py-2 rounded-lg transition-all hover:bg-gray-100/70 text-gray-600"
//           >
//             <span className="text-sm font-medium">Models</span>
//           </TabsTrigger>
//         </TabsList>


//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <PieDataDistributionChart />
//             <TaskDistributionChart chartType="organ" />
//             <TaskDistributionChart chartType="taskType" />
//           </div>

//           {/* Filters */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

//             <ModelFilter />
//             <TaskTypeFilter />
//             <OrganFilter />
//             <MetricSelector
//               value={selectedMetric}
//               onChange={setSelectedMetric}
//             />
//           </div>
//           <div className="grid w-full">
//             <OverallRankBarChart selectedMetric={selectedMetric} />
//           </div>

//           <div className="my-6">
//             <h2 className="text-2xl font-bold mb-4">All Tasks</h2>
//             <TaskTable onSelectTask={setSelectedTaskId} selectedTaskId={selectedTaskId} />
//           </div>

//           {selectedTaskId && (
//             <TaskDescription taskId={selectedTaskId} />
//           )}
//         </TabsContent>

//         <TabsContent value="leaderboard">
//           <div className="my-6">
//             <h2 className="text-2xl font-bold mb-4">Overall Performance</h2>
//             <LeaderboardTable />
//           </div>
//         </TabsContent>

//         <TabsContent value="performance" className="space-y-6">
//           <PerformanceBarChart
//             selectedMetric={selectedMetric}
//             selectedTaskId={selectedTaskId}
//           />

//           <div className="my-6">
//             <h2 className="text-2xl font-bold mb-4">Tasks</h2>
//             <TaskTable onSelectTask={setSelectedTaskId} selectedTaskId={selectedTaskId} />
//           </div>

//           {selectedTaskId && (
//             <TaskDescription taskId={selectedTaskId} />
//           )}
//         </TabsContent>

//         <TabsContent value="models">
//           <div className="my-6">
//             <h2 className="text-2xl font-bold mb-4">Model Details</h2>
//             <ModelTable />
//           </div>
//         </TabsContent>
//       </Tabs>

//       <Footer />
//     </div>
//   );
// }





"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelFilter } from "@/components/filters/ModelFilter";
import { TaskTypeFilter } from "@/components/filters/TaskTypeFilter";
import { OrganFilter } from "@/components/filters/OrganFilter";
import Image from 'next/image';  // 确保导入的是next/image的Image组件

import { TaskDistributionChart } from "@/components/charts/TaskDistributionChart";
import { PerformanceBarChart } from "@/components/charts/PerformanceBarChart";
import { OverallRankBarChart } from "@/components/charts/OverallRankBarChart"
// import {DataDistributation} from "@/components/charts/DataDistributation"
import { PieDataDistributionChart } from "@/components/charts/PieDataDistributionChart";

import { ModelTable } from "@/components/tables/ModelTable";
import { MetricSelector } from "@/components/selectors/MetricSelector";
import { TaskTable } from "@/components/tables/TaskTable";
import { TaskDescription } from "@/components/tasks/TaskDescription";
import { Footer } from "@/components/layout/Footer";
import { LeaderboardTable } from "@/components/tables/LeaderboardTable"


const PARTNERS = [
  {
    id: 1,
    name: "",
    url: "https://hkustsmartlab.github.io/",
    logo: "/images/smartlab.png",
    bgColor: "bg-white-50" // 新增品牌色背景

  },
  {
    id: 2,
    name: "",
    url: "https://hkust.edu.hk/",
    logo: "/images/ust_logo.svg",
    bgColor: "bg-white-50"

  },
];


export function Dashboard() {
  // States for selections
  const [selectedMetric, setSelectedMetric] = useState<string>("AUC");
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();

  return (
    <div className="container mx-auto py-6">
      <header className="pb-6 mb-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* <h1 className="text-4xl font-bold tracking-tight">PathBench</h1> */}
          <div className="mb-2">
            <Image 
              src="/images/pathbench.svg"
              alt="PathBench Logo"
              width={300}
              height={300}
              className="h-20 object-contain"
            />
          </div>
          <p className="text-muted-foreground">
            Join the World's First Open, Multi-Task, and Multi-Organ Benchmark for Pathology Foundation Models
          </p>
        </div>

        {/* 新增合作机构logo区域*/}
        <div className="flex flex-1 justify-end items-center gap-3">
          {PARTNERS.map((partner) => (
            <a
              key={partner.id}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                group relative
                p-2 rounded-lg
                transition-all duration-300
                hover:scale-105 hover:shadow-md
                ${partner.bgColor}
              `}
              title={`Visit ${partner.name}`}
            >
              <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image 
                src={partner.logo}
                alt={partner.name}
                width={250}
                height={250}
                className="h-20 object-contain contrast-125 brightness-95 hover:contrast-100 transition-filter"
              />
              {/* 微光效果 */}
              <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
            </a>
          ))}
        </div>
      </header>



      <Tabs defaultValue="overview">

        <TabsList className="bg-gray-50 p-1.5 rounded-xl border border-gray-100 w-auto space-x-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-6 py-2 rounded-lg transition-all hover:bg-gray-100/70 text-gray-600"
          >
            <span className="text-sm font-medium">Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-6 py-2 rounded-lg transition-all hover:bg-gray-100/70 text-gray-600"
          >
            <span className="text-sm font-medium">Leaderboard</span>
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-6 py-2 rounded-lg transition-all hover:bg-gray-100/70 text-gray-600"
          >
            <span className="text-sm font-medium">Performance</span>
          </TabsTrigger>
          <TabsTrigger
            value="models"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-6 py-2 rounded-lg transition-all hover:bg-gray-100/70 text-gray-600"
          >
            <span className="text-sm font-medium">Models</span>
          </TabsTrigger>
        </TabsList>


        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PieDataDistributionChart />
            <TaskDistributionChart chartType="organ" />
            <TaskDistributionChart chartType="taskType" />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

            <ModelFilter />
            <TaskTypeFilter />
            <OrganFilter />
            <MetricSelector
              value={selectedMetric}
              onChange={setSelectedMetric}
            />
          </div>
          <div className="grid w-full">
            <OverallRankBarChart selectedMetric={selectedMetric} />
          </div>

          <div className="my-6">
            <h2 className="text-2xl font-bold mb-4">All Tasks</h2>
            <TaskTable onSelectTask={setSelectedTaskId} selectedTaskId={selectedTaskId} />
          </div>

          {selectedTaskId && (
            <TaskDescription taskId={selectedTaskId} />
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <div className="my-6">
            <h2 className="text-2xl font-bold mb-4">Overall Performance</h2>
            <LeaderboardTable />
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceBarChart
            selectedMetric={selectedMetric}
            selectedTaskId={selectedTaskId}
          />

          <div className="my-6">
            <h2 className="text-2xl font-bold mb-4">Tasks</h2>
            <TaskTable onSelectTask={setSelectedTaskId} selectedTaskId={selectedTaskId} />
          </div>

          {selectedTaskId && (
            <TaskDescription taskId={selectedTaskId} />
          )}
        </TabsContent>

        <TabsContent value="models">
          <div className="my-6">
            <h2 className="text-2xl font-bold mb-4">Model Details</h2>
            <ModelTable />
          </div>
        </TabsContent>
      </Tabs>

      <Footer />
    </div>
  );
}