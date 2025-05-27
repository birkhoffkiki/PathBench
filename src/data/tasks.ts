import { Task } from "@/types";
import { performances } from "./performance";

// Extract unique tasks from performance data
const extractTasksFromPerformance = (): Task[] => {
  const taskMap = new Map<string, Task>();

  performances.forEach(perf => {
    if (!taskMap.has(perf.taskId)) {
      let taskType = "Classification";
      const metricKeys = Object.keys(perf.metrics);
      if (metricKeys.includes("C-Index")) {
        // C-Index should include OS, DFS and DSS
        if (perf.task_name.includes("DSS")) {
          taskType = "DSS Prediction";
        } else if (perf.task_name.includes("DFS")) {
          taskType = "DFS Prediction";
        } else if (perf.task_name.includes("OS")) {
          taskType = "OS Prediction";
        }
      } else if (metricKeys.includes("BLEU")) {
        taskType = "Report Generation";
      } 

      taskMap.set(perf.taskId, {
        id: perf.taskId,
        name: perf.task_name,
        organ: perf.organ,
        taskType: taskType,
        cohort: perf.cohort,
        evaluationMetrics: metricKeys,
        description: `${taskType} task for ${perf.organ}`
      });
    }
  });

  return Array.from(taskMap.values());
};

export const tasks: Task[] = extractTasksFromPerformance();