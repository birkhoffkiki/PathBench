"use client";

import { Card, CardContent } from "@/components/ui/card";
import { VisionCarousel } from "./VisionCarousel";
import { PartnersScroller } from "./PartnersScroller";
import { useEffect, useRef } from "react";

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
];


export function Footer() {
  const clustrmapsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Function to load the script
    const loadClusterMaps = () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.id = "clustrmaps";
      script.src = "//clustrmaps.com/map_v2.js?d=qqJm1XKFS90b9VP0V10uugIZder4bxWZ-j_VBVoZCO8&cl=ffffff&w=200&h=150";
      script.async = true; // Add async attribute

      // Append the script to the container
      if (clustrmapsContainerRef.current) {
        clustrmapsContainerRef.current.appendChild(script);
      }
    };

    // Load the script after the component has mounted
    loadClusterMaps();

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const script = document.getElementById("clustrmaps");
      if (script) {
        script.remove();
      }
    };
  }, []);

  return (
    <footer className="w-full mt-12 border-t">

      {/* 底部内容容器 */}
      <div className="w-full">
        <div className="flex flex-col gap-8 w-full">
          <VisionCarousel />

          <Card className="shadow-none w-full">
            <CardContent className="p-6 w-full">
              <h3 className="text-2xl font-semibold mb-4 text-primary">Join US</h3>
              <div className="space-y-6 text-muted-foreground">
                <div className="space-y-2 text-xm">
                  <h3>As a collaborator, you'll:</h3>
                  <ul className="space-y-1 pl-4 list-disc">
                    <li>🔎 Save time: Access a unified evaluation hub—no more stitching together disjointed </li>
                    <li>📈 Boost credibility: Prove your model's robustness against the most stringent clinical standards.</li>
                    <li>🌍 Reduce bias: Help expand datasets to underrepresented populations and improve equity in AI diagnostics.</li>
                    <li>🤝 Shape the future: Co-author benchmarks that become the gold standard for model evaluation and clinical adoption.</li>
                  </ul>
                  <h3>How to Contribute:</h3>
                  <ul className="space-y-1 pl-4 list-disc">
                    <li>🤖 Model evaluation: You could send us your model to evalute its performance on this benchmark. </li>
                    <li>🗃️ Contribute Task: You could contribute data to help expand the tasks of benchmark.</li>
                  </ul> 
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-none w-full">
            <CardContent className="p-6 w-full">
              <h3 className="text-2xl font-semibold mb-4 text-primary">Contact Information</h3>

              {/* First section - Prof. Chen's info */}
              <div className="space-y-3 text-xm text-muted-foreground mb-8">
                <p className="font-medium text-foreground">Prof. <a href="https://scholar.google.com/citations?user=Z_t5DjwAAAAJ&hl=zh-CN&oi=ao" className="text-primary hover:underline">Hao CHEN</a></p>
                <div className="space-y-1">
                  <p>Department of Computer Science and Engineering, Hong Kong University of Science and Technology</p>
                  <p>Division of Life Science, Hong Kong University of Science and Technology</p>
                  <p>📩 Email: <a href="mailto:jhc@ust.hk" className="text-primary hover:underline">jhc@ust.hk</a></p>
                </div>
              </div>

              {/* Second section - Mr. Ma's info */}
              <div className="space-y-3 text-xm text-muted-foreground mb-8">
                <p className="font-medium text-foreground">Mr. <a href="https://scholar.google.com/citations?user=VyKdUTUAAAAJ&hl=zh-CN&oi=ao" className="text-primary hover:underline">Jiabo MA (PhD Student)</a></p>
                <div className="space-y-1">
                  <p>Department of Computer Science and Engineering, Hong Kong University of Science and Technology</p>
                  <p>📩 Email: <a href="mailto:jmabq@connect.ust.hk" className="text-primary hover:underline">jmabq@connect.ust.hk</a></p>
                </div>
              </div>

              {/* Third section - Call to action */}
              <div className="space-y-3 text-xl text-muted-foreground">
                <p>If you're interested in evaluating foundation models or contributing datasets, please don't hesitate to reach out. Let's work together to advance the progress of digital and intelligent pathology.</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 合作伙伴部分 - 自动滚动版本 */}
        <div className="w-full my-8">
          <Card className="shadow-none rounded-none border-x-0 border-t-0">
            <CardContent className="container mx-auto p-4">
              <PartnersScroller partners={PARTNERS} speed={25} />
            </CardContent>
          </Card>
        </div>

        {/* Clustrmaps script will be loaded here dynamically */}
        <div
        ref={clustrmapsContainerRef}
        style={{
          width: '200px',
          height: '150px',
          overflow: 'hidden',
          margin: '0 auto', // 添加 margin auto
        }}
      >
        {/* Clustrmaps will be injected here */}
      </div>

        {/* 版权信息 */}
        <div className="flex justify-center mt-4 pb-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SmartLab, Hong Kong University of Science and Technology — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}