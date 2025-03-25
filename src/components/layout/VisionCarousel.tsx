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
    icon: <Network className="w-5 h-5 text-blue-500/70" /> 
  },
  {
    title: "Rigorous, Reproducible Science",
    content: [
      "Combat randomness: 10 validation runs with varied seeds.",
      "Standardized framework: All models tested under identical hardware, preprocessing, and task settings."
    ],
    icon: <FlaskConical className="w-5 h-5 text-emerald-500/70" />
  },
  {
    title: "Transparency Drives Progress",
    content: [
      "Dynamic, interactive leaderboards: Filter models by organ, task, metrics.",
      "Community-driven updates: Benchmarks evolve with new clinical challenges (e.g., rare diseases, novel biomarkers)."
    ],
    icon: <LineChart className="w-5 h-5 text-purple-500/70" />
  }
];

export function VisionCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % visionData.length);
    }, 3000);

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

        {/* 整个轮播组件容器 - 增加高度以适应原始字体大小 */}
        <div className="relative h-[280px] flex items-center">
          {/* 导航按钮 - 位于内容区域外部 */}
          <div className="absolute left-0 top-0 bottom-0 flex items-center z-30">
            <button
              onClick={prevSlide}
              className="bg-primary/10 hover:bg-primary/20 rounded-full p-1.5 transition-all shadow-md ml-1"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-primary/80" />
            </button>
          </div>
          
          <div className="absolute right-0 top-0 bottom-0 flex items-center z-30">
            <button
              onClick={nextSlide}
              className="bg-primary/10 hover:bg-primary/20 rounded-full p-1.5 transition-all shadow-md mr-1"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-primary/80" />
            </button>
          </div>

          {/* 轮播内容 - 有明确的左右边距 */}
          <div className="relative w-full h-[230px] overflow-hidden mx-8">
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
          <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-2 z-20">
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
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};