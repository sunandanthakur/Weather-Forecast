import { TimeOfDay, WeatherCondition } from '@/types/weather';
import { cn } from '@/lib/utils';

interface SkyBackgroundProps {
  timeOfDay: TimeOfDay;
  condition: WeatherCondition;
  children: React.ReactNode;
}

export const SkyBackground = ({ timeOfDay, condition, children }: SkyBackgroundProps) => {
  const getGradientClass = () => {
    if (condition === 'rainy' || condition === 'stormy') {
      return 'sky-gradient-rainy';
    }
    if (condition === 'cloudy' || condition === 'foggy') {
      return 'sky-gradient-cloudy';
    }
    
    switch (timeOfDay) {
      case 'sunset':
        return 'sky-gradient-sunset';
      case 'night':
        return 'sky-gradient-night';
      default:
        return 'sky-gradient-day';
    }
  };

  return (
    <div className={cn(
      'min-h-screen w-full transition-all duration-1000 relative overflow-hidden',
      getGradientClass()
    )}>
      {/* Animated clouds/stars overlay */}
      {timeOfDay === 'night' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse-glow"
              style={{
                top: `${Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.5 + 0.3,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Subtle cloud layers */}
      {(condition === 'partly-cloudy' || condition === 'cloudy') && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float animation-delay-200" style={{ animationDelay: '2s' }} />
        </div>
      )}

      {/* Rain effect */}
      {(condition === 'rainy' || condition === 'stormy') && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-8 bg-gradient-to-b from-transparent to-blue-300"
              style={{
                top: `${Math.random() * -20}%`,
                left: `${Math.random() * 100}%`,
                animation: `fall ${0.5 + Math.random() * 0.5}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {children}
      
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};
