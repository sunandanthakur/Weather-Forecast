import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeatherData } from '@/types/weather';
import { mockWeatherData } from '@/data/mockWeather';
import { useToast } from '@/hooks/use-toast';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData>(mockWeatherData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWeather = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('get-weather', {
        body: { query }
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to fetch weather');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Map API response to our WeatherData type
      const weatherData: WeatherData = {
        current: {
          location: data.current.location,
          country: data.current.country,
          temp: data.current.temp,
          condition: data.current.condition as WeatherData['current']['condition'],
          conditionText: data.current.conditionText,
          high: data.current.high,
          low: data.current.low,
          timeOfDay: data.current.timeOfDay,
        },
        hourly: data.hourly.map((h: any) => ({
          time: h.time,
          temp: h.temp,
          condition: h.condition,
          precipitation: h.precipitation,
        })),
        daily: data.daily.map((d: any) => ({
          day: d.day,
          date: d.date,
          high: d.high,
          low: d.low,
          condition: d.condition,
          precipitation: d.precipitation,
        })),
        details: {
          uvIndex: data.details.uvIndex,
          uvDescription: data.details.uvDescription,
          sunrise: data.details.sunrise,
          sunset: data.details.sunset,
          wind: {
            speed: data.details.wind.speed,
            direction: data.details.wind.direction,
            gusts: data.details.wind.gusts,
          },
          humidity: data.details.humidity,
          feelsLike: data.details.feelsLike,
          visibility: data.details.visibility,
          pressure: data.details.pressure,
          dewPoint: data.details.dewPoint,
        },
      };

      setWeather(weatherData);
      toast({
        title: `Weather updated`,
        description: `Showing weather for ${weatherData.current.location}, ${weatherData.current.country}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    weather,
    isLoading,
    error,
    fetchWeather,
  };
}
