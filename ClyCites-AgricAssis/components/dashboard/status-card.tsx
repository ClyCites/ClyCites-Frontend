import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function StatusCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
}: StatusCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center">
            {trend && (
              <span className={cn(
                "mr-1",
                trend === 'up' && "text-green-500",
                trend === 'down' && "text-red-500",
                trend === 'neutral' && "text-gray-500"
              )}>
                {trend === 'up' && '↑'}
                {trend === 'down' && '↓'}
                {trend === 'neutral' && '→'}
                {trendValue}
              </span>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
