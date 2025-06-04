"use client";

import { Card, CardContent } from "@/components/ui/card";
import { VisionCarousel } from "./VisionCarousel";
import { PartnersScroller } from "./PartnersScroller";
import { useEffect, useRef, useState } from "react";

// 合作医院
const PARTNERS = [
  {
    name: "",
    logo: "/images/nanfang_hospital.png",
    url: "https://www.nfyy.com/",
    width: 150,
    height: 150,
  },
  {
    name: "",
    logo: "/images/Prince_of_Wales_Hospital_logo.svg",
    url: "https://www3.ha.org.hk/pwh/index_e.asp",
    width: 220,
    height: 150,
  },
  {
    name: "",
    logo: '/images/zhangshanliuyuan.png',
    url: "https://www.zs6y.com/page/web/pc/index.html#/",
    width: 150,
    height: 150,
   },
  {
    name: "",
    logo: '/images/zszl.png',
    url: "https://www.sysucc.org.cn/",
    width: 130,
    height: 150,
  },
  {
    name: "",
    logo: '/images/zhongshanfuyi.png',
    url: "https://www.fahsysu.org.cn/home",
    width: 150,
    height: 150,
  },
  {
    name: "",
    logo: '/images/zfy.png',
    url: "https://www.zy91.com/",
    width: 150,
    height: 150,
  },
  {
    name: "",
    logo: '/images/ynzl.png',
    url: "https://www.ynszlyy.com/",
    width: 150,
    height: 150,
  },
  {
    name: "",
    logo: '/images/shandong_hospital.png',
    url: "https://www.sdhospital.com.cn/",
    width: 150,
    height: 150,
  },
  {
    name: "",
    logo: '/images/xijing_hospital.png',
    url: "https://www.fmmu.edu.cn/",
    width: 150,
    height: 150,
  },
  {
    name: "",
    logo: '/images/hebeisiyuan.png',
    url: "https://www.hbydsy.com/",
    width: 150,
    height: 150,
  },
  {
    name: "",
    logo: '/images/USTC_Hospital.png',
    url: "https://www.ahslyy.com.cn/",
    width: 150,
    height: 150,
  }
];


export function Footer() {
  const clustrmapsContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentYear, setCurrentYear] = useState<string>("");
  const [buildInfo, setBuildInfo] = useState({
    buildTimestamp: process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || ""
  });

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
    if (!buildInfo.buildTimestamp) {
      setBuildInfo({
        buildTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    }

    const loadClusterMaps = () => {
      // 检查是否在客户端环境
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
      }

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.id = "clustrmaps";
      script.src = "//clustrmaps.com/map_v2.js?d=qqJm1XKFS90b9VP0V10uugIZder4bxWZ-j_VBVoZCO8&cl=ffffff&w=200&h=150";
      script.async = true;

      if (clustrmapsContainerRef.current) {
        clustrmapsContainerRef.current.appendChild(script);
      }
    };

    loadClusterMaps();
    return () => {
      if (typeof document !== 'undefined') {
        const script = document.getElementById("clustrmaps");
        if (script) {
          script.remove();
        }
      }
    };
  }, [buildInfo.buildTimestamp]);

  return (
    <footer className="w-full mt-8 sm:mt-12 border-t">
      <div className="w-full">
        <div className="flex flex-col gap-6 sm:gap-8 w-full">
          <VisionCarousel />

          <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10 w-full">
            <CardContent className="p-6 sm:p-8 w-full">
              <div className="text-center mb-6">
                <h3 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  🚀 Join the PathBench Community
                </h3>
                <p className="text-lg text-muted-foreground">
                  Be part of the revolution in AI-powered pathology evaluation
                </p>
              </div>

              {/* Benefits Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6 justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">✨</span>
                  </div>
                  <h4 className="text-2xl font-semibold text-foreground">Why Join Us?</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50 border border-primary/10">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                      <span className="text-blue-600 text-xl">⏰</span>
                    </div>
                    <h5 className="font-medium text-foreground mb-2">Save Time & Effort</h5>
                    <p className="text-sm text-muted-foreground">Access a <strong>unified evaluation hub</strong>—no more stitching together disjointed tools</p>
                  </div>

                  <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50 border border-primary/10">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                      <span className="text-green-600 text-xl">✅</span>
                    </div>
                    <h5 className="font-medium text-foreground mb-2">Boost Credibility</h5>
                    <p className="text-sm text-muted-foreground">Prove your model's robustness against the <strong>most stringent clinical standards</strong></p>
                  </div>

                  <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50 border border-primary/10">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                      <span className="text-purple-600 text-xl">🌍</span>
                    </div>
                    <h5 className="font-medium text-foreground mb-2">Reduce Bias</h5>
                    <p className="text-sm text-muted-foreground"><strong>Expand datasets</strong> and <strong>advance AI equity</strong> for underrepresented groups</p>
                  </div>

                  <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50 border border-primary/10">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                      <span className="text-orange-600 text-xl">🚀</span>
                    </div>
                    <h5 className="font-medium text-foreground mb-2">Shape the Future</h5>
                    <p className="text-sm text-muted-foreground"><strong>Co-create benchmarks</strong> that become the gold standard for clinical adoption</p>
                  </div>
                </div>
              </div>

              {/* How to Contribute Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6 justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">🎯</span>
                  </div>
                  <h4 className="text-2xl font-semibold text-foreground">How to Contribute</h4>
                </div>

                {/* First Row - Submit Model, Contribute Data, Website Improvement */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {/* Model Evaluation Card */}
                  <div className="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-lg">🤖</span>
                      </div>
                      <h5 className="text-lg font-semibold text-blue-900">Submit Your Model</h5>
                    </div>
                    <p className="text-sm text-blue-800 mb-4">
                      Ready to make an impact in AI pathology? Want to evaluate your new model? Submit a PR to our evaluation repository and we'll test it at lightning speed!
                    </p>
                    <a
                      href="https://github.com/birkhoffkiki/PrePATH"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full justify-center sm:w-auto"
                    >
                      <span>🚀</span>
                      Submit to PrePATH
                      <span className="text-xs">↗</span>
                    </a>
                  </div>

                  {/* Data Contribution Card */}
                  <div className="p-6 rounded-lg bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-lg">🗃️</span>
                      </div>
                      <h5 className="text-lg font-semibold text-green-900">Contribute Data</h5>
                    </div>
                    <p className="text-sm text-green-800 mb-3">
                      Help expand our benchmark by contributing datasets and tasks to make PathBench even more comprehensive
                    </p>
                    <p className="text-xs text-green-700 mb-4">
                      Contact: <a href="https://scholar.google.com/citations?user=VyKdUTUAAAAJ" className="text-green-600 hover:underline font-medium">Mr. Jiabo MA (PhD Student)</a>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href="mailto:jmabq@connect.ust.hk"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium justify-center"
                      >
                        <span>📧</span>
                        Email
                      </a>
                      <a
                        href="https://scholar.google.com/citations?user=VyKdUTUAAAAJ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium justify-center"
                      >
                        <span>🎓</span>
                        Google Scholar
                        <span className="text-xs">↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Website Improvement Card */}
                  <div className="p-6 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-white text-lg">🛠️</span>
                      </div>
                      <h5 className="text-lg font-semibold text-orange-900">Website Improvement</h5>
                    </div>
                    <p className="text-sm text-orange-800 mb-3">
                      Found a bug or have suggestions for improving the website? We'd love to hear from you!
                    </p>
                    <p className="text-xs text-orange-700 mb-4">
                      Contact: <a href="https://scholar.google.com/citations?user=DFMxV_oAAAAJ" className="text-orange-600 hover:underline font-medium">Mr. Cheng JIN (PhD Student)</a>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href="mailto:cjinag@connect.ust.hk"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium justify-center"
                      >
                        <span>📧</span>
                        Email
                      </a>
                      <a
                        href="https://scholar.google.com/citations?user=DFMxV_oAAAAJ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium justify-center"
                      >
                        <span>🎓</span>
                        Google Scholar
                        <span className="text-xs">↗</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Second Row - Research Partnership (Supervisor) */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="p-8 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100/50 border-2 border-purple-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-white text-xl">🔬</span>
                      </div>
                      <div>
                        <h5 className="text-xl font-bold text-purple-900">Research Partnership</h5>
                      </div>
                    </div>
                    <p className="text-purple-800 mb-6 text-center text-base">
                      Collaborate with us on <strong>cutting-edge research</strong> and <strong>co-author papers</strong> that advance the field of AI-powered pathology evaluation
                    </p>

                    <div className="bg-white/50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-purple-700 mb-2">
                        <strong>Principal Investigator:</strong> <a href="https://scholar.google.com/citations?user=Z_t5DjwAAAAJ" className="text-purple-600 hover:underline font-medium">Prof. Hao CHEN</a>
                      </p>
                      <p className="text-xs text-purple-600">
                        Department of Computer Science and Engineering & Division of Life Science, HKUST
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href="mailto:jhc@ust.hk"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium justify-center"
                      >
                        <span>📧</span>
                        Research Collaboration
                      </a>
                      <a
                        href="https://smartlab.cse.ust.hk/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium justify-center"
                      >
                        <span>🔬</span>
                        Visit SmartLab
                        <span className="text-xs">↗</span>
                      </a>
                      <a
                        href="https://scholar.google.com/citations?user=Z_t5DjwAAAAJ&hl=zh-CN&oi=ao"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium justify-center"
                      >
                        <span>🎓</span>
                        Google Scholar
                        <span className="text-xs">↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>





          <div className="w-full my-6 sm:my-8">
            <Card className="shadow-none rounded-none border-x-0 border-t-0">
              <CardContent className="container mx-auto p-2 sm:p-4">
                <PartnersScroller partners={PARTNERS} speed={25} />
              </CardContent>
            </Card>
          </div>

          <div
            ref={clustrmapsContainerRef}
            style={{
              width: '200px',
              height: '150px',
              margin: '0 auto',
            }}
            className="flex justify-center items-center"
          >
          </div>

          <div className="flex justify-center mt-3 sm:mt-4 pb-4 sm:pb-6 px-4">
            <p className="text-xs text-muted-foreground text-center" suppressHydrationWarning>
              © {currentYear || "2025"} SmartLab, Hong Kong University of Science and Technology — All Rights Reserved
            </p>
          </div>

          <div className="flex justify-center pb-3 sm:pb-4 px-4">
            <p className="text-xs text-muted-foreground text-center" suppressHydrationWarning>
              Last updated: {buildInfo.buildTimestamp} UTC
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}