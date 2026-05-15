import * as React from 'react';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogClose 
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  MapPin, 
  Info, 
  Activity,
  Box,
  Layers,
  PlusCircle
} from 'lucide-react';
import { REGIONS_DISPLAY } from '@/constants';

const REGION_ICONS: Record<string, React.ReactNode> = {
  'asia-east': <Globe className="w-4 h-4" />,
  'asia-se': <MapPin className="w-4 h-4" />,
  'europe': <Box className="w-4 h-4" />,
  'americas': <PlusCircle className="w-4 h-4" />,
  'mideast-africa': <Layers className="w-4 h-4" />,
  'oceania': <Activity className="w-4 h-4" />,
};

export function KeyMapDialog({ onSelect }: { onSelect: (location: string) => void }) {
  return (
    <DialogContent className="max-w-2xl bg-white border-2 border-slate-200 shadow-2xl rounded-3xl overflow-hidden p-0 max-h-[90vh] flex flex-col">
      <div className="bg-slate-900 p-6 text-white relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 blur-2xl translate-y-1/2 -translate-x-1/2 rounded-full" />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl font-black italic tracking-tighter">
            <div className="bg-blue-600 p-1.5 sm:p-2 rounded-xl shadow-lg shadow-blue-900/40">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            LOCATION KEY MAP
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-medium text-xs">
            Select a project location to automatically configure region-specific design codes and climatic parameters.
          </DialogDescription>
        </DialogHeader>
      </div>
      
      <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {REGIONS_DISPLAY.map((region) => (
            <div key={region.id} className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                <span className="bg-slate-100 p-1.5 rounded-lg text-slate-500">
                  {REGION_ICONS[region.id] || <MapPin className="w-4 h-4" />}
                </span>
                <h4 className="text-[10px] sm:text-[11px] font-black text-slate-900 uppercase tracking-widest">
                  {region.name}
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {region.cities.map((city) => (
                  <Button 
                    key={city}
                    variant="ghost"
                    className="justify-start h-9 sm:h-10 text-[10px] sm:text-[11px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all border border-transparent hover:border-blue-100 px-2 group"
                    onClick={() => onSelect(city)}
                  >
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 text-slate-400 group-hover:text-blue-500" />
                    <span className="truncate">{city}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 sm:mt-8 bg-blue-50/50 p-4 sm:p-5 rounded-3xl border border-blue-100/50 flex items-start gap-3 sm:gap-4">
          <div className="bg-blue-600 p-1.5 sm:p-2 rounded-xl shadow-md shrink-0">
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] sm:text-[11px] font-bold text-blue-900 uppercase tracking-tight">Pro Tip: Smart Configuration</p>
            <p className="text-[10px] sm:text-[11px] text-blue-700/80 leading-relaxed font-medium">
              Picking a city from this map instantly maps your project to international standards and <strong>seismic zones</strong>. This syncs wind pressures, snow loads, and seismic factors automatically.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
          <Activity className="w-3 h-3" />
          Real-time Sync Active
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose render={<Button variant="outline" className="rounded-xl font-bold text-xs h-8 sm:h-9">Close Map</Button>} />
        </DialogFooter>
      </div>
    </DialogContent>
  );
}
