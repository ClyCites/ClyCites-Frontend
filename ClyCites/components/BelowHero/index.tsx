"use client";

import { useState, useEffect } from "react";

type Statistic = {
  id: string;
  value: string | number;
  label: string;
  animationClass: string;
};

const AboutSectionLife2 = () => {
  const [animate, setAnimate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<Statistic[]>([]);

  // Fetch statistics from API
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with your actual API endpoint
        // const response = await fetch('/api/statistics');
        // const data = await response.json();
        
        // For now, we'll use an empty array
        // setStatistics(data);
        setStatistics([]);
      } catch (err) {
        console.error('Failed to load statistics:', err);
        setError('Failed to load statistics. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      setAnimate(window.scrollY >= 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Default statistics (can be used as fallback or removed if not needed)
  const defaultStatistics: Statistic[] = [
    { id: 'cities', value: '8+', label: 'African Cities', animationClass: 'slide-up-faster' },
    { id: 'champions', value: '1500+', label: 'Community Champions', animationClass: 'slide-up-faster' },
    { id: 'records', value: '67+', label: 'Data Records', animationClass: 'slide-up-fast' },
    { id: 'papers', value: '10+', label: 'Research Papers', animationClass: 'slide-up-slow' },
    { id: 'partners', value: '300+', label: 'Partners', animationClass: 'slide-up-slower' },
  ];

  // Use API data if available, otherwise use default (or show loading/error)
  const displayStats = statistics.length > 0 ? statistics : defaultStatistics;

  if (error) {
    return (
      <section className="w-full bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-red-500">
          {error}
        </div>
      </section>
    );
  }

  if (isLoading && statistics.length === 0) {
    return (
      <section className="w-full bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-100 py-4 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
          {displayStats.map((stat, index) => (
            <div 
              key={stat.id}
              className={`transition-transform duration-300 hover:scale-105 cursor-pointer rounded-lg bg-white shadow-sm hover:shadow-md ${
                animate ? `slider-up ${stat.animationClass}` : ""
              }`}
            >
              <div className="relative p-4 md:p-6 flex flex-col justify-center items-center text-center h-full">
                <h3 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  {stat.value}
                </h3>
                <p className="mt-2 text-sm md:text-base text-gray-600">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSectionLife2;
