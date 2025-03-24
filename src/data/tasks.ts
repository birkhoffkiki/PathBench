import {Task} from "@/types";
export const tasks: Task[] = [
{updateTime: "2025/03/24", id: "HER2_Level-Breast-ZJ1", name: "HER2 Level Prediction for Breast Cancer", organId: "Breast", cases: 1344, wsis: 1344, level: "Patient", cohort: "Internal", taskType: "classification", datasetSource: "ZJ1", datasetSource_full: "The First Affiliated Hospital of Zhejiang University School of Medicine", description: "There are 164 cases of level 0, 347 cases of level 1, 424 cases of level 2 and 409 cases of level 3.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "MolSubtype-Breast-ZJ1", name: "Molecular Subtyping for Breast Cancer", organId: "Breast", cases: 2045, wsis: 2045, level: "Patient", cohort: "External", taskType: "classification", datasetSource: "ZJ1", datasetSource_full: "The First Affiliated Hospital of Zhejiang University School of Medicine", description: "It consists of 585 Triple-Negative Breast Cancer (TNBC), 292 HER2, 307 LumA and 861 LumB.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "HER2_Status-Breast-ZJ1", name: "HER2 Status Prediction for Breast Cancer", organId: "Breast", cases: 1344, wsis: 1344, level: "Patient", cohort: "External", taskType: "classification", datasetSource: "ZJ1", datasetSource_full: "The First Affiliated Hospital of Zhejiang University School of Medicine", description: "There are 164 negative cases and 1180 positive cases.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "PathSubtype-Gastric-YN3", name: "Pathological Subtyping for Gastric Cancer", organId: "Gastric", cases: 315, wsis: 315, level: "Slide", cohort: "External", taskType: "classification", datasetSource: "YN3", datasetSource_full: "The Third Affiliated Hospital of Kunming Medical University in Yunnan", description: "It comprises 82 slides of Signet Ring Cell Carcinoma of the Stomach and 233 slides of Stomach Adenocarcinoma.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "ER_Level-Breast-ZJ1", name: "ER Level Prediction for Breast Cancer", organId: "Breast", cases: 1548, wsis: 1548, level: "Patient", cohort: "Internal", taskType: "classification", datasetSource: "ZJ1", datasetSource_full: "The First Affiliated Hospital of Zhejiang University School of Medicine", description: "There are 499 cases of level 0, 268 cases of level 1, 421 cases of level 2 and 360 cases of level 3.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "Vascular-Gastric-NFH", name: "Vascular Invasion Detection for Gastric Cancer", organId: "Gastric", cases: 395, wsis: 395, level: "Patient", cohort: "Internal", taskType: "classification", datasetSource: "NFH", datasetSource_full: "NanFang Hospital", description: "This dataset comprises 197 positive cases and 198 negative cases.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "Metastatic_F-Lung-NFH", name: "Metastasis Detection and Primary Site Prediction for Lung Cancer", organId: "Lung", cases: 705, wsis: 705, level: "Patient", cohort: "Internal", taskType: "classification", datasetSource: "NFH", datasetSource_full: "NanFang Hospital", description: "It is performed to predict the primary site of metastatic cancer. The primary sites include six distinct classes: LUAD (391 cases), breast (55 cases), colon (186 cases), kidney (25 cases), liver (34 cases), and carcinoma of unknown primary (CUP, 14 cases).", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "Metastatic_C-Lung-QFS", name: "Metastasis Detection for Lung Cancer", organId: "Lung", cases: 430, wsis: 430, level: "Patient", cohort: "External", taskType: "classification", datasetSource: "QFS", datasetSource_full: "Shandong Provincial Qianfoshan Hospital", description: "There are 530 WSIs (430 cases) from Shandong Provincial Qianfoshan Hospital (QFS),  including 237 primary cases and 193 metastatic cases.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "Metastatic_F-Lung-QFS", name: "Metastasis Detection and Primary Site Prediction for Lung Cancer", organId: "Lung", cases: 430, wsis: 430, level: "Patient", cohort: "External", taskType: "classification", datasetSource: "QFS", datasetSource_full: "Shandong Provincial Qianfoshan Hospital", description: "It comprises 237 LUAD cases, 50 breast cases, 96 colon cases, 30 kidney cases, 10 liver cases, and 7 CUP cases.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "Perineural-Gastric-NFH", name: "Perineural Invasion Detection for Gastric Cancer", organId: "Gastric", cases: 396, wsis: 396, level: "Patient", cohort: "Internal", taskType: "classification", datasetSource: "NFH", datasetSource_full: "NanFang Hospital", description: "The morphological presence of Perineural Invasion (PNI) often indicates a more aggressive tumor and poorer survival rates. This dataset consists of 255 positive and 141 negative cases.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "PR_Status-Breast-ZJ1", name: "PR Status Prediction for Breast Cancer", organId: "Breast", cases: 1556, wsis: 1556, level: "Patient", cohort: "External", taskType: "classification", datasetSource: "ZJ1", datasetSource_full: "The First Affiliated Hospital of Zhejiang University School of Medicine", description: "There are 623 negative cases and 933 positive cases.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "Lauren-Gastric-YN3", name: "Lauren Subtyping for Gastric Cancer", organId: "Gastric", cases: 319, wsis: 319, level: "Slide", cohort: "External", taskType: "classification", datasetSource: "YN3", datasetSource_full: "The Third Affiliated Hospital of Kunming Medical University in Yunnan", description: "There are 143 slides of Diffuse-type, 90 slides of Intestinal-type and 86 slides of Mixed-type.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "PathSubtype-Gastric-NFH", name: "Pathological Subtyping for Gastric Cancer", organId: "Gastric", cases: 385, wsis: 385, level: "Slide", cohort: "External", taskType: "classification", datasetSource: "NFH", datasetSource_full: "NanFang Hospital", description: "It includes 166 slides of Tubular Stomach Adenocarcinoma, 163 slides of Signet Ring Cell Carcinoma of the Stomach and 66 slides of Stomach Adenocarcinoma.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "Metastatic_C-Lung-NFH", name: "Metastasis Detection for Lung Cancer", organId: "Lung", cases: 705, wsis: 705, level: "Patient", cohort: "Internal", taskType: "classification", datasetSource: "NFH", datasetSource_full: "NanFang Hospital", description: "It aims to identify if the tumor is metastatic (314 cases) or primary (391 cases).", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "ER_Status-Breast-ZJ1", name: "ER Status Prediction for Breast Cancer", organId: "Breast", cases: 1548, wsis: 1548, level: "Patient", cohort: "External", taskType: "classification", datasetSource: "ZJ1", datasetSource_full: "The First Affiliated Hospital of Zhejiang University School of Medicine", description: "There are 499 negative cases and 1049 positive cases.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "PathSubtype-Gastric-YN1", name: "Pathological Subtyping for Gastric Cancer", organId: "Gastric", cases: 254, wsis: 254, level: "Slide", cohort: "External", taskType: "classification", datasetSource: "YN1", datasetSource_full: "The First Affiliated Hospital of Kunming Medical University in Yunnan", description: "It consists of 59 slides of Signet Ring Cell Carcinoma of the Stomach and 195 slides of Stomach Adenocarcinoma.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "Perineural-Gastric-YN3", name: "Perineural Invasion Detection for Gastric Cancer", organId: "Gastric", cases: 319, wsis: 319, level: "Patient", cohort: "External", taskType: "classification", datasetSource: "YN3", datasetSource_full: "The Third Affiliated Hospital of Kunming Medical University in Yunnan", description: "The morphological presence of Perineural Invasion (PNI) often indicates a more aggressive tumor and poorer survival rates. This dataset includes 319 cases (112 positive and 207 negative).", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "Lauren-Gastric-NFH", name: "Lauren Subtyping for Gastric Cancer", organId: "Gastric", cases: 388, wsis: 388, level: "Slide", cohort: "External", taskType: "classification", datasetSource: "NFH", datasetSource_full: "NanFang Hospital", description: "Lauren subtyping is a common classification system for gastric cancer based on morphology, which typically divides tumors into Diffuse-type, Intestinal-type and Mixed-type. we collected 388 slides from NanFang Hospital (NFH), consisting of 159 slides of Diffuse-type, 102 slides of Intestinal-type and 127 slides of Mixed-type. ", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "DFS-Breast-ZJ1 ", name: "Disease-free Survival Prediction for Breast Cancer", organId: "Breast", cases: 454, wsis: 454, level: "Patient", cohort: "External", taskType: "survival prediction", datasetSource: "ZJ1 ", datasetSource_full: "The First Affiliated Hospital of Zhejiang University School of Medicine", description: "Disease-free Survival Prediction for Breast Cancer", evaluationMetrics: ["CIndex"]},
{updateTime: "2025/03/24", id: "Vascular-Gastric-YN3", name: "Vascular Invasion Detection for Gastric Cancer", organId: "Gastric", cases: 319, wsis: 319, level: "Patient", cohort: "External", taskType: "classification", datasetSource: "YN3", datasetSource_full: "The Third Affiliated Hospital of Kunming Medical University in Yunnan", description: "This dataset contains 122 positive and 197 negative cases.", evaluationMetrics: ["AUC"]},
{updateTime: "2025/03/24", id: "CK5_Status-Breast-ZJ1", name: "CK5 Status Prediction for Breast Cancer", organId: "Breast", cases: 961, wsis: 961, level: "Patient", cohort: "Internal", taskType: "classification", datasetSource: "ZJ1", datasetSource_full: "The First Affiliated Hospital of Zhejiang University School of Medicine", description: "There are 753 negative cases and 208 positive cases.", evaluationMetrics: ["AUC"]},
]
