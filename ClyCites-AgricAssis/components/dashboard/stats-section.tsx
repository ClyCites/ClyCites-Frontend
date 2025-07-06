import { ArrowDownIcon, ArrowUpIcon, Cloud, Leaf, ShoppingCart, TrendingUp } from 'lucide-react';
import { StatusCard } from './status-card';

export function StatsSection() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatusCard 
        title="Average Maize Price" 
        value="$120.50/ton"
        trend="up"
        trendValue="8.2%"
        description="vs. last month"
        icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
      />
      
      <StatusCard 
        title="Planting Conditions" 
        value="Favorable"
        description="Next 7 days optimal"
        icon={<Leaf className="h-4 w-4 text-green-500" />}
      />
      
      <StatusCard 
        title="Market Demand" 
        value="High"
        trend="up"
        trendValue="12%"
        description="Growing for staple crops"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
      
      <StatusCard 
        title="Rainfall Forecast" 
        value="65mm"
        trend="down"
        trendValue="5%"
        description="vs. seasonal average"
        icon={<Cloud className="h-4 w-4 text-blue-500" />}
      />
    </div>
  );
}
