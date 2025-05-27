
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelFilter } from "@/components/filters/ModelFilter";
import { TaskTypeFilter } from "@/components/filters/TaskTypeFilter";
import { OrganFilter } from "@/components/filters/OrganFilter";
import Image from 'next/image';

import { TaskDistributionChart } from "@/components/charts/TaskDistributionChart";
import { PerformanceBarChart } from "@/components/charts/PerformanceBarChart";
import { OverallRankBarChart } from "@/components/charts/OverallRankBarChart"

import { PieDataDistributionChart } from "@/components/charts/PieDataDistributionChart";

import { ModelTable } from "@/components/tables/ModelTable";
import { MetricSelector } from "@/components/selectors/MetricSelector";
import { TaskTable } from "@/components/tables/TaskTable";
import { TaskDescription } from "@/components/tasks/TaskDescription";
import { Footer } from "@/components/layout/Footer";
import { LeaderboardTable } from "@/components/tables/LeaderboardTable";
import { SiArxiv } from 'react-icons/si';
import { FaGithub } from 'react-icons/fa';



const PARTNERS = [
  {
    id: 1,
    name: "smartlab logo",
    url: "https://smartlab.cse.ust.hk/",
    logo: "/images/smartlab.svg",
    bgColor: "bg-white-50"

  },
  {
    id: 2,
    name: "ust logo",
    url: "https://hkust.edu.hk/",
    logo: "/images/ust_logo.svg",
    bgColor: "bg-white-50"

  },
];


export function Dashboard() {
  // Get basePath from environment variable
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // Helper function to construct image paths correctly
  const getImagePath = (imagePath: string) => {
    if (basePath) {
      return `${basePath}${imagePath}`;
    }
    return imagePath;
  };

  const [selectedMetric, setSelectedMetric] = useState<string>("AUC");
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();

  return (
    <div className="container mx-auto py-6">
      <header className="pb-6 mb-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>

          <div className="mb-2">
            <Image
              src={getImagePath("/images/pathbench.svg")}
              alt="PathBench Logo"
              width={300}
              height={300}
              className="h-20 object-contain"
            />
          </div>
          <p className="text-muted-foreground text-sm">
            A Multi-task, Multi-organ Benchmark for Real-world Clinical Performance Evaluation of Pathology Foundation Models
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* arXiv and GitHub links - matching partner logo style */}
          <a
            href="https://arxiv.org/abs/2505.20202"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-1.5 rounded-lg bg-white-50 transition-all duration-300 hover:scale-105 hover:shadow-md"
            title="View arXiv Paper"
          >
            <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <SiArxiv className="h-16 w-16 text-red-600 contrast-125 brightness-95 hover:contrast-100 transition-filter" />
            <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
          </a>

          <a
            href="https://github.com/birkhoffkiki/PathBench"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-1.5 rounded-lg bg-white-50 transition-all duration-300 hover:scale-105 hover:shadow-md"
            title="View GitHub Repository"
          >
            <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <FaGithub className="h-16 w-16 text-gray-800 contrast-125 brightness-95 hover:contrast-100 transition-filter" />
            <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
          </a>

          {/* Partner logos - smartlab with reduced padding */}
          {PARTNERS.map((partner) => (
            <a
              key={partner.id}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                group relative
                ${partner.id === 1 ? 'p-0' : 'p-2'} rounded-lg
                transition-all duration-300
                hover:scale-105 hover:shadow-md
                ${partner.bgColor}
              `}
              title={`Visit ${partner.name}`}
            >
              <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src={getImagePath(partner.logo)}
                alt={partner.name}
                width={partner.id === 1 ? 100 : 250}
                height={250}
                className="h-20 object-contain contrast-125 brightness-95 hover:contrast-100 transition-filter"
              />

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