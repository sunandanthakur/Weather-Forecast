import { CurrentWeather } from '@/types/weather';
import { MapPin } from 'lucide-react';

interface CurrentWeatherDisplayProps {
  weather: CurrentWeather;
}

export const CurrentWeatherDisplay = ({ weather }: CurrentWeatherDisplayProps) => {
  return (
    <div className="flex flex-col items-center text-center py-8 animate-fade-in">
      <div className="flex items-center gap-1 text-foreground/80 mb-1">
        <MapPin className="w-4 h-4" />
        <h1 className="text-xl font-medium text-shadow">{weather.location}</h1>
      </div>
      
      <div className="temp-display text-foreground">
        {weather.temp}°
      </div>
      
      <p className="text-lg text-foreground/90 font-medium text-shadow mt-1">
        {weather.conditionText}
      </p>
      
      <p className="text-foreground/70 text-shadow">
        H:{weather.high}° L:{weather.low}°
      </p>
    </div>
  );
};
