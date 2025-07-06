'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, CalendarCheck, ScaleIcon, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Mock data for the AI advisory
const mockAdvisories = {
  market: [
    { 
      id: 1, 
      title: 'Market Opportunity', 
      content: 'Maize prices expected to rise by 8% in Western markets next week. Consider delaying sales if possible.',
      confidence: 'high',
      date: 'Today'
    },
    { 
      id: 2, 
      title: 'Supply Alert', 
      content: 'Rice supply expected to decrease due to recent floods. Prices likely to increase in Northern region.',
      confidence: 'medium',
      date: 'Yesterday'
    },
    { 
      id: 3, 
      title: 'Demand Forecast', 
      content: 'Growing demand for cassava expected due to new processing facility in Eastern region.',
      confidence: 'high',
      date: '2 days ago'
    },
  ],
  crop: [
    {
      id: 1,
      title: 'Planting Advisory',
      content: 'Optimal planting window for maize in Central region is now open. Plant within 7-10 days for best yields.',
      confidence: 'high',
      date: 'Today'
    },
    {
      id: 2,
      title: 'Pest Alert',
      content: 'Fall armyworm presence detected in nearby regions. Inspect crops regularly and apply treatments if spotted.',
      confidence: 'medium',
      date: 'Yesterday'
    },
    {
      id: 3,
      title: 'Irrigation Recommendation',
      content: 'Increase irrigation for tomatoes by 15% due to forecasted dry spell next week.',
      confidence: 'high',
      date: '3 days ago'
    },
  ],
  storage: [
    {
      id: 1,
      title: 'Storage Conditions',
      content: 'Maintain warehouse humidity below 65% to prevent mold growth in stored grain.',
      confidence: 'high',
      date: 'Today'
    },
    {
      id: 2,
      title: 'Inventory Management',
      content: 'Current rice stocks will depreciate by 5% if stored beyond next month. Consider selling oldest inventory first.',
      confidence: 'medium',
      date: 'Yesterday'
    },
    {
      id: 3,
      title: 'Storage Technology',
      content: 'Consider hermetic bags for bean storage to reduce pest damage and extend shelf life by up to 8 months.',
      confidence: 'high',
      date: '4 days ago'
    },
  ],
  logistics: [
    {
      id: 1,
      title: 'Transport Costs',
      content: 'Fuel prices expected to drop next week. Consider delaying large shipments if possible.',
      confidence: 'medium',
      date: 'Today'
    },
    {
      id: 2,
      title: 'Route Advisory',
      content: 'Northern route to Central Market currently experiencing delays due to road construction. Use alternative eastern route.',
      confidence: 'high',
      date: 'Yesterday'
    },
    {
      id: 3,
      title: 'Bulk Transport',
      content: 'Consolidating shipments with nearby farmers could reduce transport costs by up to 25% for Central Market deliveries.',
      confidence: 'high',
      date: '2 days ago'
    },
  ]
};

export function AdvisoryCard() {
  const [activeTab, setActiveTab] = useState('market');

  const getConfidenceBadge = (confidence: string) => {
    switch(confidence) {
      case 'high':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">High Confidence</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Medium Confidence</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Low Confidence</Badge>;
    }
  };

  const getTabIcon = (tab: string) => {
    switch(tab) {
      case 'market':
        return <ScaleIcon className="h-4 w-4" />;
      case 'crop':
        return <CalendarCheck className="h-4 w-4" />;
      case 'storage':
        return <BrainCircuit className="h-4 w-4" />;
      case 'logistics':
        return <Truck className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Advisory</CardTitle>
            <CardDescription>Personalized recommendations based on your farm data</CardDescription>
          </div>
          <Button size="sm">View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="market" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="market" className="flex items-center justify-center space-x-1">
              <ScaleIcon className="h-4 w-4" />
              <span>Market</span>
            </TabsTrigger>
            <TabsTrigger value="crop" className="flex items-center justify-center space-x-1">
              <CalendarCheck className="h-4 w-4" />
              <span>Crop</span>
            </TabsTrigger>
            <TabsTrigger value="storage" className="flex items-center justify-center space-x-1">
              <BrainCircuit className="h-4 w-4" />
              <span>Storage</span>
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex items-center justify-center space-x-1">
              <Truck className="h-4 w-4" />
              <span>Logistics</span>
            </TabsTrigger>
          </TabsList>
          
          {['market', 'crop', 'storage', 'logistics'].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4 space-y-4">
              {(mockAdvisories as any)[tab].map((advisory: any) => (
                <div key={advisory.id} className="rounded-lg border p-4 transition-all hover:bg-accent hover:text-accent-foreground">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{advisory.title}</h3>
                      {getConfidenceBadge(advisory.confidence)}
                    </div>
                    <p className="text-sm text-muted-foreground">{advisory.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{advisory.date}</span>
                      <Button variant="ghost" size="sm">Details</Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
