'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, CloudRain, Droplets, Sun, Thermometer } from 'lucide-react';

interface WeatherData {
  date: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
}

// Mock data for demonstration
const mockWeatherData: WeatherData[] = [
  { 
    date: 'Today', 
    temperature: 28, 
    humidity: 65, 
    precipitation: 0, 
    condition: 'sunny' 
  },
  { 
    date: 'Tomorrow', 
    temperature: 26, 
    humidity: 70, 
    precipitation: 30, 
    condition: 'cloudy' 
  },
  { 
    date: 'Wed', 
    temperature: 24, 
    humidity: 80, 
    precipitation: 70, 
    condition: 'rainy' 
  },
  { 
    date: 'Thu', 
    temperature: 25, 
    humidity: 75, 
    precipitation: 20, 
    condition: 'cloudy' 
  },
  { 
    date: 'Fri', 
    temperature: 27, 
    humidity: 60, 
    precipitation: 10, 
    condition: 'sunny' 
  },
  { 
    date: 'Sat', 
    temperature: 29, 
    humidity: 55, 
    precipitation: 0, 
    condition: 'sunny' 
  },
  { 
    date: 'Sun', 
    temperature: 27, 
    humidity: 65, 
    precipitation: 40, 
    condition: 'rainy' 
  },
];

export function WeatherCard() {
  const [data, setData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setData(mockWeatherData);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getCropImpact = (data: WeatherData) => {
    // This is a simplified example of crop impact assessment
    if (data.temperature > 30 && data.humidity < 60) {
      return { impact: "High Risk", description: "Hot and dry conditions may stress crops" };
    } else if (data.precipitation > 50) {
      return { impact: "Medium Risk", description: "Heavy rain may affect soil conditions" };
    } else if (data.temperature > 25 && data.humidity > 70) {
      return { impact: "Favorable", description: "Good growing conditions for most crops" };
    } else {
      return { impact: "Neutral", description: "Standard conditions, regular monitoring advised" };
    }
  };

  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className="h-[20px] w-[200px] animate-pulse rounded-md bg-muted"></div>
            <div className="h-[100px] w-full animate-pulse rounded-md bg-muted"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Weather Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="forecast">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
            <TabsTrigger value="impact">Crop Impact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forecast" className="mt-4">
            <div className="flex flex-wrap gap-2 md:gap-4">
              {data.map((day, i) => (
                <div 
                  key={i}
                  className="flex flex-1 flex-col items-center rounded-lg border p-2 text-center min-w-[80px]"
                >
                  <div className="mb-1 font-medium">{day.date}</div>
                  {getWeatherIcon(day.condition)}
                  <div className="mt-1 flex items-center">
                    <Thermometer className="mr-1 h-3 w-3" />
                    <span>{day.temperature}°C</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Droplets className="mr-1 h-3 w-3" />
                      {day.humidity}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="impact" className="mt-4">
            <div className="space-y-4">
              {data.slice(0, 3).map((day, i) => {
                const impact = getCropImpact(day);
                return (
                  <div 
                    key={i}
                    className="rounded-lg border p-3"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{day.date}</div>
                      {getWeatherIcon(day.condition)}
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Temperature</span>
                        <span className="text-sm font-medium">{day.temperature}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Humidity</span>
                        <span className="text-sm font-medium">{day.humidity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Precipitation</span>
                        <span className="text-sm font-medium">{day.precipitation}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t">
                      <div className="font-medium">{impact.impact}</div>
                      <div className="text-sm text-muted-foreground">{impact.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
