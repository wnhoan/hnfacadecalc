import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalculationResult } from '@/lib/structural-engine';
import { cn } from '@/lib/utils';

interface BeamDiagramsProps {
  points: CalculationResult[];
  unitSystem: 'metric' | 'imperial';
  u: {
    length: string;
    force: string;
    stress: string;
    moment: string;
    forceDisplay: string;
    momentDisplay: string;
  };
  toDisplay: (val: number, type: any) => number;
}

const CustomTooltip = ({ active, payload, label, unit, title, xUnit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-xs">
        <p className="font-bold text-slate-500 mb-1">Position: {label.toFixed(1)} {xUnit}</p>
        <p className="font-black text-slate-900">
          {title}: {payload[0].value.toFixed(2)} {unit}
        </p>
      </div>
    );
  }
  return null;
};

export const BeamDiagrams: React.FC<BeamDiagramsProps> = ({ points, unitSystem, u, toDisplay }) => {
  const chartData = points.map(p => ({
    x: toDisplay(p.x, 'length'), // use converted X
    shear: toDisplay(p.shear, 'forceDisplay'), // Use kN or kips
    moment: toDisplay(p.moment, 'momentDisplay'), // Use kNm or lbft
    deflection: toDisplay(p.deflection, 'length'),
    stress: toDisplay(p.stress, 'stress'),
  }));

  if (points.length === 0) return null;

  const xUnit = u.length;

  return (
    <div className="grid grid-cols-1 gap-6 mt-2 p-4 pb-20">
      {/* Shear Force Diagram */}
      <Card className="border-slate-200 shadow-sm overflow-hidden rounded-xl">
        <CardHeader className="p-4 border-b bg-slate-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Shear Force Diagram (V)
          </CardTitle>
          <Badge variant="outline" className="text-[9px] font-bold text-blue-600 bg-blue-50 border-blue-100 uppercase">{u.forceDisplay}</Badge>
        </CardHeader>
        <CardContent className="p-0 pt-4 h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorShear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="x" 
                fontSize={10}
                tickFormatter={(val) => val.toFixed(0)}
                stroke="#94a3b8"
                label={{ value: xUnit, position: 'insideBottomRight', offset: -10, fontSize: 10, fontWeight: 'bold' }}
              />
              <YAxis 
                fontSize={10} 
                tickFormatter={(val) => val.toFixed(1)} 
                axisLine={false}
                tickLine={false}
                stroke="#94a3b8"
              />
              <Tooltip 
                content={<CustomTooltip unit={u.forceDisplay} title="Shear Force" xUnit={xUnit} />}
              />
              <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
              <Area 
                type="monotone" 
                dataKey="shear" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorShear)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bending Moment Diagram */}
      <Card className="border-slate-200 shadow-sm overflow-hidden rounded-xl">
        <CardHeader className="p-4 border-b bg-slate-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Bending Moment Diagram (M)
          </CardTitle>
          <Badge variant="outline" className="text-[9px] font-bold text-violet-600 bg-violet-50 border-violet-100 uppercase">{u.momentDisplay}</Badge>
        </CardHeader>
        <CardContent className="p-0 pt-4 h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorMoment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="x" 
                fontSize={10}
                tickFormatter={(val) => val.toFixed(0)}
                stroke="#94a3b8"
                label={{ value: xUnit, position: 'insideBottomRight', offset: -10, fontSize: 10, fontWeight: 'bold' }}
              />
              <YAxis 
                fontSize={10} 
                tickFormatter={(val) => val.toFixed(1)} 
                axisLine={false}
                tickLine={false}
                stroke="#94a3b8"
              />
              <Tooltip 
                content={<CustomTooltip unit={u.momentDisplay} title="Bending Moment" xUnit={xUnit} />}
              />
              <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
              <Area 
                type="monotone" 
                dataKey="moment" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorMoment)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stress Diagram */}
      <Card className="border-slate-200 shadow-sm overflow-hidden rounded-xl">
        <CardHeader className="p-4 border-b bg-slate-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Stress Diagram (σ)
          </CardTitle>
          <Badge variant="outline" className="text-[9px] font-bold text-amber-600 bg-amber-50 border-amber-100 uppercase">{u.stress}</Badge>
        </CardHeader>
        <CardContent className="p-0 pt-4 h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="x" 
                fontSize={10}
                tickFormatter={(val) => val.toFixed(0)}
                stroke="#94a3b8"
                label={{ value: xUnit, position: 'insideBottomRight', offset: -10, fontSize: 10, fontWeight: 'bold' }}
              />
              <YAxis 
                fontSize={10} 
                tickFormatter={(val) => val.toFixed(1)} 
                axisLine={false}
                tickLine={false}
                stroke="#94a3b8"
              />
              <Tooltip 
                content={<CustomTooltip unit={u.stress} title="Stress" xUnit={xUnit} />}
              />
              <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
              <Area 
                type="monotone" 
                dataKey="stress" 
                stroke="#f59e0b" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorStress)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Deflection Diagram */}
      <Card className="border-slate-200 shadow-sm overflow-hidden rounded-xl">
        <CardHeader className="p-4 border-b bg-slate-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Deflection Diagram (δ)
          </CardTitle>
          <Badge variant="outline" className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border-emerald-100 uppercase">{u.length}</Badge>
        </CardHeader>
        <CardContent className="p-0 pt-4 h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorDeflection" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="x" 
                fontSize={10}
                tickFormatter={(val) => val.toFixed(0)}
                stroke="#94a3b8"
                label={{ value: xUnit, position: 'insideBottomRight', offset: -10, fontSize: 10, fontWeight: 'bold' }}
              />
              <YAxis 
                fontSize={10} 
                tickFormatter={(val) => val.toFixed(2)} 
                axisLine={false}
                tickLine={false}
                stroke="#94a3b8"
                reversed={true} // Usually deflection is drawn downwards
              />
              <Tooltip 
                content={<CustomTooltip unit={u.length} title="Deflection" xUnit={xUnit} />}
              />
              <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
              <Area 
                type="monotone" 
                dataKey="deflection" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorDeflection)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

