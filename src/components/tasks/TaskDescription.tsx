"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface TaskDescriptionProps {
  taskId?: string;
}

export function TaskDescription({ taskId }: TaskDescriptionProps) {
  const { getTaskById } = useEvaluation();

  const task = taskId ? getTaskById(taskId) : undefined;

  if (!task) {
    return null;
  }

  // Get a detailed description based on task properties
  const getTaskDescription = () => {
    // Task descriptions with reference links
    interface TaskInfo {
      description: string;
      referenceUrl?: string;
      referenceTitle?: string;
    }

    const taskDescriptions: Record<string, TaskInfo | string> = {
      // Biomarker Prediction Tasks
      'IHC-PR Expression Prediction': {
        description: 'This task predicts progesterone receptor (PR) expression status from H&E-stained slides. PR is a critical biomarker for breast cancer subtyping and treatment selection, particularly for hormone therapy decisions.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Progesterone_receptor/',
        referenceTitle: 'Progesterone Receptor - Wikipedia'
      },
      'IHC-PR': {
        description: 'This task predicts progesterone receptor (PR) expression status from H&E-stained slides. PR is a critical biomarker for breast cancer subtyping and treatment selection, particularly for hormone therapy decisions.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Progesterone_receptor/',
        referenceTitle: 'Progesterone Receptor - Wikipedia'
      },
      'IHC-ER Expression Prediction': {
        description: 'This task predicts estrogen receptor (ER) expression status from H&E-stained slides. ER status is fundamental for breast cancer classification and determines eligibility for endocrine therapy.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Estrogen_receptor',
        referenceTitle: 'Estrogen Receptor - Wikipedia'
      },
      'IHC-HER2 Expression Prediction': {
        description: 'This task predicts HER2 protein overexpression from H&E-stained slides. HER2 status is crucial for targeted therapy decisions, particularly for trastuzumab treatment in breast cancer.',
        referenceUrl: 'https://www.cancer.gov/types/breast/breast-hormone-therapy-fact-sheet',
        referenceTitle: 'HER2 Testing - NCI'
      },
      'IHC-AR Expression Prediction': {
        description: 'This task predicts androgen receptor (AR) expression status from H&E-stained slides. AR expression provides insights into hormone signaling pathways and potential therapeutic targets.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Androgen_receptor',
        referenceTitle: 'Androgen Receptor - Wikipedia'
      },
      'IHC-CK5 Expression Prediction': {
        description: 'This task predicts cytokeratin 5 (CK5) expression, a basal cell marker that helps distinguish triple-negative breast cancer subtypes and provides prognostic information.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Keratin_5/',
        referenceTitle: 'Cytokeratin 5 - Wikipedia'
      },
      'IHC-C-MET Expression Prediction': {
        description: 'This task predicts c-MET receptor expression in lung cancer from H&E slides. c-MET is involved in tumor growth, invasion, and metastasis, and serves as a potential therapeutic target.',
        referenceUrl: 'https://en.wikipedia.org/wiki/C-Met',
        referenceTitle: 'c-MET Receptor - Wikipedia'
      },
      'IHC-CK7 Expression Prediction': {
        description: 'This task predicts cytokeratin 7 (CK7) expression, a key marker for lung adenocarcinoma differentiation and primary site determination in metastatic cancer.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Keratin_7/',
        referenceTitle: 'Cytokeratin 7 - Wikipedia'
      },
      'IHC-TTF-1 Expression Prediction': {
        description: 'This task predicts thyroid transcription factor-1 (TTF-1) expression, a highly specific marker for lung adenocarcinoma and thyroid carcinoma, essential for accurate diagnosis.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Thyroid_transcription_factor_1',
        referenceTitle: 'TTF-1 - Wikipedia'
      },
      'IHC-Napsin A Expression Prediction': {
        description: 'This task predicts Napsin A expression, a specific marker for lung adenocarcinoma that aids in distinguishing primary lung cancer from metastatic disease.',
        referenceUrl: 'https://en.wikipedia.org/wiki/NAPSA/',
        referenceTitle: 'Napsin A - Wikipedia'
      },
      'IHC-NapsinA Expression Prediction': {
        description: 'This task predicts Napsin A expression, a specific marker for lung adenocarcinoma that aids in distinguishing primary lung cancer from metastatic disease.',
        referenceUrl: 'https://en.wikipedia.org/wiki/NAPSA/',
        referenceTitle: 'Napsin A - Wikipedia'
      },
      'IHC-S-100 Expression Prediction': {
        description: 'This task predicts S-100 protein expression in gastric cancer, which is associated with neuroendocrine differentiation and has prognostic implications.',
        referenceUrl: 'https://en.wikipedia.org/wiki/S100_protein',
        referenceTitle: 'S-100 Protein - Wikipedia'
      },

      // Staging and Classification Tasks
      'TNM-N Staging': {
        description: 'This task predicts lymph node metastasis status (N0 vs N+) from primary tumor slides. Lymph node involvement is a critical prognostic factor that guides treatment decisions and staging.',
        referenceUrl: 'https://www.cancer.gov/about-cancer/diagnosis-staging/staging',
        referenceTitle: 'TNM Staging - NCI'
      },
      'TNM N Staging': {
        description: 'This task predicts lymph node metastasis status (N0 vs N+) from primary tumor slides. Lymph node involvement is a critical prognostic factor that guides treatment decisions and staging.',
        referenceUrl: 'https://www.cancer.gov/about-cancer/diagnosis-staging/staging',
        referenceTitle: 'TNM Staging - NCI'
      },
      'TNM-T Staging': {
        description: 'This task determines tumor invasion depth (T1-T4) based on histological features. T stage reflects local tumor extent and is fundamental for cancer staging and prognosis.',
        referenceUrl: 'https://www.cancer.gov/about-cancer/diagnosis-staging/staging',
        referenceTitle: 'TNM Staging - NCI'
      },
      'TNM-T Staging (2 classes)': {
        description: 'This task performs binary classification of tumor invasion depth into early-stage (T1+T2) versus advanced (T3+T4) categories, simplifying staging for treatment decisions.',
        referenceUrl: 'https://www.cancer.gov/about-cancer/diagnosis-staging/staging',
        referenceTitle: 'TNM Staging - NCI'
      },
      'TNM-T Staging (4 classes)': {
        description: 'This task performs fine-grained classification of tumor invasion depth into four distinct T stages (T1, T2, T3, T4), providing detailed staging information.',
        referenceUrl: 'https://www.cancer.gov/about-cancer/diagnosis-staging/staging',
        referenceTitle: 'TNM Staging - NCI'
      },
      'TNM T Staging': {
        description: 'This task determines tumor invasion depth (T1-T4) based on histological features. T stage reflects local tumor extent and is fundamental for cancer staging and prognosis.',
        referenceUrl: 'https://www.cancer.gov/about-cancer/diagnosis-staging/staging',
        referenceTitle: 'TNM Staging - NCI'
      },
      'TNM Staging': {
        description: 'This task performs comprehensive TNM staging classification combining tumor size, lymph node involvement, and metastasis status to determine overall cancer stage.',
        referenceUrl: 'https://www.cancer.gov/about-cancer/diagnosis-staging/staging',
        referenceTitle: 'TNM Staging - NCI'
      },
      'pTNM Staging': {
        description: 'This task performs pathological TNM staging based on surgical specimen examination, providing the most accurate staging information for treatment planning.',
        referenceUrl: 'https://www.cancer.gov/about-cancer/diagnosis-staging/staging',
        referenceTitle: 'TNM Staging - NCI'
      },
      'WHO Grading': {
        description: 'This task assigns WHO grade (Grade 2-4) to brain tumors based on histological features including cellularity, mitotic activity, necrosis, and vascular proliferation.',
        referenceUrl: 'https://en.wikipedia.org/wiki/WHO_classification_of_tumours_of_the_central_nervous_system',
        referenceTitle: 'WHO Brain Tumor Classification - Wikipedia'
      },

      // Histological Subtyping
      'Lauren Subtyping': {
        description: 'This task classifies gastric adenocarcinoma into Lauren subtypes: intestinal (glandular), diffuse (signet ring), or mixed type. This classification has significant prognostic and therapeutic implications.',
        referenceUrl: 'https://www.iccr-cancer.org/docs/ICCR-Stomach-HistoTtype.pdf',
        referenceTitle: 'Lauren Classification - ICCR'
      },
      'Lauren Classification': {
        description: 'This task classifies gastric adenocarcinoma into Lauren subtypes: intestinal (glandular), diffuse (signet ring), or mixed type. This classification has significant prognostic and therapeutic implications.',
        referenceUrl: 'https://www.iccr-cancer.org/docs/ICCR-Stomach-HistoTtype.pdf',
        referenceTitle: 'Lauren Classification - ICCR'
      },
      'Pathological Subtyping': 'This task determines specific histological subtypes based on morphological features, cellular architecture, and differentiation patterns.',
      'Molecular Subtyping': {
        description: 'This task classifies tumors into molecular subtypes (e.g., Luminal A/B, HER2+, Triple-negative) based on expression patterns predicted from H&E morphology.',
        referenceUrl: 'https://www.sciencedirect.com/topics/medicine-and-dentistry/breast-cancer-molecular-subtype/',
        referenceTitle: 'Breast Cancer Molecular Subtypes - ScienceDirect'
      },
      'CMS Subtyping': {
        description: 'This task performs consensus molecular subtyping of colorectal cancer into four subtypes (CMS1-4) based on gene expression patterns, each with distinct biological characteristics and treatment responses.',
        referenceUrl: 'https://www.nature.com/articles/nm.3967',
        referenceTitle: 'Consensus Molecular Subtypes - Nature Medicine'
      },
      'Consensus Molecular Subtyping': {
        description: 'This task classifies colorectal cancer into four consensus molecular subtypes (CMS1-4): CMS1 (immune), CMS2 (canonical), CMS3 (metabolic), and CMS4 (mesenchymal), each with distinct therapeutic implications.',
        referenceUrl: 'https://www.nature.com/articles/nm.3967',
        referenceTitle: 'Consensus Molecular Subtypes - Nature Medicine'
      },

      // Survival Analysis
      'OS Prediction': {
        description: 'This task predicts overall survival (OS) - the time from diagnosis to death from any cause. This is the gold standard endpoint for assessing treatment efficacy and patient prognosis.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Overall_survival',
        referenceTitle: 'Overall Survival - Wikipedia'
      },
      'DFS Prediction': {
        description: 'This task predicts disease-free survival (DFS) - the time from treatment to disease recurrence or death. DFS is crucial for monitoring treatment success and planning follow-up care.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Disease-free_survival',
        referenceTitle: 'Disease-free Survival - Wikipedia'
      },
      'DSS Prediction': {
        description: 'This task predicts disease-specific survival (DSS) - the time from diagnosis to death specifically caused by the cancer. DSS provides insights into cancer-specific mortality risk.',
        referenceUrl: 'https://www.cancer.gov/publications/dictionaries/cancer-terms/def/disease-specific-survival-rate',
        referenceTitle: 'Disease-specific Survival - NCI'
      },

      // Diagnostic Tasks
      'Primary Site Prediciton': {
        description: 'This task determines the primary organ of origin for metastatic tumors based on histological patterns. Critical for identifying unknown primary cancers and guiding treatment.',
        referenceUrl: 'https://www.cancer.gov/types/unknown-primary',
        referenceTitle: 'Cancer of Unknown Primary - NCI'
      },
      'Primary Site Prediction': {
        description: 'This task determines the primary organ of origin for metastatic tumors based on histological patterns. Critical for identifying unknown primary cancers and guiding treatment.',
        referenceUrl: 'https://www.cancer.gov/types/unknown-primary',
        referenceTitle: 'Cancer of Unknown Primary - NCI'
      },
      'Primary and Metastatic Classification': {
        description: 'This task distinguishes between primary tumors and metastatic deposits based on morphological features and growth patterns.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Metastasis',
        referenceTitle: 'Metastasis - Wikipedia'
      },
      'Metastatic vs Primary Classification': {
        description: 'This task distinguishes between primary tumors and metastatic deposits based on morphological features and growth patterns.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Metastasis',
        referenceTitle: 'Metastasis - Wikipedia'
      },
      'IDH Mutation Prediction': {
        description: 'This task predicts IDH mutation status in brain tumors from H&E slides. IDH mutations are key molecular markers that define glioma subtypes and influence prognosis and treatment.',
        referenceUrl: 'https://en.wikipedia.org/wiki/IDH1',
        referenceTitle: 'IDH Mutations - Wikipedia'
      },

      // Additional Survival Tasks
      'Overall Survival (OS) Prediction': {
        description: 'This task predicts overall survival (OS) - the time from diagnosis to death from any cause. This is the gold standard endpoint for assessing treatment efficacy and patient prognosis.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Overall_survival',
        referenceTitle: 'Overall Survival - Wikipedia'
      },
      'Disease-free Survival (DFS) Prediction': {
        description: 'This task predicts disease-free survival (DFS) - the time from treatment to disease recurrence or death. DFS is crucial for monitoring treatment success and planning follow-up care.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Disease-free_survival',
        referenceTitle: 'Disease-free Survival - Wikipedia'
      },
      'Disease-specific Survival (DSS) Prediction': {
        description: 'This task predicts disease-specific survival (DSS) - the time from diagnosis to death specifically caused by the cancer. DSS provides insights into cancer-specific mortality risk.',
        referenceUrl: 'https://www.cancer.gov/publications/dictionaries/cancer-terms/def/disease-specific-survival',
        referenceTitle: 'Disease-specific Survival - NCI'
      },

      // Colorectal Cancer Specific - removed duplicate, using the one above with reference link

      // Gastric Pathology
      'Histopathological Grading Assesment': {
        description: 'This task determines gastric cancer differentiation grade (well, moderate, poor) based on glandular architecture and cellular features. Tumor grade correlates with biological behavior and patient prognosis.',
        referenceUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3204467/',
        referenceTitle: 'Gastric Cancer Grading - PMC'
      },
      'Perineural Invasion Detection': {
        description: 'This task identifies perineural invasion (PNI) - cancer cell invasion around nerves. PNI is an important prognostic factor associated with increased recurrence risk and poor survival outcomes.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Perineural_invasion',
        referenceTitle: 'Perineural Invasion - Wikipedia'
      },
      'Vascular Invasion Detection': {
        description: 'This task detects vascular invasion - cancer cell invasion into blood or lymphatic vessels. This finding indicates increased metastatic potential and guides adjuvant therapy decisions.',
        referenceUrl: 'https://www.iccr-cancer.org/docs/ICCR-Liver2-VI.pdf/',
        referenceTitle: 'Vascular Invasion in Liver Cancer - ICCR'
      },
      'Intestinal Metaplasia Detection': {
        description: 'This task identifies intestinal metaplasia in gastric biopsies - a precancerous condition that increases gastric cancer risk and requires surveillance according to clinical guidelines.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Intestinal_metaplasia',
        referenceTitle: 'Intestinal Metaplasia - Wikipedia'
      },
      'HPACG Detection': {
        description: 'This task detects Helicobacter pylori-associated chronic gastritis, a major risk factor for gastric cancer development. H. pylori infection is the most common cause of chronic gastritis worldwide.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Helicobacter_pylori',
        referenceTitle: 'Helicobacter pylori - Wikipedia'
      },
      'ACGxHP Detection': {
        description: 'This task identifies autoimmune chronic gastritis with Helicobacter pylori co-infection, characterized by specific inflammatory patterns and associated with increased cancer risk.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Helicobacter_pylori/',
        referenceTitle: 'Autoimmune Gastritis - Wikipedia'
      },
      'Polyp Detection': {
        description: 'This task detects gastric polyps in biopsy specimens, which may represent precancerous lesions requiring monitoring or intervention based on histological type and size.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Gastric_polyp',
        referenceTitle: 'Gastric Polyps - Wikipedia'
      },
      'Ulcer Detection': {
        description: 'This task identifies gastric ulcers and associated inflammatory changes that may mask or predispose to malignancy, requiring careful histological evaluation.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Peptic_ulcer_disease',
        referenceTitle: 'Peptic Ulcer Disease - Wikipedia'
      },
      'Normal vs. Abnormal Classification': {
        description: 'This task distinguishes normal gastric tissue from pathological changes including inflammation, metaplasia, dysplasia, and malignancy in biopsy specimens.',
        referenceUrl: 'https://www.mayoclinic.org/diseases-conditions/stomach-cancer/symptoms-causes/syc-20352438/',
        referenceTitle: 'Stomach Cancer - Mayo Clinic'
      },

      // Default descriptions for general categories
      'detection': 'This task performs automated detection of specific pathological features or abnormalities in tissue samples using computational pathology methods.',
      'segmentation': 'This task performs pixel-level segmentation of pathological regions, cells, or structures in whole slide images for quantitative analysis.',
      'classification': 'This task classifies tissue samples into diagnostic categories based on morphological features and cellular patterns.',
      'regression': 'This task predicts continuous values such as biomarker expression levels, survival time, or risk scores from histological images.',
    };

    // Try to get specific task description first, then fall back to task type or default
    const specificTaskInfo = taskDescriptions[task.name];
    const typeTaskInfo = taskDescriptions[task.taskType];

    // Extract description and reference info
    let description = 'This task evaluates model performance on specific pathological criteria.';
    let referenceUrl: string | undefined;
    let referenceTitle: string | undefined;

    if (specificTaskInfo) {
      if (typeof specificTaskInfo === 'string') {
        description = specificTaskInfo;
      } else {
        description = specificTaskInfo.description;
        referenceUrl = specificTaskInfo.referenceUrl;
        referenceTitle = specificTaskInfo.referenceTitle;
      }
    } else if (typeTaskInfo) {
      if (typeof typeTaskInfo === 'string') {
        description = typeTaskInfo;
      } else {
        description = typeTaskInfo.description;
        referenceUrl = typeTaskInfo.referenceUrl;
        referenceTitle = typeTaskInfo.referenceTitle;
      }
    }

    // Add organ-specific details
    const organDetails = `It focuses on ${task.organ.toLowerCase()} tissue samples from ${task.cohort} cohort.`;

    // Add metrics information
    const metricsDetails = `Performance is evaluated using ${task.evaluationMetrics.join(', ')}.`;

    return {
      description: `${description} ${organDetails} ${metricsDetails}`,
      referenceUrl,
      referenceTitle
    };
  };

  const taskInfo = getTaskDescription();

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        {/* Task Description */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed flex-1">
            {taskInfo.description}
          </p>
          {taskInfo.referenceUrl && taskInfo.referenceTitle && (
            <div className="flex-shrink-0 sm:w-72">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 w-full hover:bg-blue-50 hover:border-blue-300 transition-colors px-3 truncate"
                onClick={() => window.open(taskInfo.referenceUrl, '_blank')}
                title={taskInfo.referenceTitle}
              >
                <ExternalLink className="w-3 h-3 mr-1.5 flex-shrink-0" />
                <span className="truncate">{taskInfo.referenceTitle}</span>
              </Button>
            </div>
          )}
        </div>

        {/* Dataset Information */}
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4">Dataset Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cohort</span>
              <p className="text-sm sm:text-base font-medium text-gray-900">{task.cohort}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Organ</span>
              <p className="text-sm sm:text-base font-medium text-gray-900">{task.organ}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Task Type</span>
              <p className="text-sm sm:text-base font-medium text-gray-900 capitalize">{task.taskType.replace('_', ' ')}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Metrics</span>
              <p className="text-sm sm:text-base font-medium text-gray-900">{task.evaluationMetrics.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
