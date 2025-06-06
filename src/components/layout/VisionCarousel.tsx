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
      <CardContent className="p-4 sm:p-6 w-full">
        {/* 标题部分 */}
        <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-primary text-center">Our Vision</h3>
        <div className="italic font-semibold text-left mb-6 sm:mb-8 text-primary/70 text-sm sm:text-base">
          To create the world's most rigorous, clinically grounded benchmark for pathology foundation models—free from bias, noise, and shortcuts.
        </div>

        {/* 整个轮播组件容器 - 响应式高度 */}
        <div className="relative h-[320px] sm:h-[280px] flex items-center">
          {/* 导航按钮 - 位于内容区域外部 */}
          <div className="absolute left-0 top-0 bottom-0 flex items-center z-30">
            <button
              onClick={prevSlide}
              className="bg-primary/10 hover:bg-primary/20 rounded-full p-1 sm:p-1.5 transition-all shadow-md ml-0.5 sm:ml-1 touch-target"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary/80" />
            </button>
          </div>

          <div className="absolute right-0 top-0 bottom-0 flex items-center z-30">
            <button
              onClick={nextSlide}
              className="bg-primary/10 hover:bg-primary/20 rounded-full p-1 sm:p-1.5 transition-all shadow-md mr-0.5 sm:mr-1 touch-target"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary/80" />
            </button>
          </div>

          {/* 轮播内容 - 响应式边距 */}
          <div className="relative w-full h-[270px] sm:h-[230px] overflow-hidden mx-6 sm:mx-8">
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
                <div className="p-2 sm:p-4 h-full">
                  <h4 className="font-medium text-base sm:text-lg text-foreground mb-3 sm:mb-4 text-left flex items-center gap-2">
                    {slide.icon}
                    <span>{slide.title}</span>
                  </h4>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-4 sm:pl-6 list-disc">
                    {slide.content.map((item, i) => (
                      <li key={i} className="text-muted-foreground leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* 指示器 - 线条样式 */}
          <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-2 z-20">
            {visionData.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsAutoPlaying(false);
                }}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  index === currentSlide
                    ? "bg-primary/80 w-12"
                    : "bg-primary/25 hover:bg-primary/45 w-8"
                )}
                style={{ minHeight: '4px', minWidth: index === currentSlide ? '48px' : '32px' }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};