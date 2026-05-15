import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SummaryCard({ label, value, subValue, icon: Icon, status, onClick, active, progress, tooltip }: { 
  label: string; 
  value: string | number; 
  subValue?: string; 
  icon: any; 
  status?: 'pass' | 'fail' | 'warn';
  onClick?: () => void;
  active?: boolean;
  progress?: number;
  tooltip?: string;
}) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "p-4 flex items-center justify-between shadow-xs cursor-pointer transition-all duration-300 relative group overflow-hidden border-2",
        active ? "border-sky-500 bg-sky-50/30 ring-1 ring-sky-500 shadow-sky-100" : "hover:border-slate-300 hover:shadow-md bg-white border-transparent"
      )}
    >
      <div className="flex items-center gap-3 relative z-10">
        <div className={cn(
          "p-2.5 rounded-xl transition-colors duration-300",
          active ? "bg-sky-600 text-white shadow-lg shadow-sky-200" : "bg-slate-100 text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-600"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</h4>
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger render={<Info className="w-3 h-3 text-slate-300" />} />
                  <TooltipContent>
                    <p className="max-w-xs">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <p className={cn("text-lg font-black tracking-tight", active ? "text-slate-900" : "text-slate-700")}>{value}</p>
            {subValue && <span className="text-[10px] font-bold text-slate-400 uppercase italic">{subValue}</span>}
          </div>
        </div>
      </div>
      
      {status && (
        <div className={cn(
          "w-3 h-3 rounded-full relative z-10 border-2 border-white shadow-sm ring-2",
          status === 'pass' ? "bg-emerald-500 ring-emerald-100" : 
          status === 'warn' ? "bg-amber-500 ring-amber-100" : "bg-rose-500 ring-rose-100"
        )} />
      )}

      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full overflow-hidden">
          <div 
             className={cn("h-full transition-all duration-700", progress > 100 ? "bg-rose-500" : "bg-sky-500")}
             style={{ width: `${Math.min(100, progress)}%` }} 
          />
        </div>
      )}
    </Card>
  );
}
