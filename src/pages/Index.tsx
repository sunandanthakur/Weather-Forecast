import { useEffect } from 'react';
import { SearchBar } from '@/components/weather/SearchBar';
import { CurrentWeatherDisplay } from '@/components/weather/CurrentWeatherDisplay';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { DailyForecast } from '@/components/weather/DailyForecast';
import { WeatherDetails } from '@/components/weather/WeatherDetails';
import { SkyBackground } from '@/components/weather/SkyBackground';
import { useWeather } from '@/hooks/useWeather';
import { Loader2, Cloud } from 'lucide-react';

const Index = () => {
  const { weather, isLoading, fetchWeather } = useWeather();

  // Fetch weather for user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        () => {
          // If geolocation fails, fetch default city
          fetchWeather('San Francisco');
        }
      );
    } else {
      fetchWeather('San Francisco');
    }
  }, []);

  return (
    <SkyBackground 
      timeOfDay={weather.current.timeOfDay} 
      condition={weather.current.condition}
    >
      <main className="container max-w-md mx-auto px-4 py-6 pb-12 space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Cloud className="w-8 h-8 text-foreground/80" />
          <h1 className="text-xl font-semibold text-foreground">Sunandan Singh Weather</h1>
          <Cloud className="w-8 h-8 text-foreground/80" />
        </div>
        <SearchBar onSearch={fetchWeather} isLoading={isLoading} />
        
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-foreground/60 animate-spin" />
          </div>
        )}
        
        <div className={isLoading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
          <CurrentWeatherDisplay weather={weather.current} />
          
          <div className="space-y-4 mt-4">
            <HourlyForecast hourly={weather.hourly} />
            
            <DailyForecast daily={weather.daily} />
            
            <WeatherDetails details={weather.details} />
          </div>
        </div>
        
        <footer className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            Powered by OpenWeatherMap
          </p>
        </footer>
      </main>
    </SkyBackground>
  );
};

export default Index;
