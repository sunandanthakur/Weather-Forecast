import { WeatherCondition } from '@/types/weather';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudSun, Moon, CloudMoon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isNight?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-20 h-20',
};

export const WeatherIcon = ({ condition, size = 'md', isNight = false, className }: WeatherIconProps) => {
  const sizeClass = sizeMap[size];
  const baseClass = cn(sizeClass, 'text-foreground', className);

  const getIcon = () => {
    switch (condition) {
      case 'clear':
        return isNight ? (
          <Moon className={cn(baseClass, 'text-yellow-100')} />
        ) : (
          <Sun className={cn(baseClass, 'text-yellow-300 weather-icon-glow')} />
        );
      case 'partly-cloudy':
        return isNight ? (
          <CloudMoon className={cn(baseClass, 'text-slate-200')} />
        ) : (
          <CloudSun className={cn(baseClass, 'text-yellow-200')} />
        );
      case 'cloudy':
        return <Cloud className={cn(baseClass, 'text-slate-300')} />;
      case 'rainy':
        return <CloudRain className={cn(baseClass, 'text-blue-300')} />;
      case 'stormy':
        return <CloudLightning className={cn(baseClass, 'text-yellow-400')} />;
      case 'snowy':
        return <CloudSnow className={cn(baseClass, 'text-blue-100')} />;
      case 'foggy':
        return <CloudFog className={cn(baseClass, 'text-slate-400')} />;
      default:
        return <Sun className={cn(baseClass, 'text-yellow-300')} />;
    }
  };

  return getIcon();
};
