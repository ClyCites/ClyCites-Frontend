'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const mockCrops = ['Maize', 'Rice', 'Cassava', 'Yam', 'Sorghum', 'Millet'];

const mockTimeRanges = ['Week', 'Month', '3 Months', '6 Months'];

// Mock data for demonstration
const generateMockData = (days: number) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    
    const basePrice = 120;
    const volatility = 0.15; // 15% volatility
    const trend = 0.01; // slight upward trend
    
    // Add some randomness and trend
    const randomFactor = 1 + (Math.random() * 2 - 1) * volatility;
    const trendFactor = 1 + trend * i;
    
    data.push({
      name: formattedDate,
      price: Math.round(basePrice * randomFactor * trendFactor * 100) / 100,
      volume: Math.floor(Math.random() * 1000) + 500,
    });
  }
  
  return data;
};

// Mock regional data
const mockRegionalData = [
  { region: 'Central', price: 125 },
  { region: 'Western', price: 110 },
  { region: 'Eastern', price: 135 },
  { region: 'Northern', price: 145 },
  { region: 'Southern', price: 120 },
];

export function MarketPricesChart() {
  const [selectedCrop, setSelectedCrop] = useState('Maize');
  const [selectedTimeRange, setSelectedTimeRange] = useState('Week');
  const [priceData, setPriceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let days = 7;
      switch (selectedTimeRange) {
        case 'Month':
          days = 30;
          break;
        case '3 Months':
          days = 90;
          break;
        case '6 Months':
          days = 180;
          break;
        default:
          days = 7;
      }
      
      setPriceData(generateMockData(days));
      setIsLoading(false);
    };
    
    fetchData();
  }, [selectedCrop, selectedTimeRange]);

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Market Prices</CardTitle>
        <div className="flex items-center space-x-2">
          <Select
            value={selectedCrop}
            onValueChange={setSelectedCrop}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              {mockCrops.map((crop) => (
                <SelectItem key={crop} value={crop}>
                  {crop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {mockTimeRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="price">Price Trend</TabsTrigger>
            <TabsTrigger value="regional">Regional Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="price" className="mt-4 h-[300px]">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-[300px] w-full animate-pulse rounded-md bg-muted"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={priceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    label={{ 
                      value: 'Price (USD/ton)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    name={`${selectedCrop} Price`}
                    stroke="hsl(var(--chart-1))"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
          
          <TabsContent value="regional" className="mt-4 h-[300px]">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-[300px] w-full animate-pulse rounded-md bg-muted"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockRegionalData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="region"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    label={{ 
                      value: 'Price (USD/ton)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="price" 
                    name={`${selectedCrop} Price by Region`}
                    fill="hsl(var(--chart-2))" 
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
