"use client";

import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ModelFilter } from "@/components/filters/ModelFilter";
import { TaskTypeFilter } from "@/components/filters/TaskTypeFilter";
import { OrganFilter } from "@/components/filters/OrganFilter";
import Image from 'next/image';
import { useEvaluation } from "@/context/EvaluationContext";

import { TaskDistributionChart } from "@/components/charts/TaskDistributionChart";
import { OverallRankBarChart } from "@/components/charts/OverallRankBarChart"

import { PieDataDistributionChart } from "@/components/charts/PieDataDistributionChart";

import { ModelTable } from "@/components/tables/ModelTable";
import { MetricSelector } from "@/components/selectors/MetricSelector";
import { TaskTable } from "@/components/tables/TaskTable";
import { TaskDescription } from "@/components/tasks/TaskDescription";
import { Footer } from "@/components/layout/Footer";
import { LeaderboardTable } from "@/components/tables/LeaderboardTable";
import { DetailedPerformanceChart } from "@/components/charts/DetailedPerformanceChart";
import { LazyLoad } from "@/components/ui/LazyLoad";
import { SiArxiv } from 'react-icons/si';
import { FaGithub } from 'react-icons/fa';

// Direct data imports for Performance tab
import { models } from "@/data/models";
import { tasks } from "@/data/tasks";
import type { Task } from "@/types";





// Performance Content Component

function PerformanceContent() {

  // Group tasks by organ and sort alphabetically
  const tasksByOrgan = useMemo(() => {
    const organMap = new Map<string, Task[]>();

    tasks.forEach(task => {
      if (!organMap.has(task.organ)) {
        organMap.set(task.organ, []);
      }
      organMap.get(task.organ)!.push(task);
    });

    // Sort organs alphabetically and tasks within each organ
    const sortedOrgans = Array.from(organMap.keys()).sort();
    const result: { organ: string; tasks: Task[] }[] = [];

    sortedOrgans.forEach(organ => {
      const organTasks = organMap.get(organ)!.sort((a, b) => a.name.localeCompare(b.name));
      result.push({ organ, tasks: organTasks });
    });

    return result;
  }, []);



  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Detailed Performance</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Comprehensive performance analysis across all tasks and metrics
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs sm:text-sm text-gray-500">
            <span className="font-medium">{models.length}</span> models •
            <span className="font-medium ml-1">{tasksByOrgan.reduce((total, organ) => total + organ.tasks.length, 0)}</span> tasks
          </div>
        </div>
      </div>

      {/* Performance Charts by Organ - Optimized with lazy loading */}
      {tasksByOrgan.map(({ organ, tasks: organTasks }) => (
        <div key={organ} className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 border-b pb-2">
            {organ}
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {organTasks.map((task) => (
              <LazyLoad
                key={task.id}
                height={450}
                rootMargin="200px"
                threshold={0.1}
                placeholder={
                  <div className="w-full h-[450px] bg-gray-50 border border-gray-200 rounded-lg animate-pulse">
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
                      <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                        <div className="h-8 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-8 bg-gray-200 rounded w-4/6"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/6"></div>
                      </div>
                    </div>
                  </div>
                }
              >
                <DetailedPerformanceChart
                  taskId={task.id}
                  taskName={task.name}
                  organ={organ}
                />
              </LazyLoad>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Dashboard() {
  const { getTaskById, getAvailableMetrics } = useEvaluation();
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

  const availableMetrics = getAvailableMetrics();

  useEffect(() => {
    if (availableMetrics.length === 1 && selectedMetric !== availableMetrics[0]) {
      setSelectedMetric(availableMetrics[0]);
    }
  }, [availableMetrics, selectedMetric]);

  // 根据任务类型设置默认指标
  const handleTaskSelect = (taskId: string | undefined) => {
    setSelectedTaskId(taskId);
    if (!taskId) return;
    const task = getTaskById(taskId);
    if (task) {
      if (task.taskType === 'DFS Prediction' || task.taskType === 'OS Prediction' || task.taskType === 'DSS Prediction') {
        setSelectedMetric('C-Index');
      } else if (task.taskType === 'Classification') {
        setSelectedMetric('AUC');
      } else if (task.taskType === 'Report Generation') {
        setSelectedMetric('BLEU');
      }
    }
  };

  return (
    <div className="container mx-auto py-3 sm:py-6 max-w-[1600px]">
      <header className="pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-gray-100">
        {/* Mobile layout - stacked vertically */}
        <div className="flex flex-col sm:hidden gap-3">
          <div className="text-center">
            <div className="mb-2">
              <Image
                src={getImagePath("/images/pathbench.svg")}
                alt="PathBench Logo"
                width={300}
                height={300}
                className="h-16 object-contain mx-auto"
              />
            </div>
            <p className="text-muted-foreground text-xs leading-tight">
              A Multi-task, Multi-organ Benchmark for Real-world Clinical Performance Evaluation of Pathology Foundation Models
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* Mobile logo layout */}
            <a
              href="https://arxiv.org/abs/2505.20202"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2 rounded-lg bg-white-50 transition-all duration-300 hover:scale-105 hover:shadow-md touch-target"
              title="View arXiv Paper"
            >
              <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <SiArxiv className="h-12 w-12 text-red-600 contrast-125 brightness-95 hover:contrast-100 transition-filter" />
              <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
            </a>

            <a
              href="https://github.com/birkhoffkiki/PathBench"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2 rounded-lg bg-white-50 transition-all duration-300 hover:scale-105 hover:shadow-md touch-target"
              title="View GitHub Repository"
            >
              <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <FaGithub className="h-12 w-12 text-gray-800 contrast-125 brightness-95 hover:contrast-100 transition-filter" />
              <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
            </a>

            <a
              href="https://smartlab.cse.ust.hk/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2 rounded-lg bg-white-50 transition-all duration-300 hover:scale-105 hover:shadow-md touch-target"
              title="Visit SmartLab"
            >
              <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src={getImagePath("/images/smartlab.svg")}
                alt="SmartLab Logo"
                width={250}
                height={250}
                className="h-12 w-12 object-contain contrast-125 brightness-95 hover:contrast-100 transition-filter"
              />
              <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
            </a>

            <a
              href="https://hkust.edu.hk/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2 rounded-lg bg-white-50 transition-all duration-300 hover:scale-105 hover:shadow-md touch-target"
              title="Visit HKUST"
            >
              <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src={getImagePath("/images/ust_logo.svg")}
                alt="HKUST Logo"
                width={250}
                height={250}
                className="h-12 object-contain contrast-125 brightness-95 hover:contrast-100 transition-filter"
              />
              <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
            </a>
          </div>
        </div>

        {/* Desktop layout - side by side */}
        <div className="hidden sm:flex justify-between items-center gap-4">
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
            <p className="text-muted-foreground text-sm leading-tight">
              A Multi-task, Multi-organ Benchmark for Real-world Clinical Performance Evaluation of Pathology Foundation Models
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Desktop logo layout */}
            <a
              href="https://arxiv.org/abs/2505.20202"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-lg bg-white-50 transition-all duration-300 hover:scale-105 hover:shadow-md touch-target"
              title="View arXiv Paper"
            >
              <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <SiArxiv className="h-14 w-14 text-red-600 contrast-125 brightness-95 hover:contrast-100 transition-filter" />
              <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
            </a>

            <a
              href="https://github.com/birkhoffkiki/PathBench"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-lg bg-white-50 transition-all duration-300 hover:scale-105 hover:shadow-md touch-target"
              title="View GitHub Repository"
            >
              <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <FaGithub className="h-14 w-14 text-gray-800 contrast-125 brightness-95 hover:contrast-100 transition-filter" />
              <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
            </a>

            <a
              href="https://smartlab.cse.ust.hk/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-lg bg-white-50 transition-all duration-300 hover:scale-105 hover:shadow-md touch-target"
              title="Visit SmartLab"
            >
              <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src={getImagePath("/images/smartlab.svg")}
                alt="SmartLab Logo"
                width={250}
                height={250}
                className="h-14 w-14 object-contain contrast-125 brightness-95 hover:contrast-100 transition-filter"
              />
              <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
            </a>

            <a
              href="https://hkust.edu.hk/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-lg bg-white-50 transition-all duration-300 hover:scale-105 hover:shadow-md touch-target"
              title="Visit HKUST"
            >
              <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src={getImagePath("/images/ust_logo.svg")}
                alt="HKUST Logo"
                width={250}
                height={250}
                className="h-14 object-contain contrast-125 brightness-95 hover:contrast-100 transition-filter"
              />
              <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
            </a>
          </div>
        </div>
      </header>

      <Tabs defaultValue="overview">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="bg-gray-50 p-1 sm:p-1.5 rounded-xl border border-gray-100 w-auto space-x-0.5 sm:space-x-1 min-w-max flex">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-2 sm:px-6 py-1.5 sm:py-2 rounded-lg transition-all hover:bg-gray-100/70 text-gray-600 whitespace-nowrap"
            >
              <span className="text-xs sm:text-sm font-medium">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-2 sm:px-6 py-1.5 sm:py-2 rounded-lg transition-all hover:bg-gray-100/70 text-gray-600 whitespace-nowrap"
            >
              <span className="text-xs sm:text-sm font-medium">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-2 sm:px-6 py-1.5 sm:py-2 rounded-lg transition-all hover:bg-gray-100/70 text-gray-600 whitespace-nowrap"
            >
              <span className="text-xs sm:text-sm font-medium">Performance</span>
            </TabsTrigger>
            <TabsTrigger
              value="models"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-2 sm:px-6 py-1.5 sm:py-2 rounded-lg transition-all hover:bg-gray-100/70 text-gray-600 whitespace-nowrap"
            >
              <span className="text-xs sm:text-sm font-medium">Models</span>
            </TabsTrigger>
          </TabsList>
        </div>


        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <PieDataDistributionChart />
            <TaskDistributionChart chartType="organ" />
            <TaskDistributionChart chartType="taskType" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
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

          <div className="my-4 sm:my-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">All Tasks</h2>
            <TaskTable onSelectTask={handleTaskSelect} selectedTaskId={selectedTaskId} />
          </div>

          {selectedTaskId && (
            <TaskDescription taskId={selectedTaskId} />
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <div className="my-4 sm:my-6">
            <LeaderboardTable />
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4 sm:space-y-6">
          <PerformanceContent />
        </TabsContent>

        <TabsContent value="models">
          <div className="my-4 sm:my-6">
            <ModelTable />
          </div>
        </TabsContent>
      </Tabs>

      <Footer />
    </div>
  );
}