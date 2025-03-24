import { IconType } from "react-icons/lib";

export interface Organ {
  id: string;
  name: string;
  description: string;
}

// Task type
export type TaskType =
  | "classification"
  | "segmentation"
  | "detection"
  | "prognosis"
  | "survival_analysis"
  | "other";

// Filters for the UI
export type Filters = {
  organs: string[];
  taskTypes: TaskType[];
  models: string[];
};


export interface Task {
  updateTime: string;
  id: string;
  name: string;
  cases: number;
  wsis: number;
  level: string;
  organId: string;
  cohort: string;
  taskType: string;
  datasetSource: string;
  datasetSource_full: string;
  sampleCount?: number;
  evaluationMetrics: string[];
  description?: string;
}

export interface Model {
  id: string;
  name: string;
  modelType: string;
  dim: number;
  parameters: number;
  trainingData: string;
  description: string;
  architecture: string;
  code: string;
  code_name: IconType;
  paper: string;
  paper_pub: IconType;
}

export interface Performance {
  id: string;
  cohort: string;
  taskId: string;
  modelId: string;
  metrics: Record<string, number[]>;
}
