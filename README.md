# PathBench: A Comprehensive Benchmark for Pathology Foundation Models

[![arXiv](https://img.shields.io/badge/arXiv-2505.20202-b31b1b.svg)](https://arxiv.org/abs/2505.20202)
[![GitHub](https://img.shields.io/badge/GitHub-birkhoffkiki/PathBench-blue.svg)](https://github.com/birkhoffkiki/PathBench)
[![Demo](https://img.shields.io/badge/Demo-Live%20Site-green.svg)](https://birkhoffkiki.github.io/PathBench/)

**PathBench** is a comprehensive, multi-task, multi-organ benchmark designed for real-world clinical performance evaluation of pathology foundation models towards precision oncology. This interactive web platform provides standardized evaluation metrics and comparative analysis across 20+ state-of-the-art pathology foundation models.

## 🎯 Overview

PathBench addresses the critical need for standardized evaluation of pathology foundation models in clinical settings. Our benchmark encompasses:

- **20+ Foundation Models**: Including UNI, Virchow, CONCH, Prov-GigaPath, CHIEF, and more
- **Multi-organ Coverage**: Breast, lung, colorectal, prostate, kidney, and other major organs
- **Diverse Task Types**: Classification, survival prediction (OS, DFS, DSS), and report generation
- **Real Clinical Data**: Performance evaluation on both internal and external cohorts
- **Interactive Visualization**: Comprehensive charts, heatmaps, and comparative analysis tools

## 📊 Key Features

### 🔬 Comprehensive Model Coverage
- **Traditional Models**: ResNet50 baseline
- **Vision Transformers**: UNI, UNI2, Virchow, Virchow2, Prov-GigaPath
- **Specialized Pathology Models**: CONCH, CHIEF, Phikon, CTransPath
- **Multi-modal Models**: PLIP, MUSK
- **Latest Models**: H-Optimus, Hibou-L, GPFM, mSTAR

### 🏥 Clinical Task Evaluation
- **IHC Marker Prediction**: ER, PR, HER2, Ki67, CK5, and more
- **Survival Analysis**: Overall Survival (OS), Disease-Free Survival (DFS), Disease-Specific Survival (DSS)
- **Histological Grading**: Tumor grading and staging
- **Report Generation**: Automated pathology report generation with BLEU metrics

### 📈 Interactive Analytics
- **Performance Heatmaps**: Ranking visualization across tasks and organs
- **Comparative Charts**: Side-by-side model performance comparison
- **Statistical Analysis**: Mean performance with confidence intervals
- **Filtering & Search**: Dynamic filtering by organ, task type, and metrics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/birkhoffkiki/PathBench.git
cd PathBench

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:9000`.

### Building for Production

```bash
# Build the application
npm run build

# Serve the built application
npm start
```

## 🏗️ Project Structure

```
PathBench/
├── src/
│   ├── app/                    # Next.js app router
│   ├── components/             # React components
│   │   ├── charts/            # Visualization components
│   │   ├── tables/            # Data table components
│   │   ├── filters/           # Filter controls
│   │   └── ui/                # UI components
│   ├── data/                  # Data files and utilities
│   │   ├── models.json        # Model metadata
│   │   ├── performance.json   # Performance metrics
│   │   └── tasks.ts           # Task definitions
│   ├── types/                 # TypeScript type definitions
│   └── lib/                   # Utility functions
├── public/                    # Static assets
└── scripts/                   # Build scripts
```

## 📋 Data Structure

### Models
Each model entry includes:
- **Basic Info**: Name, citation, publication venue
- **Architecture**: Model architecture and parameters
- **Training Data**: Pretraining strategy and data sources
- **Specifications**: Number of slides, patches, and parameters

### Performance Metrics
Performance data includes:
- **Task Identification**: Unique task IDs and descriptions
- **Organ Classification**: Target organ systems
- **Cohort Information**: Internal vs. external validation
- **Metrics**: AUC, C-Index, BLEU scores with k-fold cross-validation results

## 🎨 Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Visualization**: ECharts, D3.js
- **Deployment**: GitHub Pages, Netlify
- **Build Tools**: Turbopack, PostCSS

## 📖 Usage Guide

### Navigation
1. **Overview Tab**: General statistics and model rankings
2. **Performance Tab**: Detailed performance analysis by task
3. **Models Tab**: Comprehensive model information and specifications

### Filtering Options
- **Model Filter**: Select specific models for comparison
- **Task Type Filter**: Focus on classification, survival, or generation tasks
- **Organ Filter**: Analyze performance by organ system
- **Metric Selector**: Choose evaluation metrics (AUC, C-Index, BLEU)

### Visualization Features
- **Heatmaps**: Color-coded performance rankings
- **Bar Charts**: Comparative performance with error bars
- **Pie Charts**: Data distribution visualization
- **Interactive Tables**: Sortable and filterable data tables

## 🔬 Research & Citation

This work is based on our research paper:

```bibtex
@article{ma2025pathbench,
      title={PathBench: A comprehensive comparison benchmark for pathology foundation models towards precision oncology},
      author={Ma, Jiabo and Xu, Yingxue and Zhou, Fengtao and Wang, Yihui and Jin, Cheng and Guo, Zhengrui and Wu, Jianfeng and Tang, On Ki and Zhou, Huajun and Wang, Xi and Luo, Luyang and Zhang, Zhengyu and Cai, Du and Gao, Zizhao and Wang, Wei and Liu, Yueping and He, Jiankun and Cui, Jing and Li, Zhenhui and Zhang, Jing and Gao, Feng and Zhang, Xiuming and Liang, Li and Chan, Ronald Cheong Kin and Wang, Zhe and Chen, Hao},
      journal={arXiv preprint arXiv:2505.20202},
      year={2025}
    }
```

## 🤝 Contributing

We welcome contributions to PathBench! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding New Model Results and Tasks
This frontend code can be served as a static website for any leaderboard. To add new tasks to the benchmark:

1. Update `src/data/tasks.ts` with task metadata
2. Add performance data to `src/data/performance.json`
3. Ensure proper model mapping in `src/data/models.json`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Need instantaneous support?  Please open **GitHub Issues**: [Create an issue](https://github.com/birkhoffkiki/PathBench/issues)
- Feeling academic?  Please cite our **Paper**: [arXiv:2505.20202](https://arxiv.org/abs/2505.20202)
- Want to see it in action?  Please visit our **Demo**: [Live Application](https://birkhoffkiki.github.io/PathBench/)

For inquiries regarding institutional collaborations, model benchmarking, or dataset contributions, please contact [jmabq@connect.ust.hk](mailto:jmabq@connect.ust.hk).

For technical support, website development inquiries, or platform enhancement suggestions, please reach out at [cjinag@connect.ust.hk](mailto:cjinag@connect.ust.hk).