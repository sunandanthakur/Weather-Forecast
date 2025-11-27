import { DailyForecast as DailyForecastType } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Calendar, Droplets } from 'lucide-react';

interface DailyForecastProps {
  daily: DailyForecastType[];
}

export const DailyForecast = ({ daily }: DailyForecastProps) => {
  // Find the range for the temperature bar
  const temps = daily.flatMap(d => [d.high, d.low]);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = maxTemp - minTemp;

  return (
    <div className="glass-card p-4 animate-fade-in animation-delay-200">
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-3 px-1">
        <Calendar className="w-4 h-4" />
        <span>10-Day Forecast</span>
      </div>
      
      <div className="h-px bg-border mb-2" />
      
      <div className="space-y-0">
        {daily.map((day, index) => {
          const lowPos = ((day.low - minTemp) / range) * 100;
          const highPos = ((day.high - minTemp) / range) * 100;
          
          return (
            <div 
              key={index} 
              className="flex items-center py-2.5 border-b border-border/50 last:border-0"
            >
              <span className="w-12 text-sm font-medium text-foreground">
                {day.day}
              </span>
              
              <div className="w-10 flex justify-center">
                <WeatherIcon condition={day.condition} size="sm" />
              </div>
              
              <div className="w-10 flex justify-center">
                {day.precipitation && day.precipitation > 20 ? (
                  <span className="text-xs text-blue-300 flex items-center gap-0.5">
                    <Droplets className="w-3 h-3" />
                    {day.precipitation}%
                  </span>
                ) : null}
              </div>
              
              <span className="w-8 text-sm text-muted-foreground text-right">
                {day.low}°
              </span>
              
              <div className="flex-1 mx-3 h-1 bg-secondary rounded-full relative overflow-hidden">
                <div 
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${lowPos}%`,
                    right: `${100 - highPos}%`,
                    background: 'linear-gradient(90deg, hsl(210 80% 60%), hsl(35 100% 60%))',
                  }}
                />
              </div>
              
              <span className="w-8 text-sm font-medium text-foreground">
                {day.high}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
