import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WeatherDetailCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export const WeatherDetailCard = ({
  icon,
  label,
  value,
  subValue,
  description,
  className,
  children,
}: WeatherDetailCardProps) => {
  return (
    <div className={cn('glass-card p-4 flex flex-col', className)}>
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-2">
        {icon}
        <span>{label}</span>
      </div>
      
      {children ? (
        children
      ) : (
        <>
          <div className="text-3xl font-light text-foreground mt-auto">
            {value}
            {subValue && <span className="text-lg ml-1">{subValue}</span>}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </>
      )}
    </div>
  );
};
