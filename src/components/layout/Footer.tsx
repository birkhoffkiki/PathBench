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
      const script = document.getElementById("clustrmaps");
      if (script) {
        script.remove();
      }
    };
  }, [buildInfo.buildTimestamp]);

  return (
    <footer className="w-full mt-8 sm:mt-12 border-t">
      <div className="w-full">
        <div className="flex flex-col gap-6 sm:gap-8 w-full">
          <VisionCarousel />

          <Card className="shadow-none w-full">
            <CardContent className="p-4 sm:p-6 w-full">
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-primary">Join US</h3>
              <div className="space-y-4 sm:space-y-6 text-muted-foreground">
                <div className="space-y-2 text-sm sm:text-base">
                  <h3 className="font-medium">As a collaborator, you'll:</h3>
                  <ul className="space-y-1 pl-4 list-disc text-xs sm:text-sm">
                    <li>🔎 Save time: Access a unified evaluation hub—no more stitching together disjointed </li>
                    <li>📈 Boost credibility: Prove your model's robustness against the most stringent clinical standards.</li>
                    <li>🌍 Reduce bias: Help expand datasets to underrepresented populations and improve equity in AI diagnostics.</li>
                    <li>🤝 Shape the future: Co-author benchmarks that become the gold standard for model evaluation and clinical adoption.</li>
                  </ul>
                  <h3 className="font-medium">How to Contribute:</h3>
                  <ul className="space-y-1 pl-4 list-disc text-xs sm:text-sm">
                    <li>🤖 Model evaluation: You could send us your model to evalute its performance on this benchmark. </li>
                    <li>🗃️ Contribute Task: You could contribute data to help expand the tasks of benchmark.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>


          <Card className="shadow-none w-full">
            <CardContent className="p-4 sm:p-6 w-full">
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-primary">Contact Information</h3>

              <div className="space-y-3 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">
                <p className="font-medium text-foreground">Prof. <a href="https://scholar.google.com/citations?user=Z_t5DjwAAAAJ&hl=zh-CN&oi=ao" className="text-primary hover:underline">Hao CHEN</a></p>
                <div className="space-y-1">
                  <p>Department of Computer Science and Engineering, Hong Kong University of Science and Technology</p>
                  <p>Division of Life Science, Hong Kong University of Science and Technology</p>
                  <p>📩 Email: <a href="mailto:jhc@ust.hk" className="text-primary hover:underline">jhc@ust.hk</a></p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">
                <p className="font-medium text-foreground">Mr. <a href="https://scholar.google.com/citations?user=VyKdUTUAAAAJ&hl=zh-CN&oi=ao" className="text-primary hover:underline">Jiabo MA (PhD Student)</a></p>
                <div className="space-y-1">
                  <p>Department of Computer Science and Engineering, Hong Kong University of Science and Technology</p>
                  <p>📩 Email: <a href="mailto:jmabq@connect.ust.hk" className="text-primary hover:underline">jmabq@connect.ust.hk</a></p>
                </div>
              </div>

              <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
                <p>If you're interested in evaluating foundation models or contributing datasets, please don't hesitate to reach out. Let's work together to advance the progress of digital and intelligent pathology.</p>
              </div>
            </CardContent>
          </Card>
        </div>


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
            width: '150px',
            height: '120px',
            overflow: 'hidden',
            margin: '0 auto',
          }}
          className="sm:w-[200px] sm:h-[150px]"
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
    </footer>
  );
}