"use client";

import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ModelFilter } from "@/components/filters/ModelFilter";
import { TaskTypeFilter } from "@/components/filters/TaskTypeFilter";
import { OrganFilter } from "@/components/filters/OrganFilter";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useEvaluation } from "@/context/EvaluationContext";
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

import { TaskDistributionChart } from "@/components/charts/TaskDistributionChart";
import { OverallRankBarChart } from "@/components/charts/OverallRankBarChart"

import { PieDataDistributionChart } from "@/components/charts/PieDataDistributionChart";
import { DatasetInfoTable } from "@/components/tables/DatasetInfoTable";

import { ModelTable } from "@/components/tables/ModelTable";
import { MetricSelector } from "@/components/selectors/MetricSelector";
import { TaskTable } from "@/components/tables/TaskTable";
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
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<string[]>([]);
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters
  const allOrgans = useMemo(() => [...new Set(tasks.map(task => task.organ))].sort(), []);
  const allTaskTypes = useMemo(() => [...new Set(tasks.map(task => task.taskType))].sort(), []);
  const allCohorts = useMemo(() => [...new Set(tasks.map(task => task.cohort))].sort(), []);

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.organ.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.taskType.toLowerCase().includes(searchTerm.toLowerCase());

      // Organ filter
      const matchesOrgan = selectedOrgans.length === 0 || selectedOrgans.includes(task.organ);

      // Task type filter
      const matchesTaskType = selectedTaskTypes.length === 0 || selectedTaskTypes.includes(task.taskType);

      // Cohort filter
      const matchesCohort = selectedCohorts.length === 0 || selectedCohorts.includes(task.cohort);

      return matchesSearch && matchesOrgan && matchesTaskType && matchesCohort;
    });
  }, [searchTerm, selectedOrgans, selectedTaskTypes, selectedCohorts]);

  // Group filtered tasks by organ and sort alphabetically
  const tasksByOrgan = useMemo(() => {
    const organMap = new Map<string, Task[]>();

    filteredTasks.forEach(task => {
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
  }, [filteredTasks]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedOrgans([]);
    setSelectedTaskTypes([]);
    setSelectedCohorts([]);
  };

  // Toggle filter functions
  const toggleOrgan = (organ: string) => {
    setSelectedOrgans(prev =>
      prev.includes(organ)
        ? prev.filter(o => o !== organ)
        : [...prev, organ]
    );
  };

  const toggleTaskType = (taskType: string) => {
    setSelectedTaskTypes(prev =>
      prev.includes(taskType)
        ? prev.filter(t => t !== taskType)
        : [...prev, taskType]
    );
  };

  const toggleCohort = (cohort: string) => {
    setSelectedCohorts(prev =>
      prev.includes(cohort)
        ? prev.filter(c => c !== cohort)
        : [...prev, cohort]
    );
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedOrgans.length > 0 || selectedTaskTypes.length > 0 || selectedCohorts.length > 0;



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
            <span className="font-medium ml-1">{filteredTasks.length}</span> tasks
            {hasActiveFilters && (
              <span className="ml-1 text-blue-600">
                (filtered from {tasks.length})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2 sm:gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks by name, organ, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4"
            >
              <FaFilter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-0.5 sm:ml-1 min-w-[18px] text-center">
                  {[selectedOrgans.length, selectedTaskTypes.length, selectedCohorts.length].filter(n => n > 0).length}
                </span>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearAllFilters}
                className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 px-2 sm:px-4"
              >
                <FaTimes className="w-3 h-3" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filter Panels */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Organ Filter */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium">Filter by Organ</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[120px] sm:max-h-[180px] overflow-y-auto">
                <div className="space-y-2 sm:space-y-3">
                  {allOrgans.map(organ => (
                    <div key={organ} className="flex items-center space-x-2">
                      <Checkbox
                        id={`organ-${organ}`}
                        checked={selectedOrgans.includes(organ)}
                        onCheckedChange={() => toggleOrgan(organ)}
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                      <Label
                        htmlFor={`organ-${organ}`}
                        className="text-xs sm:text-sm font-normal leading-tight"
                      >
                        {organ}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task Type Filter */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium">Filter by Task Type</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[120px] sm:max-h-[180px] overflow-y-auto">
                <div className="space-y-2 sm:space-y-3">
                  {allTaskTypes.map(taskType => (
                    <div key={taskType} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tasktype-${taskType}`}
                        checked={selectedTaskTypes.includes(taskType)}
                        onCheckedChange={() => toggleTaskType(taskType)}
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                      <Label
                        htmlFor={`tasktype-${taskType}`}
                        className="text-xs sm:text-sm font-normal leading-tight"
                      >
                        {taskType}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cohort Filter */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium">Filter by Cohort</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[120px] sm:max-h-[180px] overflow-y-auto">
                <div className="space-y-2 sm:space-y-3">
                  {allCohorts.map(cohort => (
                    <div key={cohort} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cohort-${cohort}`}
                        checked={selectedCohorts.includes(cohort)}
                        onCheckedChange={() => toggleCohort(cohort)}
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                      <Label
                        htmlFor={`cohort-${cohort}`}
                        className="text-xs sm:text-sm font-normal leading-tight"
                      >
                        {cohort}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Performance Charts by Organ - Optimized with lazy loading */}
      {tasksByOrgan.length === 0 ? (
        <Card className="w-full shadow-sm border border-gray-200">
          <CardContent className="h-64 flex flex-col items-center justify-center text-center">
            <FaSearch className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters
                ? "Try adjusting your search terms or filters to find tasks."
                : "No tasks are available to display."
              }
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="flex items-center gap-2"
              >
                <FaTimes className="w-4 h-4" />
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        tasksByOrgan.map(({ organ, tasks: organTasks }) => (
          <div key={organ} className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 border-b pb-2">
              {organ}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({organTasks.length} task{organTasks.length !== 1 ? 's' : ''})
              </span>
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
        ))
      )}
    </div>
  );
}

export function Dashboard() {
  const { getTaskById } = useEvaluation();
  // Get basePath from environment variable
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // Helper function to construct image paths correctly
  const getImagePath = (imagePath: string) => {
    if (basePath) {
      return `${basePath}${imagePath}`;
    }
    return imagePath;
  };

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();

  // Responsive state management for partner icons
  const [isNarrowDesktop, setIsNarrowDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsNarrowDesktop(width >= 1200 && width < 1600); // 1200-1600px范围
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);





  // 根据任务类型设置默认指标
  const handleTaskSelect = (taskId: string | undefined) => {
    setSelectedTaskId(taskId);
    if (!taskId) return;
    const task = getTaskById(taskId);
    if (task) {
      if (task.taskType === 'DFS Prediction' || task.taskType === 'OS Prediction' || task.taskType === 'DSS Prediction') {
        setSelectedMetrics(['C-Index']);
      } else if (task.taskType === 'Classification') {
        setSelectedMetrics(['AUC']);
      } else if (task.taskType === 'Report Generation') {
        setSelectedMetrics(['BLEU']);
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

          <div className={`flex items-center ${isNarrowDesktop ? 'gap-1' : 'gap-3'} flex-wrap`}>
            {/* Desktop logo layout */}
            <a
              href="https://arxiv.org/abs/2505.20202"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative ${isNarrowDesktop ? 'p-2' : 'p-3'} rounded-lg bg-white-50 transition-all duration-300 hover:scale-105 hover:shadow-md touch-target`}
              title="View arXiv Paper"
            >
              <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <SiArxiv className={`${isNarrowDesktop ? 'h-10 w-10' : 'h-14 w-14'} text-red-600 contrast-125 brightness-95 hover:contrast-100 transition-filter`} />
              <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
            </a>

            <a
              href="https://github.com/birkhoffkiki/PathBench"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative ${isNarrowDesktop ? 'p-2' : 'p-3'} rounded-lg bg-white-50 transition-all duration-300 hover:scale-105 hover:shadow-md touch-target`}
              title="View GitHub Repository"
            >
              <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <FaGithub className={`${isNarrowDesktop ? 'h-10 w-10' : 'h-14 w-14'} text-gray-800 contrast-125 brightness-95 hover:contrast-100 transition-filter`} />
              <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
            </a>

            <a
              href="https://smartlab.cse.ust.hk/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative ${isNarrowDesktop ? 'p-2' : 'p-3'} rounded-lg bg-white-50 transition-all duration-300 hover:scale-105 hover:shadow-md touch-target`}
              title="Visit SmartLab"
            >
              <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src={getImagePath("/images/smartlab.svg")}
                alt="SmartLab Logo"
                width={250}
                height={250}
                className={`${isNarrowDesktop ? 'h-10 w-10' : 'h-14 w-14'} object-contain contrast-125 brightness-95 hover:contrast-100 transition-filter`}
              />
              <div className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br from-white/30 to-transparent" />
            </a>

            <a
              href="https://hkust.edu.hk/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative ${isNarrowDesktop ? 'p-1' : 'p-3'} rounded-lg bg-white-50 transition-all duration-300 hover:scale-105 hover:shadow-md touch-target`}
              title="Visit HKUST"
            >
              <div className="absolute inset-0 rounded-lg bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src={getImagePath("/images/ust_logo.svg")}
                alt="HKUST Logo"
                width={250}
                height={250}
                className={`${isNarrowDesktop ? 'h-10' : 'h-14'} object-contain contrast-125 brightness-95 hover:contrast-100 transition-filter`}
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
            <TaskDistributionChart chartType="taskType" />
            <TaskDistributionChart chartType="organ" />
            <PieDataDistributionChart selectedMetrics={selectedMetrics} />
          </div>

          {/* Dataset Information Table */}
          <div className="w-full">
            <DatasetInfoTable />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
            <ModelFilter />
            <TaskTypeFilter />
            <OrganFilter />
            <MetricSelector
              value={selectedMetrics}
              onChange={setSelectedMetrics}
            />
          </div>
          <div className="grid w-full">
            <OverallRankBarChart selectedMetrics={selectedMetrics} />
          </div>

          <div className="my-4 sm:my-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">All Tasks</h2>
            <TaskTable onSelectTask={handleTaskSelect} selectedTaskId={selectedTaskId} />
          </div>
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