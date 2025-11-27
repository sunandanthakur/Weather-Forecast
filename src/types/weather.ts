export type WeatherCondition = 
  | 'clear' 
  | 'partly-cloudy' 
  | 'cloudy' 
  | 'rainy' 
  | 'stormy' 
  | 'snowy' 
  | 'foggy';

export type TimeOfDay = 'day' | 'sunset' | 'night';

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: WeatherCondition;
  precipitation?: number;
}

export interface DailyForecast {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: WeatherCondition;
  precipitation?: number;
}

export interface WeatherDetails {
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
}

export interface CurrentWeather {
  location: string;
  country: string;
  temp: number;
  condition: WeatherCondition;
  conditionText: string;
  high: number;
  low: number;
  timeOfDay: TimeOfDay;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  details: WeatherDetails;
}
