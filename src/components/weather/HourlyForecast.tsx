import { HourlyForecast as HourlyForecastType } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Droplets } from 'lucide-react';

interface HourlyForecastProps {
  hourly: HourlyForecastType[];
}

export const HourlyForecast = ({ hourly }: HourlyForecastProps) => {
  return (
    <div className="glass-card p-4 animate-fade-in animation-delay-100">
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-3 px-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Hourly Forecast</span>
      </div>
      
      <div className="h-px bg-border mb-3" />
      
      <div className="horizontal-scroll">
        {hourly.map((hour, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center gap-2 min-w-[60px] py-2"
          >
            <span className="text-sm font-medium text-foreground/90">
              {hour.time}
            </span>
            
            <div className="relative">
              <WeatherIcon condition={hour.condition} size="md" />
              {hour.precipitation && hour.precipitation > 30 && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 text-[10px] text-blue-300">
                  <Droplets className="w-3 h-3" />
                  <span>{hour.precipitation}%</span>
                </div>
              )}
            </div>
            
            <span className="text-lg font-medium text-foreground">
              {hour.temp}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
