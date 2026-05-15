import * as React from 'react';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  AreaChart,
  Area,
  LineChart,
  Line,
  ResponsiveContainer,
  ReferenceLine,
  Label as RechartsLabel
} from 'recharts';
import { 
  Droplet as DropletIcon, 
  Link as LinkIcon, 
  Anchor as AnchorIcon, 
  Square as SquareIcon, 
  Activity as ActivityIcon, 
  Layout as LayoutIcon, 
  Scale as ScaleIcon, 
  AlertCircle as AlertCircleIcon 
} from 'lucide-react';
import { motion } from 'motion/react';
import { BeamDiagrams } from './BeamDiagrams';

export const SealantResultsView = ({
  results,
  unitSystem,
  t,
  u,
  toDisplay,
}: {
  results: any;
  unitSystem: string;
  t: any;
  u: any;
  toDisplay: (v: number, type: string) => number;
}) => {
  return (
    <div className="space-y-4">
      <div className={cn(
        "p-4 rounded-xl border flex items-center justify-between shadow-sm bg-gradient-to-r from-sky-500/5 to-transparent border-sky-100",
        results.status === 'pass' ? "border-l-4 border-l-sky-500" : "border-l-4 border-l-red-500"
      )}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-600 rounded-lg text-white">
            <DropletIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Structural Silicone Result</h3>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide italic">ASTM C1135 Method</p>
          </div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest",
          results.status === 'pass' ? "bg-sky-500 text-white" : "bg-red-500 text-white"
        )}>
          {results.status === 'pass' ? "PASS" : "FAIL"}
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 bg-white">
        <CardContent className="p-4 sm:p-6 text-center">
          <DropletIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Structural Silicone Result</h3>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="text-sm font-bold text-slate-500">
               Utilization: <span className={cn("text-xl", (results.utilization ?? 0) > 1 ? "text-red-600" : "text-green-600")}>{((results.utilization ?? 0) * 100).toFixed(1)}%</span>
            </div>
            <Badge variant={results.status === 'pass' ? 'outline' : 'destructive'} className={cn(
              "text-[10px] font-bold uppercase",
              results.status === 'pass' && "border-green-200 bg-green-50 text-green-700"
            )}>
              {results.status === 'pass' ? "PASS" : "FAIL"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 shadow-sm border-slate-200">
           <p className="text-[10px] font-bold text-slate-400 uppercase">Req. Bite (Dynamic/Wind)</p>
           <p className="text-xl font-black text-slate-900">{(results.biteDynamic ?? 0).toFixed(2)} mm</p>
        </Card>
        <Card className="p-4 shadow-sm border-slate-200">
           <p className="text-[10px] font-bold text-slate-400 uppercase">Req. Bite (Static/Dead)</p>
           <p className="text-xl font-black text-slate-900">{(results.biteStatic ?? 0).toFixed(2)} mm</p>
        </Card>
      </div>
      
      <Card className="p-4 shadow-sm border-blue-100 bg-blue-50/20">
         <div className="flex items-center justify-between">
           <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase">Recommended Bite Depth</p>
              <p className="text-2xl font-black text-slate-900">{Math.ceil(results.requiredBite)} mm</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Design Rule</p>
              <p className="text-xs font-medium text-slate-600 italic">ASTM C1184 / GB 16776</p>
           </div>
         </div>
      </Card>
    </div>
  );
};

export const BracketResultsView = ({
  results,
  unitSystem,
  t,
  u,
  toDisplay,
}: {
  results: any;
  unitSystem: string;
  t: any;
  u: any;
  toDisplay: (v: number, type: string) => number;
}) => {
  return (
    <div className="space-y-4">
      <div className={cn(
        "p-4 rounded-xl border flex items-center justify-between shadow-sm bg-gradient-to-r from-rose-500/5 to-transparent border-rose-100",
        results.status === 'pass' ? "border-l-4 border-l-rose-500" : "border-l-4 border-l-red-500"
      )}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-600 rounded-lg text-white">
            <LinkIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Bracket Connection Status</h3>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide italic">Bolted Connection Analysis</p>
          </div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest",
          results.status === 'pass' ? "bg-rose-500 text-white" : "bg-red-500 text-white"
        )}>
          {results.status === 'pass' ? "PASS" : "FAIL"}
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 bg-white">
        <CardContent className="p-4 sm:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Bracket Connection Status</h3>
              <div className="flex items-center gap-2 mt-1">
                 <Badge variant={results.status === 'pass' ? 'outline' : 'destructive'} className={cn(
                  "text-[10px] font-bold uppercase",
                  results.status === 'pass' && "border-green-200 bg-green-50 text-green-700"
                )}>
                  {results.status === 'pass' ? "PASS" : "FAIL"}
                </Badge>
                <span className="text-[10px] font-bold text-slate-400">Max Util: {((results.maxUtilization ?? 0) * 100).toFixed(1)}%</span>
              </div>
            </div>
            <LinkIcon className="w-10 h-10 text-slate-100 absolute -right-2 -bottom-2 rotate-12" />
          </div>
          <div className="mt-4 h-2 bg-slate-100 rounded-full">
             <div className={cn("h-full rounded-full transition-all", (results.maxUtilization ?? 0) > 1 ? "bg-red-500" : "bg-blue-600")} style={{ width: `${Math.min(100, (results.maxUtilization ?? 0) * 100)}%` }} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 min-[500px]:grid-cols-3 gap-3 text-center">
         <Card className="p-3 border-slate-100 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Bolt Shear</p>
            <p className="text-sm font-black text-slate-800">{(results.boltShearStress ?? 0).toFixed(1)} MPa</p>
            <div className="text-[8px] font-bold mt-1" style={{ color: (results.boltUtilization ?? 0) > 1 ? 'red' : 'green' }}>{((results.boltUtilization ?? 0) * 100).toFixed(0)}%</div>
         </Card>
         <Card className="p-3 border-slate-100 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Bearing</p>
            <p className="text-sm font-black text-slate-800">{(results.bearingStress ?? 0).toFixed(1)} MPa</p>
            <div className="text-[8px] font-bold mt-1" style={{ color: (results.bearingUtilization ?? 0) > 1 ? 'red' : 'green' }}>{((results.bearingUtilization ?? 0) * 100).toFixed(0)}%</div>
         </Card>
         <Card className="p-3 border-slate-100 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Bending</p>
            <p className="text-sm font-black text-slate-800">{(results.bendingStress ?? 0).toFixed(1)} MPa</p>
            <div className="text-[8px] font-bold mt-1" style={{ color: (results.bendingUtilization ?? 0) > 1 ? 'red' : 'green' }}>{((results.bendingUtilization ?? 0) * 100).toFixed(0)}%</div>
         </Card>
      </div>
    </div>
  );
};

export const CastInResultsView = ({
  results,
}: {
  results: any;
  unitSystem: string;
  t: any;
  u: any;
  toDisplay: (v: number, type: string) => number;
}) => {
  if (!results) return null;

  return (
    <div className="space-y-4">
      <div className={cn(
        "p-4 rounded-xl border flex items-center justify-between shadow-sm bg-gradient-to-r from-amber-500/5 to-transparent border-amber-100",
        results.status === 'pass' ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-red-500"
      )}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-600 rounded-lg text-white">
            <AnchorIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Cast-in Embed Result</h3>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide italic">ACI 318 - CCD Method</p>
          </div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest",
          results.status === 'pass' ? "bg-amber-500 text-white" : "bg-red-500 text-white"
        )}>
          {results.status === 'pass' ? "PASS" : "FAIL"}
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 bg-white">
        <CardContent className="p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center p-2.5",
              results.status === 'pass' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            )}>
              <AnchorIcon className="w-full h-full" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Cast-in Embed Result</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={results.status === 'pass' ? 'outline' : 'destructive'} className={cn(
                  "text-[10px] font-bold uppercase",
                  results.status === 'pass' && "border-green-200 bg-green-50 text-green-700"
                )}>
                  {results.status === 'pass' ? "PASS" : "FAIL"}
                </Badge>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                   {(results.utilizationInteraction * 100).toFixed(1)}% Interaction
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
         <Card className="p-3 border-slate-200 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Tension Capacity</p>
            <p className="text-sm font-black text-slate-800">{(results.tensionCapacity / 1000).toFixed(1)} kN</p>
         </Card>
         <Card className="p-3 border-slate-200 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Shear Capacity</p>
            <p className="text-sm font-black text-slate-800">{(results.shearCapacity / 1000).toFixed(1)} kN</p>
         </Card>
      </div>
    </div>
  );
};

export const PanelResultsView = ({
  results,
}: {
  results: any;
  unitSystem: string;
  t: any;
  u: any;
  toDisplay: (v: number, type: string) => number;
}) => {
  const maxUtilization = results.summary.utilization;

  return (
    <div className="space-y-4">
      <div className={cn(
        "p-4 rounded-xl border flex items-center justify-between shadow-sm bg-white border-emerald-100",
        results.summary.status === 'pass' ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-red-500"
      )}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-lg text-white">
            <SquareIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Panel Analysis Result</h3>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide italic">Roark's Formulas Method</p>
          </div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest",
          results.summary.status === 'pass' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
        )}>
          {results.summary.status === 'pass' ? "PASS" : "FAIL"}
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center mb-4 gap-2">
            <span className="text-2xl font-black text-slate-900">{(maxUtilization * 100).toFixed(1)}%</span>
            <span className="text-xs font-bold text-slate-400 uppercase">Governing Utilization</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, maxUtilization * 100)}%` }}
              className={cn(
                "h-full rounded-full transition-all duration-500",
                maxUtilization > 1 ? "bg-red-500" : "bg-blue-500"
              )}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Skin Deflection</p>
            <p className="text-lg font-black italic">{(results.skin?.deflection ?? 0).toFixed(2)} mm</p>
        </Card>
        <Card className="p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Weight</p>
            <p className="text-lg font-black italic">{((results.summary?.weight ?? 0) / 9.81).toFixed(1)} kg</p>
        </Card>
      </div>
    </div>
  );
};

export const BeamAnalysisChart = ({ 
  results, 
  unitSystem, 
  u, 
  toDisplay,
}: any) => {
  return (
    <div className="h-full w-full overflow-y-auto">
      <BeamDiagrams 
        points={results.points} 
        unitSystem={unitSystem} 
        u={u} 
        toDisplay={toDisplay} 
      />
    </div>
  );
};

export function ChartContainer({ 
  data, 
  dataKey, 
  color, 
  unit, 
  label, 
  invert = false, 
  formatter, 
  unitSystem, 
  u, 
  criticalPoints,
  chartType = 'area'
}: { 
  data: any[]; 
  dataKey: string; 
  color: string; 
  unit: string;
  label: string;
  invert?: boolean;
  formatter?: (v: number) => string;
  unitSystem: 'metric' | 'imperial';
  u: any;
  criticalPoints?: { x: number; y: number; label: string }[];
  chartType?: 'area' | 'line';
}) {
  const commonAxisProps = {
    x: (
      <XAxis 
        dataKey="x" 
        type="number" 
        domain={[0, 'dataMax' as any]} 
        tick={{ fontSize: 10, fill: '#64748B' }}
        axisLine={{ stroke: '#CBD5E1' }}
        tickLine={false}
        label={{ value: `Distance (${u.length})`, position: 'bottom', offset: 0, fontSize: 10, fill: '#64748B' }}
      />
    ),
    y: (
      <YAxis 
        reversed={invert}
        tick={{ fontSize: 10, fill: '#64748B' }}
        axisLine={{ stroke: '#CBD5E1' }}
        tickLine={false}
        tickFormatter={(v) => formatter ? formatter(v) : (Number(v) || 0).toFixed(1)}
        label={{ value: `${label} (${unit})`, angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#64748B' }}
      />
    ),
    grid: <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />,
    tooltip: (
      <ChartTooltip 
        contentStyle={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          border: '1px solid #E2E8F0', 
          borderRadius: '12px',
          fontSize: '12px',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          backdropFilter: 'blur(4px)'
        }}
        formatter={(v: number) => [formatter ? formatter(v) : `${(Number(v) || 0).toFixed(3)} ${unit}`, label]}
        labelFormatter={(v) => `Position: ${Number(v).toFixed(unitSystem === 'metric' ? 0 : 2)} ${u.length}`}
      />
    ),
    referenceLines: (
      <>
        {criticalPoints?.map((cp, i) => (
          <ReferenceLine 
            key={i} 
            x={cp.x} 
            stroke={color} 
            strokeDasharray="5 5" 
            opacity={0.6}
          >
            <RechartsLabel 
              value={cp.label} 
              position="top" 
              fill={color} 
              fontSize={10} 
              fontWeight="bold"
              offset={10}
            />
          </ReferenceLine>
        ))}
        {criticalPoints?.map((cp, i) => (
          <ReferenceLine 
            key={`y-${i}`} 
            y={cp.y} 
            stroke={color} 
            strokeDasharray="3 3" 
            opacity={0.4}
          />
        ))}
      </>
    )
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {chartType === 'area' ? (
        <AreaChart data={data} margin={{ top: 25, right: 30, left: 10, bottom: 25 }}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          {commonAxisProps.grid}
          {commonAxisProps.x}
          {commonAxisProps.y}
          {commonAxisProps.tooltip}
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={3}
            fillOpacity={1} 
            fill={`url(#gradient-${dataKey})`} 
            animationDuration={750}
            activeDot={{ r: 6, stroke: '#FFF', strokeWidth: 2, fill: color }}
          />
          {commonAxisProps.referenceLines}
        </AreaChart>
      ) : (
        <LineChart data={data} margin={{ top: 25, right: 30, left: 10, bottom: 25 }}>
          {commonAxisProps.grid}
          {commonAxisProps.x}
          {commonAxisProps.y}
          {commonAxisProps.tooltip}
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={3}
            dot={false}
            animationDuration={750}
            activeDot={{ r: 6, stroke: '#FFF', strokeWidth: 2, fill: color }}
          />
          {commonAxisProps.referenceLines}
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}

export const UtilizationCards = ({ results }: any) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="border-slate-200 overflow-hidden rounded-2xl bg-card shadow-sm">
        <div className="p-6 border-b bg-slate-50/50 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                 <ActivityIcon className="w-5 h-5" />
              </div>
              <div>
                 <h4 className="text-sm font-black text-slate-900 uppercase">Analysis Results</h4>
              </div>
           </div>
        </div>
        <CardContent className="p-0">
           <div className="divide-y divide-slate-100">
              <div className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                 <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Flexural Stress</span>
                 </div>
                 <div className="text-right">
                    <p className="text-xl font-black text-slate-900">{(results.summary.utilizationStress * 100).toFixed(1)}%</p>
                 </div>
              </div>
              <div className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                 <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Span Deflection</span>
                 </div>
                 <div className="text-right">
                    <p className="text-xl font-black text-slate-900">{(results.summary.utilizationDeflection * 100).toFixed(1)}%</p>
                 </div>
              </div>
           </div>
        </CardContent>
      </Card>
      
      <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center text-xs italic text-slate-500 leading-relaxed font-medium">
          Theoretical analysis based on Euler-Bernoulli beam theory. Lateral torsional buckling is assumed to be restrained by curtain wall infill panels.
      </div>
    </div>
  );
};
