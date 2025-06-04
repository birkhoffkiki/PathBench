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
  id: string;
  name: string;
  organ: string;
  taskType: string;
  cohort: string;
  evaluationMetrics: string[];
  description?: string;
}

export interface Model {
  name: string;
  citation: string;
  slides: string;
  patches: string;
  parameters: string;
  architecture: string;
  pretraining_strategy: string;
  pretraining_data_source: string;
  stain: string;
  released_date: string;
  publication: string;
}

export interface Performance {
  modelID: string;
  organ: string;
  task_name: string;
  cohort: string;
  taskId: string;
  metrics: Record<string, number[]>;
}
