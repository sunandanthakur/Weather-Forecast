import { WeatherDetails as WeatherDetailsType } from '@/types/weather';
import { WeatherDetailCard } from './WeatherDetailCard';
import { Sun, Wind, Droplets, Eye, Gauge, Thermometer, Sunrise, Sunset } from 'lucide-react';

interface WeatherDetailsProps {
  details: WeatherDetailsType;
}

export const WeatherDetails = ({ details }: WeatherDetailsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 animate-fade-in animation-delay-300">
      {/* UV Index */}
      <WeatherDetailCard
        icon={<Sun className="w-4 h-4" />}
        label="UV Index"
        value={details.uvIndex}
        description={details.uvDescription}
      >
        <div className="mt-auto">
          <div className="text-3xl font-light text-foreground">{details.uvIndex}</div>
          <div className="text-sm text-foreground/80 font-medium">{details.uvDescription}</div>
          <div className="mt-3 h-1.5 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 relative">
            <div 
              className="absolute w-3 h-3 bg-foreground rounded-full -top-[3px] shadow-lg"
              style={{ left: `${Math.min(details.uvIndex / 11 * 100, 100)}%`, transform: 'translateX(-50%)' }}
            />
          </div>
        </div>
      </WeatherDetailCard>

      {/* Sunrise/Sunset */}
      <WeatherDetailCard
        icon={<Sunrise className="w-4 h-4" />}
        label="Sunrise"
        value={details.sunrise}
      >
        <div className="mt-auto">
          <div className="text-3xl font-light text-foreground">{details.sunrise}</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <Sunset className="w-3 h-3" />
            <span>Sunset: {details.sunset}</span>
          </div>
        </div>
      </WeatherDetailCard>

      {/* Wind */}
      <WeatherDetailCard
        icon={<Wind className="w-4 h-4" />}
        label="Wind"
        value={details.wind.speed}
        subValue="km/h"
      >
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light text-foreground">{details.wind.speed}</span>
            <span className="text-lg text-foreground/80">km/h</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>{details.wind.direction}</span>
            {details.wind.gusts && (
              <span>· Gusts: {details.wind.gusts} km/h</span>
            )}
          </div>
        </div>
      </WeatherDetailCard>

      {/* Humidity */}
      <WeatherDetailCard
        icon={<Droplets className="w-4 h-4" />}
        label="Humidity"
        value={`${details.humidity}%`}
      >
        <div className="mt-auto">
          <div className="text-3xl font-light text-foreground">{details.humidity}%</div>
          <div className="text-sm text-muted-foreground mt-1">
            Dew point: {details.dewPoint}°
          </div>
        </div>
      </WeatherDetailCard>

      {/* Feels Like */}
      <WeatherDetailCard
        icon={<Thermometer className="w-4 h-4" />}
        label="Feels Like"
        value={`${details.feelsLike}°`}
        description="Similar to the actual temperature."
      />

      {/* Visibility */}
      <WeatherDetailCard
        icon={<Eye className="w-4 h-4" />}
        label="Visibility"
        value={details.visibility}
        subValue="km"
        description="Perfectly clear view."
      />

      {/* Pressure */}
      <WeatherDetailCard
        icon={<Gauge className="w-4 h-4" />}
        label="Pressure"
        value={details.pressure}
        subValue="hPa"
        className="col-span-2"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-light text-foreground">{details.pressure}</span>
          <span className="text-lg text-foreground/80">hPa</span>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-secondary relative overflow-hidden">
          <div 
            className="absolute h-full bg-foreground/40 rounded-full"
            style={{ width: `${((details.pressure - 980) / 60) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </WeatherDetailCard>
    </div>
  );
};
