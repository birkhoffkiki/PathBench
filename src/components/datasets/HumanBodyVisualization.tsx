"use client";

import { useEffect, useRef, useCallback } from "react";
import Script from "next/script";

interface HumanBodyVisualizationProps {
  basePath?: string;
}

export function HumanBodyVisualization({ basePath = '' }: HumanBodyVisualizationProps) {
  const humanBodyRootRef = useRef<HTMLDivElement>(null);
  const sapienLoadedRef = useRef(false);
  const visualizationInitializedRef = useRef(false);

  // 定义初始化函数
  const initVisualization = useCallback(() => {
    if (!humanBodyRootRef.current || !window.sapien || visualizationInitializedRef.current) {
      console.log("Cannot initialize: missing ref, sapien library, or already initialized");
      return;
    }

    console.log("Initializing human body visualization");
    visualizationInitializedRef.current = true;

    // 数据保持不变
    const processedData = [
      { key: 'Bladder', fileCount: 0.653, caseCount: 1.056 },
      { key: 'Brain', fileCount: 0.653, caseCount: 3.283 },
      { key: 'Breast', fileCount: 1.145, caseCount: 7.721 },
      { key: 'Cervix', fileCount: 0.653, caseCount: 6.87 },
      { key: 'Colorectal', fileCount: 0.653, caseCount: 9.87 },
      { key: 'Esophagus', fileCount: 0.653, caseCount: 3.1 },
      { key: 'Eye', fileCount: 1.145, caseCount: 0.15 },
      { key: 'Head and Neck', fileCount: 0.653, caseCount: 1.093 },
      { key: 'Kidney', fileCount: 1.145, caseCount: 4.742 },
      { key: 'Liver', fileCount: 0.653, caseCount: 1.681 },
      { key: 'Lung', fileCount: 0.653, caseCount: 8.232 },
      { key: 'Lymph Nodes', fileCount: 1.145, caseCount: 1.66 },
      { key: 'Ovary', fileCount: 0.653, caseCount: 1.41 },
      { key: 'Pancreas', fileCount: 0.653, caseCount: 1.965 },
      { key: 'Prostate', fileCount: 1.145, caseCount: 19.523 },
      { key: 'Skin', fileCount: 0.653, caseCount: 3.168 },
      { key: 'Soft Tissue', fileCount: 0.653, caseCount: 0.524 },
      { key: 'Stomach', fileCount: 1.145, caseCount: 4.121 },
      { key: 'Testis', fileCount: 0.653, caseCount: 1.007 },
      { key: 'Thyroid', fileCount: 0.653, caseCount: 2.064 },
      { key: 'Thymus', fileCount: 1.145, caseCount: 0.252 },
      { key: 'Uterus', fileCount: 0.653, caseCount: 1.41 },
    ];

    const container = humanBodyRootRef.current;
    const SCALE_CASE_COUNT = 1000;

    try {
      // 清空容器以确保没有重复内容
      container.innerHTML = '';

      const containerWidth = window.innerWidth < 768 ? 320 : 850;
      const containerHeight = window.innerWidth < 768 ? 300 : 500; // 响应式高度匹配人体图

      window.sapien.createHumanBody({
        title: 'Cases by Major Primary Site',
        selector: container,
        width: containerWidth,
        height: containerHeight,
        data: processedData,
        labelSize: window.innerWidth < 768 ? '12px' : '14px',
        primarySiteKey: 'key',
        fileCountKey: 'fileCount',
        caseCountKey: 'caseCount',
        tickInterval: 5,
        offsetLeft: window.innerWidth < 768 ? 50 : 250,
        offsetTop: window.innerWidth < 768 ? 20 : 50,
        clickHandler: (e: { key: string }) => {
          console.log("Clicked:", e.key);
        },
        mouseOverHandler: () => {},
        mouseOutHandler: () => {},
        keyDownHandler: () => {},
        keyUpHandler: () => {},
        skipLinkId: '#datasets-section',
        ariaLabel: (d: { key?: string; caseCount?: number; fileCount?: number }) =>
          `${d?.key}, ${(
            (d?.caseCount || 0) * SCALE_CASE_COUNT
          ).toLocaleString()} cases, ${(d?.fileCount || 0).toLocaleString()} files`,
      });

      // 在可视化创建后添加数值标签
      setTimeout(() => {
        // 1. 调整标题字体大小
        const title = container.querySelector('#title');
        if (title) {
          title.setAttribute('style', 'left: 260px !important; font-size: 18px !important; top: 0 !important; font-weight: bold; font-family: Montserrat, sans-serif; color: #111111;');
        }

        // 2. 获取所需元素
        const svg = container.querySelector('svg.chart g');
        const bars = container.querySelectorAll('#barGroup rect');
        const labels = container.querySelectorAll('#primarySiteLabels text');

        // 3. 移除可能已存在的值标签
        const existingLabels = container.querySelectorAll('.bar-value-label');
        existingLabels.forEach(label => label.remove());

        // 4. 计算最大柱长度，用于决定标签位置
        let maxCaseValue = 0;
        processedData.forEach(d => {
          maxCaseValue = Math.max(maxCaseValue, d.caseCount);
        });

        if (svg && bars.length > 0) {
          // 5. 添加数值标签
          processedData.forEach((d, i) => {
            const bar = bars[i] as SVGRectElement;
            if (bar) {
              const barWidth = parseFloat(bar.getAttribute('width') || '0');
              const barX = parseFloat(bar.getAttribute('x') || '0');
              const barY = parseFloat(bar.getAttribute('y') || '0');
              const barHeight = parseFloat(bar.getAttribute('height') || '0');

              // 数值文本
              const valueText = Math.round(d.caseCount * SCALE_CASE_COUNT).toLocaleString();

              // 创建新的文本元素显示数值
              const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

              // 条件判断：如果柱子足够长，将标签放在柱子内部，否则放在右侧
              const isLongBar = d.caseCount > (maxCaseValue * 0.3);

              if (isLongBar) {
                // 长柱子：白色标签在内部
                text.textContent = valueText;
                text.setAttribute('x', (barX + barWidth - 10) + '');
                text.setAttribute('y', (barY + barHeight/2 + 2) + '');
                text.setAttribute('fill', 'white');
                text.setAttribute('text-anchor', 'end');
                text.setAttribute('font-weight', '600');
              } else {
                // 短柱子：黑色标签在右侧
                text.textContent = valueText;
                text.setAttribute('x', (barX + barWidth + 8) + '');
                text.setAttribute('y', (barY + barHeight/2 + 2.5) + '');
                text.setAttribute('fill', '#444');
                text.setAttribute('text-anchor', 'start');
              }

              text.setAttribute('font-size', '13px');
              text.setAttribute('class', 'bar-value-label');
              text.setAttribute('font-family', 'Arial');
              text.setAttribute('dominant-baseline', 'middle');

              svg.appendChild(text);
            }
          });

          // 6. 调整标签垂直对齐
          labels.forEach((label, i) => {
            const bar = bars[i] as SVGRectElement;
            if (bar) {
              const barY = parseFloat(bar.getAttribute('y') || '0');
              const barHeight = parseFloat(bar.getAttribute('height') || '0');
              // 精确计算垂直居中位置
              const labelY = barY + barHeight/2 + 2;
              label.setAttribute('y', labelY + '');
              label.setAttribute('dominant-baseline', 'middle');
              label.setAttribute('font-size', '14px');
            }
          });
        }

        // 7. 调整横轴标签字体大小
        const xAxisLabels = container.querySelectorAll('#xAxisLabels text');
        xAxisLabels.forEach(label => {
          label.setAttribute('font-size', '14px');
          label.setAttribute('fill', '#333');
        });

        // 8. 调整图表整体高度
        const chartSvg = container.querySelector('svg.chart');
        if (chartSvg) {
          chartSvg.setAttribute('height', '580');
          chartSvg.setAttribute('viewBox', `0 0 ${containerWidth} 580`);
        }
      }, 100); // 增加延迟以确保元素加载完成

      console.log("Human body visualization initialized successfully");
    } catch (error) {
      console.error("Error initializing human body visualization:", error);
    }
  }, []);

  // 处理脚本加载
  const handleSapienLoad = () => {
    console.log("Sapien script loaded");

    if (typeof window !== 'undefined') {
      if (window.sapien && !sapienLoadedRef.current) {
        sapienLoadedRef.current = true;

        setTimeout(() => {
          if (humanBodyRootRef.current) {
            initVisualization();
          }
        }, 500);
      }
    }
  };

  // 组件挂载时的效果
  useEffect(() => {
    if (typeof window !== 'undefined' && window.sapien && !sapienLoadedRef.current) {
      sapienLoadedRef.current = true;
      setTimeout(initVisualization, 100);
    }

    const handleResize = () => {
      if (visualizationInitializedRef.current) {
        if (humanBodyRootRef.current) {
          visualizationInitializedRef.current = false;
          setTimeout(initVisualization, 100);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initVisualization]);

  return (
    <section id="datasets-section" className="my-12 border-t border-gray-100 pt-12">
      {/* 更新CSS样式 */}
      <style jsx global>{`
        #human-body-root {
            position: relative;
            height: 580px;
            width: 100%;
            overflow: visible;
        }

        #human-body-root #human-body-highlights {
            position: relative;
            top: -20px;
        }
        #human-body-root #human-body-highlights > svg {
            position: absolute;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        /* 调整柱状图区域 */
        #human-body-root #svgContainer {
            position: absolute;
            left: 260px;
            width: calc(100% - 280px);
            max-width: 600px;
        }

        /* 调整标题和文字 */
        #human-body-root #title {
            position: absolute;
            color: #111111;
            font-weight: 700 !important;
            font-family: 'Montserrat', 'sans-serif';
            font-size: 16px !important;
            left: 260px !important;
            top: 0 !important;
        }

        /* 图表样式优化 */
        #human-body-root .chart g {
            color: rgba(182, 182, 182, 0.93);
        }

        /* 优化柱状图文本标签样式 */
        #human-body-root #primarySiteLabels text {
            font-size: 14px !important;
            fill: rgb(40, 40, 40) !important;
            text-anchor: end !important;
            font-family: 'Arial', sans-serif !important;
            dominant-baseline: middle !important;
        }

        /* 柱状图横坐标标签样式 */
        #human-body-root #xAxisLabels text {
            font-size: 14px !important;
            fill: rgb(40, 40, 40) !important;
            font-family: 'Arial', sans-serif !important;
        }

        /* 优化柱状图样式 */
        #human-body-root #barGroup rect {
            height: 18px !important;
            rx: 2px;
            ry: 2px;
        }

        /* 优化数值标签样式 */
        #human-body-root .bar-value-label {
            font-family: 'Arial', sans-serif;
            font-weight: 500;
            pointer-events: none;
        }

        /* 让柱子上的值标签更明显 */
        #human-body-root .bar-value-label[fill="white"] {
            text-shadow: 0px 0px 1px rgba(0, 0, 0, 0.3);
        }

        /* 保持人体图在左侧位置正确 */
        #human-body-root #human-body-svg-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 260px;
            height: 580px;
        }

        /* 图表调整 */
        #svgContainer > svg {
            margin-top: 20px;
        }

        /* 保留原有人体图元素的位置定义 */
        #human-body-root #male {
            position: absolute;
        }
        #body-outline-background {
            position: absolute;
            left: 8px;
            top: -10px;
        }
        #human-body-root #female {
            left: 107px;
            position: absolute;
        }
        #human-body-root #female-organs {
            position: absolute;
            top: -15px;
            left: 151px;
            width: 123px;
        }
        #human-body-root #male-organs {
            position: absolute;
            height: 34px;
            width: 25px;
            top: 255px;
            left: 111px;
        }

        #human-body-root #Head-and-Neck {
            height: 138px;
            width: 102px;
            top: -1px;
            left: 156px;
        }
        #human-body-root #Brain {
            height: 35px;
            width: 50px;
            top: 20px;
            left: 183px;
        }
        #human-body-root #Lung {
            height: 55px;
            width: 37px;
            top: 133px;
            left: 173px;
        }
        #human-body-root #Pleura {
            height: 26px;
            width: 37px;
            top: 161px;
            left: 173px;
        }
        #human-body-root #Lymph-Nodes {
            height: 70px;
            width: 45px;
            top: 83px;
            left: 159px;
        }
        #human-body-root #Soft-Tissue {
            height: 369px;
            width: 128px;
            top: 89px;
            left: 138px;
        }
        #human-body-root #Eye {
            height: 20px;
            width: 20px;
            top: 39px;
            left: 205px;
        }
        #human-body-root #Breast {
            height: 40px;
            width: 40px;
            top: 137px;
            left: 207px;
        }
        #human-body-root #Kidney {
            height: 21px;
            width: 15px;
            top: 198px;
            left: 218px;
        }
        #human-body-root #Adrenal-Gland {
            height: 12px;
            width: 14px;
            top: 197px;
            left: 219px;
        }
        #human-body-root #Bile-Duct {
            height: 28px;
            width: 11px;
            top: 190px;
            left: 195px;
        }
        #human-body-root #Pancreas {
            height: 21px;
            width: 45px;
            top: 191px;
            left: 183px;
        }
        #human-body-root #Bladder {
            height: 16px;
            width: 25px;
            top: 258px;
            left: 194px;
        }
        #human-body-root #Prostate {
            height: 25px;
            width: 30px;
            top: 269px;
            left: 103px;
        }
        #human-body-root #Testis {
            height: 23px;
            width: 15px;
            top: 288px;
            left: 124px;
        }
        #human-body-root #Uterus {
            height: 23px;
            width: 21px;
            top: 250px;
            left: 196px;
        }
        #human-body-root #Cervix {
            height: 14px;
            width: 15px;
            top: 258px;
            left: 199px;
        }
        #human-body-root #Ovary {
            height: 13px;
            width: 13px;
            top: 249px;
            left: 214px;
        }
        #human-body-root #Colorectal {
            height: 95px;
            width: 87px;
            top: 210px;
            left: 165px;
        }
        #human-body-root #Liver {
            height: 42px;
            width: 47px;
            top: 173px;
            left: 188px;
        }
        #human-body-root #Stomach {
            height: 43px;
            width: 45px;
            top: 166px;
            left: 189px;
        }
        #human-body-root #Blood {
            height: 153px;
            width: 35px;
            top: 243px;
            left: 211px;
        }
        #human-body-root #Bone {
            height: 89px;
            width: 14px;
            top: 383px;
            left: 212px;
        }
        #human-body-root #Bone-Marrow-and-Blood {
            height: 114px;
            width: 30px;
            top: 371px;
            left: 204px;
        }
        #human-body-root #Skin {
            height: 227px;
            width: 57px;
            top: 95px;
            left: 221px;
        }
        #human-body-root #Nervous-System {
            height: 279px;
            width: 56px;
            top: 222px;
            left: 159px;
        }
        #human-body-root #Thyroid {
            height: 16px;
            width: 18px;
            top: 90px;
            left: 198px;
        }
        #human-body-root #Thymus {
            height: 23px;
            width: 17px;
            top: 147px;
            left: 200px;
        }
        #human-body-root #Esophagus {
            height: 57px;
            width: 20px;
            top: 86px;
            left: 197px;
        }
        #human-body-root #body-plot-skip-nav {
            position: absolute;
            left: -5000px;
            color: #111111;
        }
        #human-body-root #body-plot-skip-nav:focus {
            left: 0;
        }
      `}</style>

      <h2 className="text-3xl font-bold tracking-tight mb-6">Datasets</h2>

      {/* 外部脚本 */}
      <Script
        src="https://cdn.jsdelivr.net/npm/d3@7"
        strategy="afterInteractive"
      />
      <Script
        src={`${basePath}/static/js/nci-gdc/sapien/dist/index.umd.js`}
        strategy="afterInteractive"
        onLoad={handleSapienLoad}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 左侧文本概述 */}
        <div className="md:col-span-4">
          <h4 className="text-lg font-semibold mb-10" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
            Data Repo Summary
          </h4>

          <div className="text-muted-foreground" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
            <p className="mb-6" style={{fontSize: "1.125rem"}}>
              Our pathology dataset provide a comprehensive, standardized repository of cancer-related data, integrating
              clinical, genomic, and therapeutic information from multiple sources around the globe. This platform is
              designed to support researchers in exploring disease mechanisms, identifying biomarkers, and developing
              personalized treatment strategies.
            </p>
            <p className="mb-6" style={{fontSize: "1.125rem"}}>
              By offering curated datasets with consistent formats and annotations, we facilitate cross-study comparisons
              and enhance reproducibility in cancer research. Researchers can leverage this resource to conduct
              statistical analyses, develop health foundation models, and gain insights into the progression of various
              cancer types.
            </p>
          </div>
        </div>

        {/* 右侧人体可视化 */}
        <div className="md:col-span-8">
          <div className="w-full overflow-hidden">
            <div
              id="human-body-root"
              ref={humanBodyRootRef}
              style={{ minWidth: "850px" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}