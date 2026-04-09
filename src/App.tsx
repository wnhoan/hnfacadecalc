/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Maximize2,
  Settings2,
  BarChart3,
  Layout
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  calculateBeam, 
  calculateRectangularProperties, 
  calculateHollowRectangularProperties,
  BeamProperties,
  Load
} from '@/lib/structural-engine';
import { cn } from '@/lib/utils';

const MATERIALS = {
  aluminum: { name: 'Aluminum 6063-T6', e: 70000, yield: 160 },
  steel: { name: 'Steel S235', e: 210000, yield: 235 },
  stainless_304: { name: 'Stainless Steel 304', e: 193000, yield: 205 },
  stainless_316: { name: 'Stainless Steel 316', e: 200000, yield: 215 },
  glass_annealed: { name: 'Glass (Annealed)', e: 70000, yield: 45 },
  glass_tempered: { name: 'Glass (Tempered)', e: 70000, yield: 120 },
  grc: { name: 'GRC Panel', e: 15000, yield: 8 },
  terracotta: { name: 'Terracotta', e: 30000, yield: 15 },
  custom: { name: 'Custom', e: 200000, yield: 200 },
};

export default function App() {
  // Beam State
  const [length, setLength] = useState(3000); // mm
  const [material, setMaterial] = useState<keyof typeof MATERIALS>('aluminum');
  const [sectionType, setSectionType] = useState<'solid' | 'hollow'>('hollow');
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(100);
  const [thickness, setThickness] = useState(3);
  const [safetyFactor, setSafetyFactor] = useState(1.5);

  // Loads State
  const [loads, setLoads] = useState<Load[]>([
    { id: '1', type: 'udl', value: 0.5 }, // 0.5 N/mm = 0.5 kN/m
  ]);

  // Calculations
  const sectionProps = useMemo(() => {
    if (sectionType === 'solid') {
      return calculateRectangularProperties(width, height);
    }
    return calculateHollowRectangularProperties(width, height, thickness);
  }, [width, height, thickness, sectionType]);

  const beamProps: BeamProperties = useMemo(() => ({
    length,
    elasticModulus: MATERIALS[material].e,
    momentOfInertia: sectionProps.momentOfInertia,
    sectionModulus: sectionProps.sectionModulus,
    yieldStrength: MATERIALS[material].yield,
    safetyFactor,
  }), [length, material, sectionProps, safetyFactor]);

  const results = useMemo(() => calculateBeam(beamProps, loads), [beamProps, loads]);

  const addLoad = (type: Load['type'] = 'point') => {
    const newLoad: Load = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      value: type === 'point' ? 1000 : 0.5,
      position: type === 'point' ? length / 2 : undefined,
      value2: type === 'trapezoidal' ? 0.5 : undefined,
      start: type === 'trapezoidal' ? 0 : undefined,
      end: type === 'trapezoidal' ? length : undefined,
    };
    setLoads([...loads, newLoad]);
  };

  const removeLoad = (id: string) => {
    setLoads(loads.filter(l => l.id !== id));
  };

  const updateLoad = (id: string, updates: Partial<Load>) => {
    setLoads(loads.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">FacadeCalc</h1>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Structural Analysis Tool</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Print Report
            </Button>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border",
              results.summary.status === 'pass' 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-rose-50 text-rose-700 border-rose-200"
            )}>
              {results.summary.status === 'pass' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {results.summary.status === 'pass' ? 'Design Valid' : 'Design Fails'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          
          {/* Geometry & Material */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Settings2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Configuration</span>
              </div>
              <CardTitle className="text-lg">Beam Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="length">Span Length (mm)</Label>
                <Input 
                  id="length" 
                  type="number" 
                  value={length} 
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="bg-slate-50/50"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Material</Label>
                <Select value={material} onValueChange={(v: any) => setMaterial(v)}>
                  <SelectTrigger className="bg-slate-50/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MATERIALS).map(([key, m]) => (
                      <SelectItem key={key} value={key}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="safetyFactor">Safety Factor (γ)</Label>
                <Input 
                  id="safetyFactor" 
                  type="number" 
                  step="0.1"
                  value={safetyFactor} 
                  onChange={(e) => setSafetyFactor(Number(e.target.value))}
                  className="bg-slate-50/50"
                />
              </div>

              <Separator className="my-2" />

              <div className="grid gap-2">
                <Label>Section Type</Label>
                <Tabs value={sectionType} onValueChange={(v: any) => setSectionType(v)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="solid">Solid</TabsTrigger>
                    <TabsTrigger value="hollow">Hollow</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="width">Width (mm)</Label>
                  <Input 
                    id="width" 
                    type="number" 
                    value={width} 
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="bg-slate-50/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="height">Height (mm)</Label>
                  <Input 
                    id="height" 
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="bg-slate-50/50"
                  />
                </div>
              </div>

              {sectionType === 'hollow' && (
                <div className="grid gap-2">
                  <Label htmlFor="thickness">Thickness (mm)</Label>
                  <Input 
                    id="thickness" 
                    type="number" 
                    value={thickness} 
                    onChange={(e) => setThickness(Number(e.target.value))}
                    className="bg-slate-50/50"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t px-6 py-3">
              <div className="w-full grid grid-cols-2 gap-4 text-[11px] font-mono text-slate-500 uppercase">
                <div>I: {sectionProps.momentOfInertia.toExponential(2)} mm⁴</div>
                <div>W: {sectionProps.sectionModulus.toExponential(2)} mm³</div>
              </div>
            </CardFooter>
          </Card>

          {/* Loads */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Loading</span>
                </div>
                <CardTitle className="text-lg">Applied Loads</CardTitle>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="outline" onClick={() => addLoad('point')} className="h-8 w-8" title="Add Point Load">
                  <div className="w-1 h-3 bg-rose-500 rounded-full" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => addLoad('udl')} className="h-8 w-8" title="Add UDL">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => addLoad('trapezoidal')} className="h-8 w-8" title="Add Trapezoidal Load">
                  <Layout className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loads.map((load, idx) => (
                <div key={load.id} className="p-3 border rounded-lg bg-white space-y-3 relative group">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-rose-500"
                    onClick={() => removeLoad(load.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">#{idx + 1}</span>
                    <Select 
                      value={load.type} 
                      onValueChange={(v: any) => updateLoad(load.id, { 
                        type: v,
                        value2: v === 'trapezoidal' ? load.value : undefined,
                        start: v === 'trapezoidal' ? 0 : undefined,
                        end: v === 'trapezoidal' ? length : undefined
                      })}
                    >
                      <SelectTrigger className="h-7 text-xs border-none bg-transparent p-0 w-fit gap-1 focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="udl">UDL (N/mm)</SelectItem>
                        <SelectItem value="point">Point (N)</SelectItem>
                        <SelectItem value="trapezoidal">Trapezoidal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-slate-400">
                        {load.type === 'trapezoidal' ? 'w1 (N/mm)' : 'Value'}
                      </Label>
                      <Input 
                        type="number" 
                        value={load.value} 
                        onChange={(e) => updateLoad(load.id, { value: Number(e.target.value) })}
                        className="h-8 text-sm"
                      />
                    </div>
                    {load.type === 'point' && (
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-slate-400">Pos (mm)</Label>
                        <Input 
                          type="number" 
                          value={load.position} 
                          onChange={(e) => updateLoad(load.id, { position: Number(e.target.value) })}
                          className="h-8 text-sm"
                        />
                      </div>
                    )}
                    {load.type === 'trapezoidal' && (
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-slate-400">w2 (N/mm)</Label>
                        <Input 
                          type="number" 
                          value={load.value2 ?? load.value} 
                          onChange={(e) => updateLoad(load.id, { value2: Number(e.target.value) })}
                          className="h-8 text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {load.type === 'trapezoidal' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-slate-400">Start (mm)</Label>
                        <Input 
                          type="number" 
                          value={load.start ?? 0} 
                          onChange={(e) => updateLoad(load.id, { start: Number(e.target.value) })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-slate-400">End (mm)</Label>
                        <Input 
                          type="number" 
                          value={load.end ?? length} 
                          onChange={(e) => updateLoad(load.id, { end: Number(e.target.value) })}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {loads.length === 0 && (
                <div className="text-center py-8 text-slate-400 border-2 border-dashed rounded-lg">
                  <p className="text-sm">No loads applied</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results & Visuals */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard 
              label="Max Deflection" 
              value={`${results.summary.maxDeflection.toFixed(2)} mm`} 
              subValue={results.summary.deflectionRatio}
              icon={<Maximize2 className="w-4 h-4 text-blue-500" />}
            />
            <SummaryCard 
              label="Max Stress" 
              value={`${results.summary.maxStress.toFixed(1)} MPa`} 
              subValue={`Yield: ${MATERIALS[material].yield} MPa`}
              icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
              status={results.summary.maxStress > MATERIALS[material].yield ? 'fail' : 'pass'}
            />
            <SummaryCard 
              label="Max Moment" 
              value={`${(results.summary.maxMoment / 1000000).toFixed(2)} kNm`} 
              icon={<Layout className="w-4 h-4 text-purple-500" />}
            />
            <SummaryCard 
              label="Max Shear" 
              value={`${(results.summary.maxShear / 1000).toFixed(2)} kN`} 
              icon={<ChevronRight className="w-4 h-4 text-emerald-500" />}
            />
          </div>

          {/* Charts */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-0">
              <Tabs defaultValue="deflection" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-lg">Analysis Diagrams</CardTitle>
                  <TabsList>
                    <TabsTrigger value="deflection">Deflection</TabsTrigger>
                    <TabsTrigger value="moment">Moment</TabsTrigger>
                    <TabsTrigger value="shear">Shear</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="deflection" className="h-[400px] mt-0">
                  <ChartContainer 
                    data={results.points} 
                    dataKey="deflection" 
                    color="#3B82F6" 
                    unit="mm" 
                    label="Deflection"
                    invert
                  />
                </TabsContent>
                <TabsContent value="moment" className="h-[400px] mt-0">
                  <ChartContainer 
                    data={results.points} 
                    dataKey="moment" 
                    color="#8B5CF6" 
                    unit="Nmm" 
                    label="Bending Moment"
                    formatter={(v) => (v / 1000000).toFixed(2) + ' kNm'}
                  />
                </TabsContent>
                <TabsContent value="shear" className="h-[400px] mt-0">
                  <ChartContainer 
                    data={results.points} 
                    dataKey="shear" 
                    color="#10B981" 
                    unit="N" 
                    label="Shear Force"
                    formatter={(v) => (v / 1000).toFixed(2) + ' kN'}
                  />
                </TabsContent>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>X-Axis: Distance from Left Support (mm)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Info className="w-3 h-3" />
                  <span>Calculated at {results.points.length} points</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Beam Visualization */}
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Structural Model</CardTitle>
              <CardDescription>Simplified representation of supports and loads</CardDescription>
            </CardHeader>
            <CardContent className="h-48 relative flex items-center justify-center bg-slate-50">
              <div className="w-full max-w-2xl h-1 bg-slate-300 relative">
                {/* Supports */}
                <div className="absolute -bottom-4 left-0 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[15px] border-b-slate-600" />
                <div className="absolute -bottom-4 right-0 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[15px] border-b-slate-600" />
                
                {/* Loads Visualization */}
                {loads.map((load) => {
                  const left = load.type === 'udl' ? 0 : 
                             load.type === 'point' ? (load.position! / length) * 100 :
                             (load.start! / length) * 100;
                  const width_pct = load.type === 'udl' ? 100 :
                                   load.type === 'point' ? 0 :
                                   ((load.end! - load.start!) / length) * 100;

                  return (
                    <div 
                      key={load.id} 
                      className="absolute bottom-1"
                      style={{ 
                        left: `${left}%`,
                        width: load.type === 'point' ? 'auto' : `${width_pct}%`,
                        transform: load.type === 'point' ? 'translateX(-50%)' : 'none'
                      }}
                    >
                      {load.type === 'point' ? (
                        <div className="flex flex-col items-center">
                          <ChevronRight className="w-4 h-4 rotate-90 text-rose-500" />
                          <span className="text-[10px] font-bold text-rose-600">{load.value}N</span>
                        </div>
                      ) : load.type === 'udl' ? (
                        <div className="w-full flex flex-col items-center">
                          <div className="w-full h-4 border-t-2 border-x-2 border-rose-400/30 bg-rose-400/10 flex justify-around items-start pt-1">
                            {[...Array(10)].map((_, i) => (
                              <ChevronRight key={i} className="w-2 h-2 rotate-90 text-rose-400" />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-rose-600 mt-1">{load.value}N/mm</span>
                        </div>
                      ) : (
                        <div className="w-full flex flex-col items-center">
                          <div className="w-full h-8 relative">
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                              <polygon 
                                points={`0,32 0,${32 - (load.value * 10)} ${100},${32 - ((load.value2 ?? load.value) * 10)} 100,32`}
                                className="fill-rose-400/10 stroke-rose-400/30 stroke-2"
                                vectorEffect="non-scaling-stroke"
                              />
                            </svg>
                          </div>
                          <span className="text-[10px] font-bold text-rose-600 mt-1">
                            {load.value} → {load.value2 ?? load.value} N/mm
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-400">
                L = {length} mm
              </div>
            </CardContent>
          </Card>
          {/* Calculation Notes */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Calculation Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                    Assumptions
                  </h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Euler-Bernoulli beam theory applied.</li>
                    <li>Simply supported boundary conditions at both ends.</li>
                    <li>Linear elastic material behavior.</li>
                    <li>Small deflection theory (y &lt;&lt; L).</li>
                    <li>Shear deformation (Timoshenko) is neglected.</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                    Design Limits
                  </h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Deflection limit: L/175 (Facade standard).</li>
                    <li>Stress limit: Yield strength with safety factor 1.0.</li>
                    <li>Self-weight is not automatically included (add as UDL).</li>
                  </ul>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center pt-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Generated by FacadeCalc v1.0.0
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ label, value, subValue, icon, status }: { 
  label: string; 
  value: string; 
  subValue?: string; 
  icon: React.ReactNode;
  status?: 'pass' | 'fail';
}) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
          {icon}
        </div>
        <div className="text-lg font-bold tracking-tight">{value}</div>
        {subValue && (
          <div className={cn(
            "text-[10px] font-medium mt-1",
            status === 'fail' ? "text-rose-600" : "text-slate-400"
          )}>
            {subValue}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChartContainer({ data, dataKey, color, unit, label, invert = false, formatter }: { 
  data: any[]; 
  dataKey: string; 
  color: string; 
  unit: string;
  label: string;
  invert?: boolean;
  formatter?: (v: number) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis 
          dataKey="x" 
          type="number" 
          domain={[0, 'dataMax']} 
          tick={{ fontSize: 10, fill: '#94A3B8' }}
          axisLine={{ stroke: '#E2E8F0' }}
          tickLine={false}
        />
        <YAxis 
          reversed={invert}
          tick={{ fontSize: 10, fill: '#94A3B8' }}
          axisLine={{ stroke: '#E2E8F0' }}
          tickLine={false}
          tickFormatter={(v) => formatter ? formatter(v) : v.toFixed(1)}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#FFF', 
            border: '1px solid #E2E8F0', 
            borderRadius: '8px',
            fontSize: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
          formatter={(v: number) => [formatter ? formatter(v) : `${v.toFixed(2)} ${unit}`, label]}
          labelFormatter={(v) => `Pos: ${v.toFixed(0)} mm`}
        />
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          strokeWidth={2}
          fillOpacity={1} 
          fill={`url(#gradient-${dataKey})`} 
          animationDuration={500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
