import { useEffect, useState } from 'react';
import Image from "next/image";

interface Partner {
  name: string;
  logo: string;
  url: string;
  width: number;
  height: number;
}

interface PartnersScrollerProps {
  partners: Partner[];
  speed?: number; // 速度因子，值越小越快 (1-10)
}

export function PartnersScroller({ partners, speed = 0.1 }: PartnersScrollerProps) {
  const [duplicatedPartners, setDuplicatedPartners] = useState<Partner[]>([]);

  // Get basePath from environment variable
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // Helper function to construct image paths correctly
  const getImagePath = (imagePath: string) => {
    if (basePath) {
      return `${basePath}${imagePath}`;
    }
    return imagePath;
  };

  // 确保我们有足够的项目进行滚动
  useEffect(() => {
    // 复制足够多的合作伙伴以确保滚动效果流畅
    setDuplicatedPartners([...partners, ...partners, ...partners]);
  }, [partners]);

  // 计算动画持续时间，更合理的计算方式
  // 使用固定的基础时间加上根据合作伙伴数量调整的系数
  const animationDuration = Math.min(15 + partners.length * speed, 40);

  return (
    <div className="w-full py-4">
      <h3 className="text-xl font-bold mb-6">Collaborators</h3>

      <div className="relative overflow-hidden">
        {/* 使用Tailwind的animate-scroll类和更快的动画速度 */}
        <div className="inline-flex items-center py-4 animate-scroll"
             style={{
               animationDuration: `${animationDuration}s`
             }}
        >
          {duplicatedPartners.map((partner, index) => (
            <a
              key={`${partner.url}-${index}`}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:bg-gray-50/50
                     transition-colors p-2 rounded-md border mx-4
                     flex-grow-0 flex-shrink-0"
            >
              <div
                className="relative flex-shrink-0"
                style={{
                  width: partner.width * 0.7,
                  height: partner.height * 0.7
                }}
              >
                <Image
                  src={getImagePath(partner.logo)}
                  alt={`${partner.name} logo`}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              {partner.name && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {partner.name}
                </span>
              )}
            </a>
          ))}
        </div>

        {/* 渐变遮罩 */}
        <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10"></div>
      </div>
    </div>
  );
}