import { WeatherData } from '@/types/weather';

export const mockWeatherData: WeatherData = {
  current: {
    location: 'San Francisco',
    country: 'United States',
    temp: 18,
    condition: 'partly-cloudy',
    conditionText: 'Partly Cloudy',
    high: 21,
    low: 14,
    timeOfDay: 'day',
  },
  hourly: [
    { time: 'Now', temp: 18, condition: 'partly-cloudy' },
    { time: '1PM', temp: 19, condition: 'partly-cloudy' },
    { time: '2PM', temp: 20, condition: 'clear' },
    { time: '3PM', temp: 21, condition: 'clear' },
    { time: '4PM', temp: 20, condition: 'clear' },
    { time: '5PM', temp: 19, condition: 'partly-cloudy' },
    { time: '6PM', temp: 18, condition: 'partly-cloudy' },
    { time: '7PM', temp: 17, condition: 'cloudy' },
    { time: '8PM', temp: 16, condition: 'cloudy' },
    { time: '9PM', temp: 15, condition: 'cloudy' },
    { time: '10PM', temp: 15, condition: 'cloudy' },
    { time: '11PM', temp: 14, condition: 'cloudy' },
  ],
  daily: [
    { day: 'Today', date: 'Nov 27', high: 21, low: 14, condition: 'partly-cloudy', precipitation: 10 },
    { day: 'Thu', date: 'Nov 28', high: 22, low: 15, condition: 'clear' },
    { day: 'Fri', date: 'Nov 29', high: 20, low: 13, condition: 'cloudy', precipitation: 30 },
    { day: 'Sat', date: 'Nov 30', high: 18, low: 12, condition: 'rainy', precipitation: 80 },
    { day: 'Sun', date: 'Dec 1', high: 17, low: 11, condition: 'rainy', precipitation: 60 },
    { day: 'Mon', date: 'Dec 2', high: 19, low: 12, condition: 'partly-cloudy', precipitation: 20 },
    { day: 'Tue', date: 'Dec 3', high: 21, low: 14, condition: 'clear' },
    { day: 'Wed', date: 'Dec 4', high: 22, low: 15, condition: 'clear' },
    { day: 'Thu', date: 'Dec 5', high: 21, low: 14, condition: 'partly-cloudy' },
    { day: 'Fri', date: 'Dec 6', high: 20, low: 13, condition: 'cloudy', precipitation: 25 },
  ],
  details: {
    uvIndex: 3,
    uvDescription: 'Moderate',
    sunrise: '6:52 AM',
    sunset: '4:51 PM',
    wind: {
      speed: 12,
      direction: 'W',
      gusts: 18,
    },
    humidity: 68,
    feelsLike: 17,
    visibility: 16,
    pressure: 1018,
    dewPoint: 12,
  },
};

export const getWeatherForCity = (city: string): WeatherData => {
  // Simulated different weather for different cities
  const cityWeatherVariations: Record<string, Partial<WeatherData['current']>> = {
    'new york': { temp: 8, condition: 'cloudy', conditionText: 'Cloudy', high: 11, low: 5, timeOfDay: 'day' },
    'london': { temp: 6, condition: 'rainy', conditionText: 'Light Rain', high: 8, low: 4, timeOfDay: 'day' },
    'tokyo': { temp: 14, condition: 'clear', conditionText: 'Sunny', high: 17, low: 10, timeOfDay: 'night' },
    'sydney': { temp: 26, condition: 'clear', conditionText: 'Sunny', high: 29, low: 21, timeOfDay: 'day' },
    'mumbai': { temp: 32, condition: 'partly-cloudy', conditionText: 'Partly Cloudy', high: 34, low: 26, timeOfDay: 'day' },
    'delhi': { temp: 22, condition: 'foggy', conditionText: 'Hazy', high: 25, low: 12, timeOfDay: 'day' },
    'paris': { temp: 9, condition: 'cloudy', conditionText: 'Overcast', high: 11, low: 6, timeOfDay: 'day' },
    'dubai': { temp: 28, condition: 'clear', conditionText: 'Sunny', high: 31, low: 22, timeOfDay: 'sunset' },
  };

  const normalizedCity = city.toLowerCase();
  const variation = cityWeatherVariations[normalizedCity];

  if (variation) {
    return {
      ...mockWeatherData,
      current: {
        ...mockWeatherData.current,
        location: city.charAt(0).toUpperCase() + city.slice(1),
        ...variation,
      },
    };
  }

  return {
    ...mockWeatherData,
    current: {
      ...mockWeatherData.current,
      location: city,
    },
  };
};
