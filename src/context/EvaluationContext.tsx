"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Task, Model, Organ, Performance } from "@/types";
import { organs } from "../data/organs";
import {models} from "../data/models";
import {tasks} from "../data/tasks";
import {performances} from "../data/performance";



interface EvaluationContextType {
  // Raw data
  allOrgans: Organ[];
  allTasks: Task[];
  allModels: Model[];
  allPerformances: Performance[];

  // Selected filters
  selectedOrganIds: string[];
  selectedTaskTypes: string[];
  selectedModelIds: string[];

  // Filter methods
  toggleOrganSelection: (organId: string) => void;
  toggleTaskTypeSelection: (taskType: string) => void;
  toggleModelSelection: (modelId: string) => void;

  // Computed values
  allTaskTypes: string[];

  // Getter methods
  getTaskById: (taskId: string) => Task | undefined;
  getModelById: (modelId: string) => Model | undefined;
  getOrganById: (organId: string) => Organ | undefined;
  getFilteredTasks: () => Task[];
  getFilteredModels: () => Model[];
  getFilteredPerformances: () => Performance[];
  getAvailableMetrics: () => string[];
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

export function EvaluationProvider({ children }: { children: React.ReactNode }) {
  // State for selections
  const [selectedOrganIds, setSelectedOrganIds] = useState<string[]>([]);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<string[]>([]);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);

  // Toggle selection methods
  const toggleOrganSelection = useCallback((organId: string) => {
    setSelectedOrganIds(prev =>
      prev.includes(organId)
        ? prev.filter(id => id !== organId)
        : [...prev, organId]
    );
  }, []);

  const toggleTaskTypeSelection = useCallback((taskType: string) => {
    setSelectedTaskTypes(prev =>
      prev.includes(taskType)
        ? prev.filter(type => type !== taskType)
        : [...prev, taskType]
    );
  }, []);

  const toggleModelSelection = useCallback((modelId: string) => {
    setSelectedModelIds(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  }, []);

  // Computed values
  const allTaskTypes = useMemo(() => {
    return Array.from(new Set(tasks.map(task => task.taskType)));
  }, []);

  // Getter methods
  const getTaskById = useCallback((taskId: string) => {
    return tasks.find(task => task.id === taskId);
  }, []);

  const getModelById = useCallback((modelId: string) => {
    return models.find(model => model.id === modelId);
  }, []);

  const getOrganById = useCallback((organId: string) => {
    return organs.find(organ => organ.id === organId);
  }, []);

  const getFilteredTasks = useCallback(() => {
    return tasks.filter(task => {
      // If no filters are applied, include all tasks
      if (selectedOrganIds.length === 0 && selectedTaskTypes.length === 0) {
        return true;
      }

      // Check organ filter
      const organMatch = selectedOrganIds.length === 0 || selectedOrganIds.includes(task.organId);

      // Check task type filter
      const taskTypeMatch = selectedTaskTypes.length === 0 || selectedTaskTypes.includes(task.taskType);

      return organMatch && taskTypeMatch;
    });
  }, [selectedOrganIds, selectedTaskTypes]);

  const getFilteredModels = useCallback(() => {
    return selectedModelIds.length > 0
      ? models.filter(model => selectedModelIds.includes(model.id))
      : models;
  }, [selectedModelIds]);

  const getFilteredPerformances = useCallback(() => {
    const filteredTasks = getFilteredTasks();
    const filteredModels = getFilteredModels();

    return performances.filter(performance =>
      filteredTasks.some(task => task.id === performance.taskId) &&
      filteredModels.some(model => model.id === performance.modelId)
    );
  }, [getFilteredTasks, getFilteredModels]);

  const getAvailableMetrics = useCallback(() => {
    const filteredTasks = getFilteredTasks();
    const allMetrics = filteredTasks.flatMap(task => task.evaluationMetrics);
    return Array.from(new Set(allMetrics));
  }, [getFilteredTasks]);

  const value = {
    // Raw data
    allOrgans: organs,
    allTasks: tasks,
    allModels: models,
    allPerformances: performances,

    // Selected filters
    selectedOrganIds,
    selectedTaskTypes,
    selectedModelIds,

    // Filter methods
    toggleOrganSelection,
    toggleTaskTypeSelection,
    toggleModelSelection,

    // Computed values
    allTaskTypes,

    // Getter methods
    getTaskById,
    getModelById,
    getOrganById,
    getFilteredTasks,
    getFilteredModels,
    getFilteredPerformances,
    getAvailableMetrics,
  };

  return (
    <EvaluationContext.Provider value={value}>
      {children}
    </EvaluationContext.Provider>
  );
}

export function useEvaluation() {
  const context = useContext(EvaluationContext);

  if (context === undefined) {
    throw new Error("useEvaluation must be used within an EvaluationProvider");
  }

  return context;
}
