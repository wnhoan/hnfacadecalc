import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NumericInputWithControls({ 
  value, 
  onChange, 
  min = -Infinity, 
  max = Infinity, 
  step = 1, 
  precision = 2,
  className,
  id,
  disabled = false
}: { 
  value: number; 
  onChange: (val: number) => void; 
  min?: number; 
  max?: number; 
  step?: number; 
  precision?: number;
  className?: string;
  id?: string;
  disabled?: boolean;
}) {
  const [localValue, setLocalValue] = useState((value ?? 0).toFixed(precision));

  useEffect(() => {
    setLocalValue((value ?? 0).toFixed(precision));
  }, [value, precision]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = e.target.value;
    setLocalValue(val);
    if (val === '') return;
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onChange(Math.min(max, Math.max(min, num)));
    }
  };

  const increment = () => {
    if (disabled) return;
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const decrement = () => {
    if (disabled) return;
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  return (
    <span className={cn("flex items-center gap-1", className)}>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8 sm:h-7 sm:w-7 shrink-0" 
        onClick={decrement}
        disabled={disabled || value <= min}
      >
        <Minus className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
      </Button>
      <Input 
        id={id}
        type="number" 
        value={localValue} 
        onChange={handleInputChange}
        disabled={disabled}
        className="h-8 sm:h-7 flex-1 text-center bg-white text-xs px-1"
        step="any"
      />
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8 sm:h-7 sm:w-7 shrink-0" 
        onClick={increment}
        disabled={disabled || value >= max}
      >
        <Plus className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
      </Button>
    </span>
  );
}
