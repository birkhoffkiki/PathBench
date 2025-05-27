"use client";

import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  height?: number;
  rootMargin?: string;
  threshold?: number;
  placeholder?: ReactNode;
}

export function LazyLoad({
  children,
  height = 400,
  rootMargin = '100px',
  threshold = 0.1,
  placeholder
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          // 使用 setTimeout 来延迟加载，避免阻塞滚动
          setTimeout(() => {
            setIsVisible(true);
            setHasLoaded(true);
          }, 50); // 50ms 延迟

          // 立即停止观察以避免重复触发
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold, hasLoaded]);

  const defaultPlaceholder = (
    <div
      className="w-full bg-gray-50 border border-gray-200 rounded-lg animate-pulse"
      style={{ height: `${height}px` }}
    >
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
        <div className="space-y-3 mt-8">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={elementRef}
      style={{ minHeight: hasLoaded ? 'auto' : `${height}px` }}
    >
      {isVisible ? children : (placeholder || defaultPlaceholder)}
    </div>
  );
}
