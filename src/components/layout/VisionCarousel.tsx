import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Network, FlaskConical, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VisionSlide {
  title: string;
  content: string[];
  icon: React.ReactNode;
}

const visionData: VisionSlide[] = [
  {
    title: "Real-World Complexity, Zero Compromises",
    content: [
      "Multi-organ, multi-task evaluation: Mirror real clinical workflows (diagnosis, grading, segmentation, prognosis).",
      "Diverse, global datasets: Cover the top-10 cancers in collaboration with hospitals around the world.",
      "Strict privacy guardrails: No public data leaks—models are evaluated securely without raw data exposure."
    ],
    icon: <Network className="w-5 h-5 text-blue-500/70" /> // 使用网络图标代表复杂性和互联
  },
  {
    title: "Rigorous, Reproducible Science",
    content: [
      "Combat randomness: 10 validation runs with varied seeds.",
      "Standardized framework: All models tested under identical hardware, preprocessing, and task settings."
    ],
    icon: <FlaskConical className="w-5 h-5 text-emerald-500/70" /> // 使用实验烧瓶图标代表科学性
  },
  {
    title: "Transparency Drives Progress",
    content: [
      "Dynamic, interactive leaderboards: Filter models by organ, task, metrics.",
      "Community-driven updates: Benchmarks evolve with new clinical challenges (e.g., rare diseases, novel biomarkers)."
    ],
    icon: <LineChart className="w-5 h-5 text-purple-500/70" /> // 使用图表图标代表透明度和进展
  }
];

export function VisionCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % visionData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % visionData.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + visionData.length) % visionData.length);
    setIsAutoPlaying(false);
  };

  return (
    <Card className="shadow-lg w-full bg-gradient-to-br from-slate-40/80 to-slate-100/80 dark:from-slate-900/80 dark:to-slate-800/80">
      <CardContent className="p-6 w-full">
        {/* 标题部分 */}
        <h3 className="text-2xl font-semibold mb-4 text-primary text-center">Our Vision</h3>
        <div className="italic font-semibold text-left mb-8 text-primary/70">
          To create the world's most rigorous, clinically grounded benchmark for pathology foundation models—free from bias, noise, and shortcuts.
        </div>

        {/* 轮播部分 */}
        <div className="relative h-[200px] overflow-hidden">
          {/* 导航按钮 */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-primary/5 hover:bg-primary/10 rounded-full p-2 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-primary/70" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-primary/5 hover:bg-primary/10 rounded-full p-2 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-primary/70" />
          </button>

          {/* 轮播内容 */}
          <div className="relative h-full">
            {visionData.map((slide, index) => (
              <div
                key={index}
                className={cn(
                  "absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out",
                  currentSlide === index 
                    ? "opacity-100 translate-x-0" 
                    : currentSlide > index 
                      ? "opacity-0 -translate-x-full" 
                      : "opacity-0 translate-x-full"
                )}
                style={{
                  transform: `translateX(${(index - currentSlide) * 100}%)`,
                  visibility: Math.abs(currentSlide - index) <= 1 ? 'visible' : 'hidden'
                }}
              >
                <div className="p-4 h-full">
                  <h4 className="font-medium text-lg text-foreground mb-4 text-left flex items-center gap-2">
                    {slide.icon}
                    <span>{slide.title}</span>
                  </h4>
                  <ul className="space-y-3 text-base pl-6 list-disc">
                    {slide.content.map((item, i) => (
                      <li key={i} className="text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* 指示器 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {visionData.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsAutoPlaying(false);
                }}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === currentSlide 
                    ? "bg-primary/70 w-6" 
                    : "bg-primary/20 hover:bg-primary/40"
                )}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

