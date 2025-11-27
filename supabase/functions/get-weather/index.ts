import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENWEATHERMAP_API_KEY = Deno.env.get('OPENWEATHERMAP_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherResponse {
  current: {
    location: string;
    country: string;
    temp: number;
    condition: string;
    conditionText: string;
    high: number;
    low: number;
    timeOfDay: 'day' | 'sunset' | 'night';
    icon: string;
  };
  hourly: Array<{
    time: string;
    temp: number;
    condition: string;
    precipitation?: number;
  }>;
  daily: Array<{
    day: string;
    date: string;
    high: number;
    low: number;
    condition: string;
    precipitation?: number;
  }>;
  details: {
    uvIndex: number;
    uvDescription: string;
    sunrise: string;
    sunset: string;
    wind: {
      speed: number;
      direction: string;
      gusts?: number;
    };
    humidity: number;
    feelsLike: number;
    visibility: number;
    pressure: number;
    dewPoint: number;
  };
}

// Map OpenWeatherMap condition codes to our condition types
function mapCondition(weatherId: number): string {
  if (weatherId >= 200 && weatherId < 300) return 'stormy';
  if (weatherId >= 300 && weatherId < 400) return 'rainy';
  if (weatherId >= 500 && weatherId < 600) return 'rainy';
  if (weatherId >= 600 && weatherId < 700) return 'snowy';
  if (weatherId >= 700 && weatherId < 800) return 'foggy';
  if (weatherId === 800) return 'clear';
  if (weatherId > 800) return 'partly-cloudy';
  return 'cloudy';
}

function getWindDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(deg / 22.5) % 16];
}

function getUVDescription(uvi: number): string {
  if (uvi <= 2) return 'Low';
  if (uvi <= 5) return 'Moderate';
  if (uvi <= 7) return 'High';
  if (uvi <= 10) return 'Very High';
  return 'Extreme';
}

function getTimeOfDay(dt: number, sunrise: number, sunset: number): 'day' | 'sunset' | 'night' {
  const sunsetStart = sunset - 3600; // 1 hour before sunset
  const sunsetEnd = sunset + 1800; // 30 min after sunset
  
  if (dt >= sunsetStart && dt <= sunsetEnd) return 'sunset';
  if (dt < sunrise || dt > sunset) return 'night';
  return 'day';
}

function formatTime(timestamp: number, timezoneOffset: number): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const hours = date.getUTCHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}${ampm}`;
}

function formatTimeWithMinutes(timestamp: number, timezoneOffset: number): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

function getDayName(timestamp: number, index: number): string {
  if (index === 0) return 'Today';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query) {
      console.error('No query provided');
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching weather for: ${query}`);

    let lat: number;
    let lon: number;
    let name: string;
    let country: string;

    // Check if query is coordinates (lat,lon format)
    const coordMatch = query.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    
    if (coordMatch) {
      // Use reverse geocoding for coordinates
      lat = parseFloat(coordMatch[1]);
      lon = parseFloat(coordMatch[2]);
      console.log(`Detected coordinates: ${lat}, ${lon}`);
      
      const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`;
      console.log('Reverse geocoding URL:', reverseGeoUrl.replace(OPENWEATHERMAP_API_KEY!, '***'));
      
      const reverseGeoResponse = await fetch(reverseGeoUrl);
      const reverseGeoData = await reverseGeoResponse.json();
      
      if (reverseGeoData && reverseGeoData.length > 0) {
        name = reverseGeoData[0].name || 'Unknown Location';
        country = reverseGeoData[0].country || '';
      } else {
        name = 'Current Location';
        country = '';
      }
    } else {
      // Use direct geocoding for city names
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`;
      console.log('Geocoding URL:', geoUrl.replace(OPENWEATHERMAP_API_KEY!, '***'));
      
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (!geoData || geoData.length === 0) {
        console.error('Location not found:', query);
        return new Response(
          JSON.stringify({ error: 'Location not found. Try a different search term.' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      lat = geoData[0].lat;
      lon = geoData[0].lon;
      name = geoData[0].name;
      country = geoData[0].country;
    }
    
    console.log(`Found location: ${name}, ${country} at ${lat}, ${lon}`);

    // Fetch current weather and forecast using One Call API 3.0
    const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
    console.log('One Call URL:', oneCallUrl.replace(OPENWEATHERMAP_API_KEY!, '***'));
    
    const oneCallResponse = await fetch(oneCallUrl);
    
    if (!oneCallResponse.ok) {
      // Fallback to 2.5 API if 3.0 is not available
      console.log('One Call 3.0 failed, trying 2.5 API');
      
      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
      
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl)
      ]);
      
      if (!currentResponse.ok || !forecastResponse.ok) {
        console.error('Weather API error:', await currentResponse.text());
        return new Response(
          JSON.stringify({ error: 'Failed to fetch weather data' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();
      
      const timezoneOffset = currentData.timezone;
      const now = Math.floor(Date.now() / 1000);
      
      // Process hourly forecast (5-day/3-hour forecast)
      const hourly = forecastData.list.slice(0, 12).map((item: any, index: number) => ({
        time: index === 0 ? 'Now' : formatTime(item.dt, 0),
        temp: Math.round(item.main.temp),
        condition: mapCondition(item.weather[0].id),
        precipitation: item.pop ? Math.round(item.pop * 100) : undefined
      }));
      
      // Process daily forecast (aggregate from 3-hour data)
      const dailyMap = new Map<string, any>();
      forecastData.list.forEach((item: any) => {
        const dateKey = new Date(item.dt * 1000).toDateString();
        if (!dailyMap.has(dateKey)) {
          dailyMap.set(dateKey, {
            temps: [],
            conditions: [],
            pops: [],
            dt: item.dt
          });
        }
        const day = dailyMap.get(dateKey);
        day.temps.push(item.main.temp);
        day.conditions.push(item.weather[0].id);
        day.pops.push(item.pop || 0);
      });
      
      const daily = Array.from(dailyMap.entries()).slice(0, 10).map(([_, data], index) => ({
        day: getDayName(data.dt, index),
        date: formatDate(data.dt),
        high: Math.round(Math.max(...data.temps)),
        low: Math.round(Math.min(...data.temps)),
        condition: mapCondition(data.conditions[Math.floor(data.conditions.length / 2)]),
        precipitation: Math.round(Math.max(...data.pops) * 100) || undefined
      }));
      
      const weather: WeatherResponse = {
        current: {
          location: name,
          country: country,
          temp: Math.round(currentData.main.temp),
          condition: mapCondition(currentData.weather[0].id),
          conditionText: currentData.weather[0].description.charAt(0).toUpperCase() + currentData.weather[0].description.slice(1),
          high: Math.round(currentData.main.temp_max),
          low: Math.round(currentData.main.temp_min),
          timeOfDay: getTimeOfDay(now, currentData.sys.sunrise, currentData.sys.sunset),
          icon: currentData.weather[0].icon
        },
        hourly,
        daily,
        details: {
          uvIndex: 3, // Not available in 2.5 API
          uvDescription: 'Moderate',
          sunrise: formatTimeWithMinutes(currentData.sys.sunrise, timezoneOffset),
          sunset: formatTimeWithMinutes(currentData.sys.sunset, timezoneOffset),
          wind: {
            speed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
            direction: getWindDirection(currentData.wind.deg),
            gusts: currentData.wind.gust ? Math.round(currentData.wind.gust * 3.6) : undefined
          },
          humidity: currentData.main.humidity,
          feelsLike: Math.round(currentData.main.feels_like),
          visibility: Math.round((currentData.visibility || 10000) / 1000),
          pressure: currentData.main.pressure,
          dewPoint: Math.round(currentData.main.temp - ((100 - currentData.main.humidity) / 5))
        }
      };
      
      console.log('Weather data processed successfully (2.5 API)');
      return new Response(JSON.stringify(weather), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const data = await oneCallResponse.json();
    console.log('One Call API response received');
    
    const timezoneOffset = data.timezone_offset;
    const now = data.current.dt;
    
    // Process hourly forecast
    const hourly = data.hourly.slice(0, 12).map((hour: any, index: number) => ({
      time: index === 0 ? 'Now' : formatTime(hour.dt, timezoneOffset),
      temp: Math.round(hour.temp),
      condition: mapCondition(hour.weather[0].id),
      precipitation: hour.pop ? Math.round(hour.pop * 100) : undefined
    }));
    
    // Process daily forecast
    const daily = data.daily.slice(0, 10).map((day: any, index: number) => ({
      day: getDayName(day.dt, index),
      date: formatDate(day.dt),
      high: Math.round(day.temp.max),
      low: Math.round(day.temp.min),
      condition: mapCondition(day.weather[0].id),
      precipitation: day.pop ? Math.round(day.pop * 100) : undefined
    }));
    
    const weather: WeatherResponse = {
      current: {
        location: name,
        country: country,
        temp: Math.round(data.current.temp),
        condition: mapCondition(data.current.weather[0].id),
        conditionText: data.current.weather[0].description.charAt(0).toUpperCase() + data.current.weather[0].description.slice(1),
        high: Math.round(data.daily[0].temp.max),
        low: Math.round(data.daily[0].temp.min),
        timeOfDay: getTimeOfDay(now, data.current.sunrise, data.current.sunset),
        icon: data.current.weather[0].icon
      },
      hourly,
      daily,
      details: {
        uvIndex: Math.round(data.current.uvi),
        uvDescription: getUVDescription(data.current.uvi),
        sunrise: formatTimeWithMinutes(data.current.sunrise, timezoneOffset),
        sunset: formatTimeWithMinutes(data.current.sunset, timezoneOffset),
        wind: {
          speed: Math.round(data.current.wind_speed * 3.6), // Convert m/s to km/h
          direction: getWindDirection(data.current.wind_deg),
          gusts: data.current.wind_gust ? Math.round(data.current.wind_gust * 3.6) : undefined
        },
        humidity: data.current.humidity,
        feelsLike: Math.round(data.current.feels_like),
        visibility: Math.round((data.current.visibility || 10000) / 1000),
        pressure: data.current.pressure,
        dewPoint: Math.round(data.current.dew_point)
      }
    };
    
    console.log('Weather data processed successfully (3.0 API)');
    return new Response(JSON.stringify(weather), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error in get-weather function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
