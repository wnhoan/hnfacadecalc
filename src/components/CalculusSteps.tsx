import * as React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Activity, 
  Scale, 
  Calculator, 
  Layers, 
  Anchor,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChartContainer } from './ResultViews';
import { Combination, Load } from '@/lib/structural-logic';
import { SEISMIC_REGIONS } from '@/constants';
import { calculateCastInEmbed } from '@/lib/structural-engine';

export const CalculusStepsCard = ({ 
  options, 
  setOptions,
  sectionProps,
  factoredLoads,
  beamProps,
  results,
  u,
  unitSystem,
  sectionType,
  beamType,
  width,
  height,
  thickness,
  thickness2,
  material,
  safetyFactor,
  activeCombination,
  t,
  criticalPoints,
  toDisplay,
  seismicRegion,
  seismicCoeff,
  loads,
  calculationMode,
  embedDepth,
  edgeDistance,
  concreteGrade,
  boltCount,
  boltDiameter
}: {
  options: { section: boolean; loads: boolean; analysis: boolean; stress: boolean; seismic: boolean };
  setOptions: (v: any) => void;
  sectionProps: any;
  factoredLoads: any[];
  beamProps: any;
  results: any;
  u: any;
  unitSystem: string;
  sectionType: string;
  beamType: string;
  width: number;
  height: number;
  thickness: number;
  thickness2: number;
  material: string;
  safetyFactor: number;
  activeCombination: Combination;
  t: any;
  criticalPoints?: any;
  toDisplay: any;
  seismicRegion: string;
  seismicCoeff: number;
  loads: Load[];
  calculationMode?: string;
  embedDepth?: number;
  edgeDistance?: number;
  concreteGrade?: number;
  boltCount?: number;
  boltDiameter?: number;
}) => {
  const toggleOption = (key: keyof typeof options) => {
    setOptions({ ...options, [key]: !options[key] });
  };

  const castInResults = calculationMode === 'cast-in-embed' ? calculateCastInEmbed({
    embedDepth: embedDepth ?? 120,
    edgeDistance: edgeDistance ?? 150,
    concreteGrade: concreteGrade ?? 30,
    boltDiameter: boltDiameter ?? 12,
    boltCount: boltCount ?? 2,
    tensionLoad: 0, 
    shearLoad: 0,
    safetyFactor
  }) : null;

  return (
    <Card className="shadow-sm border-slate-200 overflow-hidden">
      <CardHeader className="p-3 sm:p-4 border-b bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Calculus Steps</span>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Section</span>
              <Switch checked={options.section} onCheckedChange={() => toggleOption('section')} className="scale-75" />
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Loads</span>
              <Switch checked={options.loads} onCheckedChange={() => toggleOption('loads')} className="scale-75" />
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Analysis</span>
              <Switch checked={options.analysis} onCheckedChange={() => toggleOption('analysis')} className="scale-75" />
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Stress</span>
              <Switch checked={options.stress} onCheckedChange={() => toggleOption('stress')} className="scale-75" />
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Seismic</span>
              <Switch checked={options.seismic} onCheckedChange={() => toggleOption('seismic')} className="scale-75" />
            </div>
          </div>
        </div>
        <CardTitle className="text-sm sm:text-base mt-1">Detailed Calculation Steps</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {calculationMode === 'cast-in-embed' && options.section && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Anchor className="w-3 h-3" />
              Step 1: Anchor Geometry & Concrete Properties
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/20 p-3 rounded-xl border border-blue-100">
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-slate-500 italic">Parameters:</p>
                <div className="font-mono text-[11px] space-y-1.5">
                   <div className="bg-white p-2 rounded border border-slate-200 flex justify-between">
                     <span>Embed Depth (h_ef)</span>
                     <span className="font-bold">{embedDepth} mm</span>
                   </div>
                   <div className="bg-white p-2 rounded border border-slate-200 flex justify-between">
                     <span>Edge Distance (c_1)</span>
                     <span className="font-bold">{edgeDistance} mm</span>
                   </div>
                   <div className="bg-white p-2 rounded border border-slate-200 flex justify-between">
                     <span>Concrete Grade (f'_c)</span>
                     <span className="font-bold">{concreteGrade} MPa</span>
                   </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-slate-500 italic">Design Criteria (ACI 318):</p>
                <div className="font-mono text-[11px] space-y-1.5">
                   <div className="bg-white p-2 rounded border border-slate-200">
                     N_b = 10 · √(f'c) · h_ef^1.5
                   </div>
                   <div className="bg-white p-2 rounded border border-slate-200">
                     A_Nc = (1.5h_ef + c_1) · 3h_ef
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {calculationMode === 'beam' && options.section && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-3 h-3" />
              Step 1: Section Properties
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-slate-500 italic">Formulas:</p>
                <div className="font-mono text-[11px] space-y-1.5">
                  {sectionType === 'solid' ? (
                    <>
                      <div className="bg-white p-2 rounded border border-slate-200">A = w × h</div>
                      <div className="bg-white p-2 rounded border border-slate-200">I = (w × h³) / 12</div>
                      <div className="bg-white p-2 rounded border border-slate-200">W = I / (h / 2)</div>
                    </>
                  ) : sectionType === 'channel' ? (
                    <>
                      <div className="bg-white p-2 rounded border border-slate-200">A = 2wt_f + (h-2t_f)t_w</div>
                      <div className="bg-white p-2 rounded border border-slate-200">I = (wh³)/12 - ((w-t_w)(h-2t_f)³)/12</div>
                      <div className="bg-white p-2 rounded border border-slate-200">W = I / (h / 2)</div>
                    </>
                  ) : sectionType === 'l-plate' ? (
                    <>
                      <div className="bg-white p-2 rounded border border-slate-200">A = wt_h + (h-t_h)t_v</div>
                      <div className="bg-white p-2 rounded border border-slate-200">I = Σ(I_i + A_i·d_i²)</div>
                      <div className="bg-white p-2 rounded border border-slate-200">W = I / y_max</div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white p-2 rounded border border-slate-200">A = (w × h) - (w - 2t_x)(h - 2t_y)</div>
                      <div className="bg-white p-2 rounded border border-slate-200">I = (wh³ - (w-2t_x)(h-2t_y)³) / 12</div>
                      <div className="bg-white p-2 rounded border border-slate-200">W = I / (h / 2)</div>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-slate-500 italic">Calculations:</p>
                    <div className="font-mono text-[11px] space-y-1.5">
                      <div className="bg-white p-2 rounded border border-slate-200">A = {(sectionProps.area ?? 0).toFixed(2)} mm²</div>
                      <div className="bg-white p-2 rounded border border-slate-200">I = {(sectionProps.momentOfInertia ?? 0).toExponential(4)} mm⁴</div>
                      <div className="bg-white p-2 rounded border border-slate-200">W = {(sectionProps.sectionModulus ?? 0).toExponential(4)} mm³</div>
                    </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-2">
                <div className="flex items-center gap-2 text-blue-700">
                  <div className="p-1 rounded bg-blue-100">
                    <Activity className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">I-Value (Moment of Inertia)</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  <strong>Calculus Measure:</strong> The second moment of area, defined as <code className="text-blue-700 font-bold">I = ∫ y² dA</code>. 
                  It measures the section's geometric efficiency in resisting bending. A larger I-value significantly reduces deflection (Δ ∝ 1/I).
                </p>
              </div>
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700">
                  <div className="p-1 rounded bg-indigo-100">
                    <Layers className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">W-Value (Section Modulus)</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  <strong>Calculus Measure:</strong> Derived as <code className="text-indigo-700 font-bold">W = I / y_max</code>. 
                  It relates the internal bending moment to the maximum stress at the extreme fiber (σ = M/W). It defines the strength capacity of the section.
                </p>
              </div>
            </div>
          </div>
        )}

        {options.loads && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Scale className="w-3 h-3" />
              Step 2: Load Factoring ({activeCombination.name})
            </h4>
            <p className="text-[10px] text-slate-500 italic px-1">{activeCombination.description}</p>
            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-200">
                    <TableHead className="h-8 text-[9px] uppercase font-bold text-slate-400">Type</TableHead>
                    <TableHead className="h-8 text-[9px] uppercase font-bold text-slate-400 text-right">Nominal</TableHead>
                    <TableHead className="h-8 text-[9px] uppercase font-bold text-slate-400 text-center">Factor</TableHead>
                    <TableHead className="h-8 text-[9px] uppercase font-bold text-slate-400 text-right">Factored</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factoredLoads.map((load, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-100/50 border-slate-100">
                      <TableCell className="py-2 text-[10px] font-medium text-slate-700 capitalize">{load.type} ({load.category})</TableCell>
                      <TableCell className="py-2 text-[10px] font-mono text-right">{(load.value ?? 0).toFixed(2)}</TableCell>
                      <TableCell className="py-2 text-[10px] font-mono text-center text-blue-600 font-bold">×</TableCell>
                      <TableCell className="py-2 text-[10px] font-mono text-right font-bold text-slate-900">{(load.value ?? 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {options.analysis && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Calculator className="w-3 h-3" />
              Step 3: Beam Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-slate-500 italic">Key Results:</p>
                  <div className="font-mono text-[11px] space-y-1.5">
                    <div className="bg-white p-2 rounded border border-slate-200 flex justify-between">
                      <span>Max Moment (M_max):</span>
                      <span className="font-bold text-blue-600">{((results.summary.maxMoment ?? 0) / 1000000).toFixed(3)} kNm</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200 flex justify-between">
                      <span>Max Shear (V_max):</span>
                      <span className="font-bold text-blue-600">{((results.summary.maxShear ?? 0) / 1000).toFixed(3)} kN</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200 flex justify-between">
                      <span>Max Deflection (Δ_max):</span>
                      <span className="font-bold text-blue-600">{(results.summary.maxDeflection ?? 0).toFixed(3)} mm</span>
                    </div>
                  </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-slate-500 italic">Verification:</p>
                <div className="font-mono text-[11px] space-y-1.5">
                  <div className="bg-white p-2 rounded border border-slate-200 flex justify-between">
                    <span>Span Ratio:</span>
                    <span className="font-bold text-slate-900">{results.summary.deflectionRatio}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200 flex justify-between">
                    <span>Limit (L/{beamType === 'transom' ? 240 : 175}):</span>
                    <span className="font-bold text-slate-900">{(beamProps.length / (beamType === 'transom' ? 240 : 175)).toFixed(2)} mm</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200 flex justify-between">
                    <span>Status:</span>
                    <span className={cn("font-bold uppercase", results.summary.status === 'pass' ? "text-green-600" : "text-red-600")}>
                      {results.summary.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deflection Chart */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Deflection Visualization</h5>
                <div className="text-[10px] font-mono text-blue-600 font-bold">
                  Δ_max = {(results.summary.maxDeflection ?? 0).toFixed(3)} mm
                </div>
              </div>
              <div className="h-48 bg-white rounded-xl border border-slate-200 p-2 overflow-hidden shadow-inner">
                <ChartContainer 
                  data={results.points.map((p: any) => ({ 
                    ...p, 
                    x: toDisplay(p.x, 'length'), 
                    deflection: toDisplay(p.deflection, 'length') 
                  }))} 
                  dataKey="deflection" 
                  color="#3B82F6" 
                  unit={u.length} 
                  label={t.deflection}
                  invert
                  unitSystem={unitSystem as any}
                  u={u}
                  criticalPoints={criticalPoints?.deflection}
                  chartType="line"
                />
              </div>
            </div>
          </div>
        )}

        {options.seismic && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3" />
              Seismic Parameter Verification
            </h4>
            <div className="bg-rose-50/30 p-3 rounded-xl border border-rose-100/50 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-rose-700/70 italic uppercase tracking-wider font-bold">Region Database ({SEISMIC_REGIONS[seismicRegion as keyof typeof SEISMIC_REGIONS].name})</p>
                <div className="font-mono text-[11px] space-y-1.5">
                  <div className="bg-white/80 p-2 rounded border border-rose-100 flex justify-between">
                    <span className="text-slate-500">Peak Ground Accel (ag/g):</span>
                    <span className="font-bold text-rose-600">{SEISMIC_REGIONS[seismicRegion as keyof typeof SEISMIC_REGIONS].accel.toFixed(3)}</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-rose-100 flex justify-between">
                    <span className="text-slate-500">Importance Factor (Ie):</span>
                    <span className="font-bold text-rose-600">{SEISMIC_REGIONS[seismicRegion as keyof typeof SEISMIC_REGIONS].importance.toFixed(2)}</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-rose-100 flex justify-between">
                    <span className="text-slate-500">Resp. Mod Factor (R):</span>
                    <span className="font-bold text-rose-600">{SEISMIC_REGIONS[seismicRegion as keyof typeof SEISMIC_REGIONS].respMod.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-rose-700/70 italic uppercase tracking-wider font-bold">Derivation (Static Equivalent)</p>
                <div className="font-mono text-[11px] space-y-1.5">
                  <div className="bg-white/80 p-2 rounded border border-rose-100 space-y-1">
                    <div className="flex justify-between items-center bg-rose-50/50 p-1 px-1.5 rounded mb-1 border border-rose-100">
                      <span className="text-[9px] font-bold text-rose-600 uppercase">Seismic Coefficient (Cs)</span>
                      <span className="text-[12px] font-bold text-rose-700">{seismicCoeff.toFixed(4)}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 italic">Cs = ag/g × (Ie / R) × α (simplified local code model)</p>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-rose-100 space-y-1">
                     <div className="flex justify-between items-center bg-rose-50/50 p-1 px-1.5 rounded border border-rose-100">
                      <span className="text-[9px] font-bold text-rose-600 uppercase">Resultant Force (Fs)</span>
                      <span className="text-rose-700 font-bold">{(loads.filter(l => l.category === 'seismic').reduce((s, l) => s + (l.value ?? 0), 0)).toFixed(4)} {u.force}/{u.length}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 italic">Fs = Cs × Total Weight (W_dead)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {options.stress && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Scale className="w-3 h-3" />
              Step 4: Stress Check
            </h4>
            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Bending Stress Calculation</p>
                    <div className="font-mono text-xs space-y-1">
                      <p>σ = M_max / W</p>
                      <p>σ = {(results.summary.maxMoment ?? 0).toFixed(0)} / {(sectionProps.sectionModulus ?? 0).toFixed(0)}</p>
                      <p className="text-blue-600 font-bold">σ = {(results.summary.maxStress ?? 0).toFixed(2)} MPa</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Allowable Stress</p>
                    <div className="font-mono text-xs space-y-1">
                      <p>σ_allow = fy / Safety Factor (γ)</p>
                      <p>σ_allow = {beamProps.yieldStrength} / {safetyFactor}</p>
                      <p className="text-green-600 font-bold">σ_allow = {(beamProps.yieldStrength / safetyFactor).toFixed(2)} MPa</p>
                    </div>
                  </div>
              </div>
              <div className={cn(
                "p-3 rounded-lg border flex items-center justify-between",
                (results.summary.maxStress ?? 0) <= (beamProps.yieldStrength / safetyFactor) 
                  ? "bg-green-50 border-green-200 text-green-700" 
                  : "bg-red-50 border-red-200 text-red-700"
              )}>
                <div className="flex items-center gap-2">
                  {(results.summary.maxStress ?? 0) <= (beamProps.yieldStrength / safetyFactor) ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span className="text-xs font-bold uppercase tracking-tight">
                    {(results.summary.maxStress ?? 0) <= (beamProps.yieldStrength / safetyFactor) ? "Stress Check Passed" : "Stress Check Failed"}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold">
                  {((results.summary.maxStress ?? 0) / (beamProps.yieldStrength / safetyFactor) * 100).toFixed(1)}% Utilization
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
