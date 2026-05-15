import * as React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Activity, 
  AlertTriangle, 
  Minimize2, 
  Maximize2, 
  Box, 
  Info, 
  ShieldCheck, 
  Paperclip, 
  Trash2, 
  Image as ImageIcon 
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  SealantResultsView, 
  BracketResultsView, 
  CastInResultsView, 
  PanelResultsView, 
  BeamAnalysisChart, 
  UtilizationCards 
} from './ResultViews';
import { BeamVisualizer3D } from './BeamVisualizer3D';
import { Project, Combination } from '@/lib/structural-logic';
import { MATERIALS, CODES_OF_PRACTICE } from '@/constants';

export const PRESET_PROFILES = [
  {
    id: 'mullion-50-150',
    name: 'Mullion M150 (50x150)',
    extruder: 'Standard Extrusions Ltd',
    url: 'https://picsum.photos/seed/mullion1/400/300',
    dimensions: { width: 50, height: 150, thickness: 3, thickness2: 3 }
  },
  {
    id: 'transom-50-80',
    name: 'Transom T80 (50x80)',
    extruder: 'Standard Extrusions Ltd',
    url: 'https://picsum.photos/seed/transom1/400/300',
    dimensions: { width: 50, height: 80, thickness: 2.5, thickness2: 2.5 }
  },
  {
    id: 'heavy-mullion-60-200',
    name: 'Heavy Mullion H200 (60x200)',
    extruder: 'Industrial Profiles Corp',
    url: 'https://picsum.photos/seed/heavy1/400/300',
    dimensions: { width: 60, height: 200, thickness: 4, thickness2: 4 }
  },
  {
    id: 'slim-mullion-40-120',
    name: 'Slim Mullion S120 (40x120)',
    extruder: 'Architectural Systems',
    url: 'https://picsum.photos/seed/slim1/400/300',
    dimensions: { width: 40, height: 120, thickness: 2.5, thickness2: 2.5 }
  },
  {
    id: 'channel-40-100',
    name: 'C-Channel C100 (40x100)',
    extruder: 'Structural Steel Co',
    url: 'https://picsum.photos/seed/channel1/400/300',
    dimensions: { width: 40, height: 100, thickness: 5, thickness2: 5 },
    sectionType: 'channel'
  },
  {
    id: 'l-plate-50-50',
    name: 'L-Plate L50 (50x50)',
    extruder: 'Structural Steel Co',
    url: 'https://picsum.photos/seed/lplate1/400/300',
    dimensions: { width: 50, height: 50, thickness: 5, thickness2: 5 },
    sectionType: 'l-plate'
  }
];

export const ReferenceAttachmentCard = ({ 
  attachment, 
  onAttachmentChange,
  setNotification,
  onApplyPreset
}: { 
  attachment: string; 
  onAttachmentChange: (v: string) => void;
  setNotification: (v: { message: string; type: 'success' | 'error' } | null) => void;
  onApplyPreset?: (preset: typeof PRESET_PROFILES[0]) => void;
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setNotification({ message: 'Only image files are supported', type: 'error' });
      return;
    }
    if (file.size > 400 * 1024) {
      setNotification({ message: 'Image size exceeds 400KB limit', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onAttachmentChange(e.target?.result as string);
      setNotification({ message: 'Reference image attached', type: 'success' });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) processFile(file);
        break;
      }
    }
  };

  return (
    <Card className="shadow-sm border-slate-200 overflow-hidden" onPaste={handlePaste}>
      <CardHeader className="p-3 sm:pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Reference</span>
          </div>
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1">
                  <Box className="w-3 h-3" />
                  Presets
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Standard Profiles</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {PRESET_PROFILES.map((preset) => (
                    <DropdownMenuItem 
                      key={preset.id} 
                      onClick={() => onApplyPreset?.(preset as any)}
                      className="flex flex-col items-start gap-0.5"
                    >
                      <span className="font-bold text-xs">{preset.name}</span>
                      <span className="text-[10px] text-slate-400">{preset.extruder}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {attachment && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 hover:text-red-500"
                onClick={() => onAttachmentChange('')}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        <CardTitle className="text-xs sm:text-sm">Calculation Reference</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
        {attachment ? (
          <div className="relative group rounded-lg overflow-hidden border bg-slate-50 aspect-video flex items-center justify-center">
            <img 
              src={attachment} 
              alt="Reference" 
              className="max-w-full max-h-full object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <Button 
                 variant="secondary" 
                 size="sm" 
                 className="h-8 text-xs gap-2"
                 onClick={() => fileInputRef.current?.click()}
               >
                 <ImageIcon className="w-3 h-3" />
                 Replace
               </Button>
            </div>
          </div>
        ) : (
          <div 
            className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-200 transition-all cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-600">Click to upload or Paste image</p>
              <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 400KB</p>
            </div>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </CardContent>
    </Card>
  );
};

export const ProjectResultsView = ({ 
  project, 
  results, 
  panelResults,
  sealantResults,
  bracketResults,
  castInResults,
  calculationMode,
  unitSystem, 
  t, 
  u, 
  toDisplay, 
  activeTab, 
  setActiveTab,
  isChartExpanded,
  setIsChartExpanded,
  criticalPoints,
  setMobileTab
}: { 
  project: Project; 
  results: any; 
  panelResults: any;
  sealantResults: any;
  bracketResults: any;
  castInResults: any;
  calculationMode: string;
  unitSystem: string; 
  t: any; 
  u: any; 
  toDisplay: any;
  activeTab: string;
  setActiveTab: (v: string) => void;
  isChartExpanded: boolean;
  setIsChartExpanded: (v: boolean) => void;
  criticalPoints: any;
  setMobileTab: (v: 'inputs' | 'results') => void;
}) => {
  if (calculationMode === 'panel' && panelResults) {
    return <PanelResultsView results={panelResults} unitSystem={unitSystem} t={t} u={u} toDisplay={toDisplay} />;
  }

  if (calculationMode === 'sealant' && sealantResults) {
    return <SealantResultsView results={sealantResults} unitSystem={unitSystem} t={t} u={u} toDisplay={toDisplay} />;
  }

  if (calculationMode === 'bracket' && bracketResults) {
    return <BracketResultsView results={bracketResults} unitSystem={unitSystem} t={t} u={u} toDisplay={toDisplay} />;
  }

  if (calculationMode === 'cast-in-embed' && castInResults) {
    return <CastInResultsView results={castInResults} unitSystem={unitSystem} t={t} u={u} toDisplay={toDisplay} />;
  }

  const activeCombination = (project.combinations.find(c => c.id === project.activeCombinationId) || project.combinations[0]) as Combination;

  const { 
    projectTitle, 
    selectedCodeId, 
    material, 
    supportCondition, 
    length,
    width,
    height,
    thickness,
    thickness2,
    sectionType,
    intermediateSupports
  } = project;

  const governingCriteria = results.summary.utilizationStress >= results.summary.utilizationDeflection ? 'Stress' : 'Deflection';
  const maxUtilization = Math.max(0, results.summary.utilizationStress || 0, results.summary.utilizationDeflection || 0);

  return (
    <div className="space-y-6">
      {/* Top Hero Status & KPI Row */}
      <div className={cn(
        "p-4 sm:p-5 rounded-[1.25rem] sm:rounded-[1.5rem] border shadow-sm flex flex-col sm:flex-row items-center justify-between transition-all gap-4 sm:gap-6 bg-card overflow-hidden relative",
        results.summary.status === 'pass' 
          ? "border-emerald-500/20" 
          : "border-red-500/20"
      )}>
        <div className={cn(
          "absolute top-0 left-0 w-full h-1 sm:w-1.5 sm:h-full",
          results.summary.status === 'pass' ? "bg-emerald-500" : "bg-red-500"
        )} />
        
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md relative overflow-hidden shrink-0",
            results.summary.status === 'pass' ? "bg-emerald-600 shadow-emerald-100" : "bg-red-600 shadow-red-100"
          )}>
            <Activity className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedCodeId} Design Result</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight uppercase tracking-tighter truncate">
              {project.projectTitle}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={cn(
                  "text-[8px] font-black uppercase tracking-widest px-1.5 py-0",
                  results.summary.status === 'pass' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none" : "bg-red-100 text-red-700 hover:bg-red-100 border-none"
              )}>
                {results.summary.status === 'pass' ? "PASS" : "FAIL"}
              </Badge>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium whitespace-nowrap">Control: <span className="font-bold text-slate-700">{governingCriteria}</span></p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end px-1 sm:px-0">
           <div className="text-center sm:text-right">
              <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Utilization</p>
              <p className={cn("text-xl sm:text-2xl font-black tabular-nums tracking-tighter", maxUtilization > 1 ? "text-red-600" : "text-slate-900")}>
                {(maxUtilization * 100).toFixed(1)}<span className="text-sm sm:text-base ml-0.5 opacity-50">%</span>
              </p>
           </div>
           <div className="h-8 w-[1px] bg-slate-100" />
           <div className="text-right">
              <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">FS</p>
              <p className={cn("text-xl sm:text-2xl font-black tabular-nums tracking-tighter", maxUtilization > 1 ? "text-slate-300" : "text-emerald-600")}>
                {maxUtilization > 1 ? "0.00" : (1 / (maxUtilization || 0.01)).toFixed(2)}
              </p>
           </div>
        </div>
      </div>

      {/* Structural Failure Banner */}
      {results.summary.status === 'fail' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 bg-red-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-red-200 border-2 border-red-500 overflow-hidden"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest">Structural Capacity Exceeded</h3>
              <p className="text-[10px] text-red-100 font-medium">Design parameters fail validation against {CODES_OF_PRACTICE.find(c => c.country === project.selectedCodeId)?.country || 'Building Code'}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black tabular-nums">{(maxUtilization * 100).toFixed(1)}%</span>
            <div className="text-[9px] uppercase font-bold opacity-70">Extreme Overload</div>
          </div>
        </motion.div>
      )}

      {/* Detailed Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
        <div className="lg:col-span-9 flex flex-col gap-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-4">
               <TabsList className="bg-slate-100 p-1 rounded-xl h-10 border border-slate-200 shadow-sm">
                 <TabsTrigger value="diagrams" className="text-[10px] font-black uppercase tracking-tight rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Structural Diagrams</TabsTrigger>
                 <TabsTrigger value="utilization" className="text-[10px] font-black uppercase tracking-tight rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Detailed Analysis</TabsTrigger>
               </TabsList>
               <Button variant="outline" size="sm" className="h-10 px-3 rounded-xl border-slate-200 text-slate-500 hover:text-blue-600" onClick={() => setIsChartExpanded(!isChartExpanded)}>
                  {isChartExpanded ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize2 className="h-4 w-4 mr-2" />}
                  <span className="text-[10px] font-black uppercase tracking-widest">{isChartExpanded ? 'Shrink' : 'Expand'}</span>
               </Button>
            </div>

            <TabsContent value="diagrams" className="mt-0 ring-offset-background focus-visible:outline-none">
              <Card className="border-slate-200 shadow-lg overflow-hidden rounded-[2rem] bg-white">
                <div className="bg-slate-50/50 px-6 py-4 border-b flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-blue-600">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block leading-none mb-1">Interactive Results</span>
                        <span className="text-sm font-bold text-slate-800">Shear, Moment & Deflection</span>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-blue-50/50 border border-blue-100">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <span className="text-[9px] font-black text-blue-700 uppercase">V</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-50/50 border border-emerald-100">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[9px] font-black text-emerald-700 uppercase">M</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-rose-50/50 border border-rose-100">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                        <span className="text-[9px] font-black text-rose-700 uppercase">δ</span>
                      </div>
                   </div>
                </div>
                <CardContent className="p-0">
                  <div className={cn("bg-white transition-all duration-500", isChartExpanded ? "h-[700px]" : "h-[400px]")}>
                    <BeamAnalysisChart 
                      results={results} 
                      unitSystem={unitSystem} 
                      u={u} 
                      toDisplay={toDisplay}
                      criticalPoints={criticalPoints}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="utilization" className="mt-0 ring-offset-background focus-visible:outline-none">
               <UtilizationCards 
                  results={results} 
                  material={material} 
                  governingCriteria={governingCriteria} 
               />
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <Card className="p-4 sm:p-5 border-slate-200 shadow-sm rounded-2xl bg-card group hover:border-blue-200 transition-all">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Max Deflection</span>
                </div>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-2xl sm:text-3xl font-black tabular-nums">{toDisplay(results.summary.maxDeflection ?? 0, 'length').toFixed(2)}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase">{u.length}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline" className={cn(
                    "text-[8px] sm:text-[9px] font-bold h-4 sm:h-5",
                    (results.summary.utilizationDeflection ?? 0) > 1 ? "border-red-200 bg-red-50 text-red-700" : "border-blue-100 bg-blue-50 text-blue-700"
                  )}>
                    Ratio: {results.summary.deflectionRatio}
                  </Badge>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">{(results.summary.utilizationDeflection * 100).toFixed(0)}% Util</span>
                </div>
            </Card>

            <Card className="p-4 sm:p-5 border-slate-200 shadow-sm rounded-2xl bg-card group hover:border-amber-200 transition-all">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-amber-50 rounded-lg text-amber-600">
                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Yield Check</span>
                </div>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-2xl sm:text-3xl font-black tabular-nums">{toDisplay(results.summary.maxStress ?? 0, 'stress').toFixed(1)}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase">{u.stress}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline" className={cn(
                    "text-[8px] sm:text-[9px] font-bold h-4 sm:h-5",
                    (results.summary.utilizationStress ?? 0) > 1 ? "border-red-200 bg-red-50 text-red-700" : "border-amber-100 bg-amber-50 text-amber-700"
                  )}>
                    Allow: {toDisplay(results.summary.allowableStress, 'stress').toFixed(0)} {u.stress}
                  </Badge>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">{(results.summary.utilizationStress * 100).toFixed(0)}% Util</span>
                </div>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          <Card className="border-slate-200 shadow-lg overflow-hidden rounded-[2rem] group transition-all hover:shadow-xl bg-card h-fit">
            <div className="bg-slate-50/50 px-6 py-4 border-b flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg border border-slate-200 shadow-sm text-blue-600">
                     <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block leading-none mb-1">Interactive</span>
                    <span className="text-sm font-bold text-slate-800">3D Visualizer</span>
                  </div>
               </div>
            </div>
            <div className="aspect-square relative bg-slate-900 overflow-hidden">
               <BeamVisualizer3D 
                 length={length} 
                 width={width} 
                 height={height} 
                 thickness={thickness}
                 thickness2={thickness2}
                 sectionType={sectionType}
                 supportCondition={supportCondition as any}
                 intermediateSupports={intermediateSupports}
                 unitSystem={unitSystem as any}
               />
            </div>
            <CardContent className="p-6 bg-card border-t border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Efficiency Index</p>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-600 uppercase">Mass Intensity</span>
                        <span className="text-slate-900 uppercase">{(results.summary.weight / length).toFixed(2)} kg/m</span>
                     </div>
                     <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (results.summary.weight / length) / 10 * 100)}%` }} />
                     </div>
                  </div>
               </div>
               <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                     <ShieldCheck className="w-3.5 h-3.5" />
                     <span className="text-[10px] font-black uppercase tracking-widest leading-none">Code Integrity</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed">
                     Geometric constraints such as local buckling and flange slenderness are verified according to {selectedCodeId} Eurocode or AISC standards.
                  </p>
               </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-card">
             <CardHeader className="p-4 border-b bg-slate-50/50">
               <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Analysis Environment</CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 uppercase">Standard</span>
                  <Badge variant="secondary" className="rounded-md bg-blue-50 text-blue-700 px-2 py-0.5">{selectedCodeId}</Badge>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 uppercase">Material</span>
                  <Badge variant="secondary" className="rounded-md bg-slate-100 text-slate-600 px-2 py-0.5">{(MATERIALS[material] as any)?.name ?? 'Unknown'}</Badge>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 uppercase">Supports</span>
                  <Badge variant="secondary" className="rounded-md bg-slate-100 text-slate-600 px-2 py-0.5">{supportCondition.replace('_', ' ')}</Badge>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 uppercase">Load Case</span>
                  <Badge variant="secondary" className="rounded-md bg-slate-100 text-slate-600 px-2 py-0.5">{activeCombination.name}</Badge>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
