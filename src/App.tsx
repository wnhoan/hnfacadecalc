/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
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
  Layout,
  Layers,
  PlusCircle,
  Globe,
  BookOpen
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

// Error fallback for robustness
function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            The calculation engine encountered an error. This might be due to invalid input values.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()} className="w-full">
            Reset Application
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

const MATERIALS = {
  aluminum_6063_t6: { name: 'Aluminum 6063-T6 (Extrusion)', e: 70000, yield: 160 },
  aluminum_3003_h14: { name: 'Aluminum 3003-H14 (Cladding)', e: 70000, yield: 145 },
  aluminum_5005_h34: { name: 'Aluminum 5005-H34 (Anodized)', e: 70000, yield: 135 },
  aluminum_5754_h22: { name: 'Aluminum 5754-H22 (High Strength)', e: 70000, yield: 190 },
  steel_s235: { name: 'Steel S235', e: 210000, yield: 235 },
  steel_s355: { name: 'Steel S355', e: 210000, yield: 355 },
  stainless_304: { name: 'Stainless Steel 304', e: 193000, yield: 205 },
  stainless_316: { name: 'Stainless Steel 316', e: 200000, yield: 215 },
  glass_annealed: { name: 'Glass (Annealed)', e: 70000, yield: 45 },
  glass_tempered: { name: 'Glass (Tempered)', e: 70000, yield: 120 },
  grc: { name: 'GRC Panel', e: 15000, yield: 8 },
  terracotta: { name: 'Terracotta', e: 30000, yield: 15 },
  custom: { name: 'Custom', e: 200000, yield: 200 },
};

const LOAD_CATEGORIES = {
  dead: { name: 'Dead Load (D)', color: 'text-slate-500', bg: 'bg-slate-100' },
  live: { name: 'Live Load (L)', color: 'text-blue-500', bg: 'bg-blue-100' },
  wind: { name: 'Wind Load (W)', color: 'text-emerald-500', bg: 'bg-emerald-100' },
  snow: { name: 'Snow Load (S)', color: 'text-cyan-500', bg: 'bg-cyan-100' },
};

const TRANSLATIONS = {
  en: {
    title: 'FacadeCalc',
    subtitle: 'Structural Analysis Tool',
    activeCase: 'Active Case',
    print: 'Print Report',
    valid: 'Design Valid',
    fail: 'Design Fails',
    combinations: 'Load Combinations',
    properties: 'Beam Properties',
    span: 'Span Length',
    material: 'Material',
    safetyFactor: 'Safety Factor',
    sectionType: 'Section Type',
    solid: 'Solid',
    hollow: 'Hollow',
    width: 'Width',
    height: 'Height',
    thickness: 'Thickness',
    loading: 'Applied Loads',
    results: 'Analysis Diagrams',
    deflection: 'Deflection',
    moment: 'Moment',
    shear: 'Shear',
    stress: 'Stress',
    structuralModel: 'Structural Model',
    notes: 'Calculation Notes',
    codes: 'Codes of Practice',
    assumptions: 'Assumptions',
    limits: 'Design Limits',
    materialProps: 'Material Properties',
    adjustSpan: 'Adjust Span Length',
  },
  zh: {
    title: '幕墙结构计算',
    subtitle: '结构分析工具',
    activeCase: '当前工况',
    print: '打印报告',
    valid: '设计合格',
    fail: '设计不合格',
    combinations: '荷载组合',
    properties: '梁构件属性',
    span: '跨度',
    material: '材料',
    safetyFactor: '安全系数',
    sectionType: '截面类型',
    solid: '实心',
    hollow: '空心',
    width: '宽度',
    height: '高度',
    thickness: '厚度',
    loading: '施加荷载',
    results: '分析图表',
    deflection: '挠度',
    moment: '弯矩',
    shear: '剪力',
    stress: '应力',
    structuralModel: '结构模型',
    notes: '计算说明',
    codes: '规范参考',
    assumptions: '计算假设',
    limits: '设计限值',
    materialProps: '材料属性',
    adjustSpan: '调整跨度',
  },
  th: {
    title: 'FacadeCalc',
    subtitle: 'เครื่องมือวิเคราะห์โครงสร้าง',
    activeCase: 'กรณีที่ใช้งาน',
    print: 'พิมพ์รายงาน',
    valid: 'การออกแบบผ่าน',
    fail: 'การออกแบบไม่ผ่าน',
    combinations: 'การรวมน้ำหนักบรรทุก',
    properties: 'คุณสมบัติของคาน',
    span: 'ความยาวช่วง',
    material: 'วัสดุ',
    safetyFactor: 'ตัวคูณความปลอดภัย',
    sectionType: 'ประเภทหน้าตัด',
    solid: 'ทึบ',
    hollow: 'กลวง',
    width: 'ความกว้าง',
    height: 'ความสูง',
    thickness: 'ความหนา',
    loading: 'น้ำหนักบรรทุกที่ใช้',
    results: 'แผนภาพการวิเคราะห์',
    deflection: 'การโก่งตัว',
    moment: 'โมเมนต์',
    shear: 'แรงเฉือน',
    stress: 'หน่วยแรง',
    structuralModel: 'แบบจำลองโครงสร้าง',
    notes: 'บันทึกการคำนวณ',
    codes: 'มาตรฐานการออกแบบ',
    assumptions: 'ข้อสมมติฐาน',
    limits: 'ขีดจำกัดการออกแบบ',
    materialProps: 'คุณสมบัติวัสดุ',
    adjustSpan: 'ปรับความยาวช่วง',
  },
  ms: {
    title: 'FacadeCalc',
    subtitle: 'Alat Analisis Struktur',
    activeCase: 'Kes Aktif',
    print: 'Cetak Laporan',
    valid: 'Reka Bentuk Sah',
    fail: 'Reka Bentuk Gagal',
    combinations: 'Kombinasi Beban',
    properties: 'Sifat Rasuk',
    span: 'Panjang Rentang',
    material: 'Bahan',
    safetyFactor: 'Faktor Keselamatan',
    sectionType: 'Jenis Keratan',
    solid: 'Padu',
    hollow: 'Berongga',
    width: 'Lebar',
    height: 'Tinggi',
    thickness: 'Ketebalan',
    loading: 'Beban Dikenakan',
    results: 'Diagram Analisis',
    deflection: 'Pesongan',
    moment: 'Momen',
    shear: ' ricih',
    stress: 'Tegasan',
    structuralModel: 'Model Struktur',
    notes: 'Nota Pengiraan',
    codes: 'Kod Amalan',
    assumptions: 'Andaian',
    limits: 'Had Reka Bentuk',
    materialProps: 'Sifat Bahan',
    adjustSpan: 'Laraskan Panjang Rentang',
  }
};

const CODES_OF_PRACTICE = [
  { country: 'Eurocodes (EU)', codes: ['EN 1990 (Basis of Design)', 'EN 1991 (Actions on Structures)', 'EN 1993 (Steel Design)', 'EN 1999 (Aluminum Design)', 'EN 16612 (Glass Strength)'] },
  { country: 'China (National)', codes: ['GB 50009-2012 (Load Code)', 'JGJ 102-2003 (Glass Curtain Wall)', 'GB 50017 (Steel Structure)'] },
  { country: 'Hong Kong', codes: ['CoP for Structural Use of Glass 2018', 'CoP on Wind Effects in HK 2019', 'CoP for Structural Use of Steel 2011'] },
  { country: 'Shanghai', codes: ['DGJ08-56 (Curtain Wall Engineering)', 'DGJ08-11 (Building Loads)', 'DGJ08-9 (Steel Structures)'] },
  { country: 'Shenzhen', codes: ['SZJG 48 (Glass Curtain Wall)', 'SZJG 54 (Metal/Stone Curtain Wall)', 'SJG 15 (Wind Loads)'] },
  { country: 'Guangzhou', codes: ['DBJ/T 15-30 (Curtain Wall Engineering)', 'DBJ 15-101 (Wind Load on Buildings)', 'GZJG (Municipal Guidelines)'] },
  { country: 'England', codes: ['BS EN 1991 (Eurocode 1: Actions)', 'BS EN 1999 (Eurocode 9: Aluminum)', 'BS EN 1993 (Eurocode 3: Steel)'] },
  { country: 'Thailand', codes: ['EIT Standard 1011-46 (Steel)', 'DPT Standard 1311-50 (Wind Load)', 'EIT 1015-40 (Aluminum)'] },
  { country: 'Malaysia', codes: ['MS 1553:2002 (Wind Load)', 'MS EN 1991 (Eurocode 1)', 'MS EN 1999 (Eurocode 9)'] },
];

interface Combination {
  id: string;
  name: string;
  factors: Record<keyof typeof LOAD_CATEGORIES, number>;
}

export function App() {
  // Beam State
  const [length, setLength] = useState(3000); // mm
  const [material, setMaterial] = useState<keyof typeof MATERIALS>('aluminum_6063_t6');
  const [sectionType, setSectionType] = useState<'solid' | 'hollow'>('hollow');
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(100);
  const [thickness, setThickness] = useState(3);
  const [safetyFactor, setSafetyFactor] = useState(1.5);

  // Loads State
  const [loads, setLoads] = useState<Load[]>([
    { id: '1', type: 'udl', category: 'dead', value: 0.5 },
  ]);

  // Combinations State
  const [combinations, setCombinations] = useState<Combination[]>([
    { id: 'c1', name: 'Serviceability (D+L)', factors: { dead: 1.0, live: 1.0, wind: 0, snow: 0 } },
    { id: 'c2', name: 'Ultimate (1.2D + 1.6L)', factors: { dead: 1.2, live: 1.6, wind: 0, snow: 0 } },
    { id: 'c3', name: 'Wind Dominant (D + W)', factors: { dead: 1.0, live: 0, wind: 1.0, snow: 0 } },
  ]);
  const [activeCombinationId, setActiveCombinationId] = useState('c1');
  const [lang, setLang] = useState<keyof typeof TRANSLATIONS>('en');
  const t = TRANSLATIONS[lang];

  // Calculations
  const sectionProps = useMemo(() => {
    if (sectionType === 'solid') {
      return calculateRectangularProperties(width, height);
    }
    return calculateHollowRectangularProperties(width, height, thickness);
  }, [width, height, thickness, sectionType]);

  const activeCombination = useMemo(() => 
    combinations.find(c => c.id === activeCombinationId) || combinations[0] || { id: 'default', name: 'Default', factors: { dead: 1, live: 0, wind: 0, snow: 0 } }
  , [combinations, activeCombinationId]);

  const factoredLoads = useMemo(() => {
    return loads.map(load => ({
      ...load,
      value: load.value * (activeCombination.factors[load.category] || 0),
      value2: load.value2 !== undefined ? load.value2 * (activeCombination.factors[load.category] || 0) : undefined,
    }));
  }, [loads, activeCombination]);

  const beamProps: BeamProperties = useMemo(() => ({
    length,
    elasticModulus: MATERIALS[material].e,
    momentOfInertia: sectionProps.momentOfInertia,
    sectionModulus: sectionProps.sectionModulus,
    yieldStrength: MATERIALS[material].yield,
    safetyFactor,
  }), [length, material, sectionProps, safetyFactor]);

  const results = useMemo(() => calculateBeam(beamProps, factoredLoads), [beamProps, factoredLoads]);

  const addLoad = (type: Load['type'] = 'point') => {
    const newLoad: Load = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      category: 'dead',
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

  const addCombination = () => {
    const newComb: Combination = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Combination',
      factors: { dead: 1.0, live: 0, wind: 0, snow: 0 }
    };
    setCombinations([...combinations, newComb]);
    setActiveCombinationId(newComb.id);
  };

  const updateCombinationFactor = (id: string, category: keyof typeof LOAD_CATEGORIES, factor: number) => {
    setCombinations(combinations.map(c => 
      c.id === id ? { ...c, factors: { ...c.factors, [category]: factor } } : c
    ));
  };

  const updateCombinationName = (id: string, name: string) => {
    setCombinations(combinations.map(c => c.id === id ? { ...c, name } : c));
  };

  const removeCombination = (id: string) => {
    if (combinations.length <= 1) return;
    const newCombs = combinations.filter(c => c.id !== id);
    setCombinations(newCombs);
    if (activeCombinationId === id) setActiveCombinationId(newCombs[0].id);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 min-h-16 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg md:text-xl tracking-tight">{t.title}</h1>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider hidden sm:block">{t.subtitle}</p>
              </div>
            </div>
            <div className={cn(
              "flex md:hidden items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold border",
              results.summary.status === 'pass' 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-rose-50 text-rose-700 border-rose-200"
            )}>
              {results.summary.status === 'pass' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {results.summary.status === 'pass' ? t.valid.split(' ')[1].toUpperCase() : t.fail.split(' ')[1].toUpperCase()}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border flex-1 md:flex-none">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
              <Select value={lang} onValueChange={(v: any) => setLang(v)}>
                <SelectTrigger className="h-8 border-none bg-white shadow-none focus:ring-0 w-full md:w-[100px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="th">ไทย</SelectItem>
                  <SelectItem value="ms">Melayu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border flex-1 md:flex-none">
              <span className="text-[10px] font-bold uppercase px-2 text-slate-500 hidden lg:block">{t.activeCase}:</span>
              <Select value={activeCombinationId} onValueChange={setActiveCombinationId}>
                <SelectTrigger className="h-8 border-none bg-white shadow-none focus:ring-0 w-full md:min-w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {combinations.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2 h-8 text-xs flex-1 md:flex-none">
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.print}</span>
              <span className="sm:hidden">Print</span>
            </Button>
            <div className={cn(
              "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border",
              results.summary.status === 'pass' 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-rose-50 text-rose-700 border-rose-200"
            )}>
              {results.summary.status === 'pass' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {results.summary.status === 'pass' ? t.valid : t.fail}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          
          {/* Combinations Manager */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">{t.combinations}</span>
                </div>
                <CardTitle className="text-lg">{t.combinations.split(' ')[1]}</CardTitle>
              </div>
              <Button size="icon" variant="outline" onClick={addCombination} className="h-8 w-8">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {combinations.map(comb => (
                  <div key={comb.id} className={cn(
                    "p-3 border rounded-lg transition-all",
                    activeCombinationId === comb.id ? "border-blue-500 bg-blue-50/30 ring-1 ring-blue-500" : "bg-white"
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <Input 
                        value={comb.name ?? ''} 
                        onChange={(e) => updateCombinationName(comb.id, e.target.value)}
                        className="h-7 text-xs font-bold border-none bg-transparent p-0 focus-visible:ring-0"
                      />
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-slate-400 hover:text-rose-500"
                          onClick={() => removeCombination(comb.id)}
                          disabled={combinations.length <= 1}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant={activeCombinationId === comb.id ? "default" : "ghost"} 
                          size="sm" 
                          className="h-6 text-[10px] px-2"
                          onClick={() => setActiveCombinationId(comb.id)}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {Object.entries(LOAD_CATEGORIES).map(([key, cat]) => (
                        <div key={key} className="space-y-1">
                          <Label className="text-[9px] uppercase text-slate-400 block text-center">{key[0].toUpperCase()}</Label>
                          <Input 
                            type="number" 
                            step="0.1"
                            value={comb.factors[key as keyof typeof LOAD_CATEGORIES] ?? 0} 
                            onChange={(e) => updateCombinationFactor(comb.id, key as keyof typeof LOAD_CATEGORIES, Number(e.target.value))}
                            className="h-6 text-[10px] text-center p-0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Geometry & Material */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Settings2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{t.properties}</span>
              </div>
              <CardTitle className="text-lg">{t.properties}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="length">{t.span} (mm)</Label>
                <Input 
                  id="length" 
                  type="number" 
                  min="0"
                  value={length ?? 0} 
                  onChange={(e) => setLength(Math.max(0, Number(e.target.value)))}
                  className="bg-slate-50/50"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>{t.material}</Label>
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
                <Label htmlFor="safetyFactor">{t.safetyFactor} (γ)</Label>
                <Input 
                  id="safetyFactor" 
                  type="number" 
                  step="0.1"
                  value={safetyFactor ?? 1} 
                  onChange={(e) => setSafetyFactor(Number(e.target.value))}
                  className="bg-slate-50/50"
                />
              </div>

              <Separator className="my-2" />

              <div className="grid gap-2">
                <Label>{t.sectionType}</Label>
                <Tabs value={sectionType} onValueChange={(v: any) => setSectionType(v)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="solid">{t.solid}</TabsTrigger>
                    <TabsTrigger value="hollow">{t.hollow}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="width">{t.width} (mm)</Label>
                  <Input 
                    id="width" 
                    type="number" 
                    min="0"
                    value={width ?? 0} 
                    onChange={(e) => setWidth(Math.max(0, Number(e.target.value)))}
                    className="bg-slate-50/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="height">{t.height} (mm)</Label>
                  <Input 
                    id="height" 
                    type="number" 
                    min="0"
                    value={height ?? 0} 
                    onChange={(e) => setHeight(Math.max(0, Number(e.target.value)))}
                    className="bg-slate-50/50"
                  />
                </div>
              </div>

              {sectionType === 'hollow' && (
                <div className="grid gap-2">
                  <Label htmlFor="thickness">{t.thickness} (mm)</Label>
                  <Input 
                    id="thickness" 
                    type="number" 
                    value={thickness ?? 0} 
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
          
          {/* Material Properties */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Info className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{t.materialProps}</span>
              </div>
              <CardTitle className="text-lg">{MATERIALS[material].name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-slate-400">Young's Modulus (E)</Label>
                  <div className="text-sm font-semibold bg-slate-50 p-2 rounded border border-slate-100">
                    {MATERIALS[material].e.toLocaleString()} MPa
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-slate-400">Yield Strength (σy)</Label>
                  <div className="text-sm font-semibold bg-slate-50 p-2 rounded border border-slate-100">
                    {MATERIALS[material].yield.toLocaleString()} MPa
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Codes of Practice */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{t.codes}</span>
              </div>
              <CardTitle className="text-lg">Reference Standards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {CODES_OF_PRACTICE.map((item) => (
                <div key={item.country} className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">{item.country}</h4>
                  <ul className="text-[10px] text-slate-500 list-disc list-inside">
                    {item.codes.map((code, idx) => (
                      <li key={idx}>{code}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Loads */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">{t.loading}</span>
                </div>
                <CardTitle className="text-lg">{t.loading}</CardTitle>
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
                  
                  <div className="flex items-center justify-between">
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
                    
                    <Select 
                      value={load.category} 
                      onValueChange={(v: any) => updateLoad(load.id, { category: v })}
                    >
                      <SelectTrigger className={cn(
                        "h-6 text-[10px] font-bold px-2 rounded-full border-none focus:ring-0 w-fit",
                        LOAD_CATEGORIES[load.category].bg,
                        LOAD_CATEGORIES[load.category].color
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(LOAD_CATEGORIES).map(([key, cat]) => (
                          <SelectItem key={key} value={key}>{cat.name}</SelectItem>
                        ))}
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
                        value={load.value ?? 0} 
                        onChange={(e) => updateLoad(load.id, { value: Number(e.target.value) })}
                        className="h-8 text-sm"
                      />
                    </div>
                    {load.type === 'point' && (
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-slate-400">Pos (mm)</Label>
                        <Input 
                          type="number" 
                          value={load.position ?? 0} 
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
              status={results.summary.deflectionRatio.includes('L/') && parseInt(results.summary.deflectionRatio.split('/')[1]) < 175 ? 'fail' : 'pass'}
            />
            <SummaryCard 
              label="Max Stress" 
              value={`${results.summary.maxStress.toFixed(1)} MPa`} 
              subValue={`Yield: ${MATERIALS[material].yield} MPa`}
              icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
              status={results.summary.maxStress > (MATERIALS[material].yield / safetyFactor) ? 'fail' : 'pass'}
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                  <CardTitle className="text-lg">{t.results}</CardTitle>
                  <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
                    <TabsTrigger value="deflection" className="text-[10px] sm:text-xs">{t.deflection}</TabsTrigger>
                    <TabsTrigger value="moment" className="text-[10px] sm:text-xs">{t.moment}</TabsTrigger>
                    <TabsTrigger value="shear" className="text-[10px] sm:text-xs">{t.shear}</TabsTrigger>
                    <TabsTrigger value="stress" className="text-[10px] sm:text-xs">{t.stress}</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="deflection" className="h-[300px] sm:h-[400px] mt-0">
                  <ChartContainer 
                    data={results.points} 
                    dataKey="deflection" 
                    color="#3B82F6" 
                    unit="mm" 
                    label="Deflection"
                    invert
                  />
                </TabsContent>
                <TabsContent value="moment" className="h-[300px] sm:h-[400px] mt-0">
                  <ChartContainer 
                    data={results.points} 
                    dataKey="moment" 
                    color="#8B5CF6" 
                    unit="Nmm" 
                    label="Bending Moment"
                    formatter={(v) => (v / 1000000).toFixed(2) + ' kNm'}
                  />
                </TabsContent>
                <TabsContent value="shear" className="h-[300px] sm:h-[400px] mt-0">
                  <ChartContainer 
                    data={results.points} 
                    dataKey="shear" 
                    color="#10B981" 
                    unit="kN" 
                    label="Shear Force"
                    formatter={(v) => (v / 1000).toFixed(2) + ' kN'}
                  />
                </TabsContent>
                <TabsContent value="stress" className="h-[300px] sm:h-[400px] mt-0">
                  <ChartContainer 
                    data={results.points} 
                    dataKey="stress" 
                    color="#F59E0B" 
                    unit="MPa" 
                    label="Bending Stress"
                    formatter={(v) => v.toFixed(1) + ' MPa'}
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
              <CardTitle className="text-lg">{t.structuralModel}</CardTitle>
              <CardDescription>Simplified representation of supports and loads</CardDescription>
            </CardHeader>
            <CardContent className="h-48 relative flex items-center justify-center bg-slate-50 px-8 sm:px-12">
              <div className="w-full h-1 bg-slate-300 relative">
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
            <CardFooter className="bg-slate-50 border-t px-6 py-4">
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.adjustSpan}</Label>
                  <span className="text-sm font-mono font-bold text-blue-600">{length} mm</span>
                </div>
                <Slider 
                  value={[length ?? 3000]} 
                  onValueChange={(vals) => setLength(vals[0] ?? 3000)} 
                  min={500} 
                  max={10000} 
                  step={50}
                />
              </div>
            </CardFooter>
          </Card>
          {/* Calculation Notes */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">{t.notes}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                    {t.assumptions}
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
                    {t.limits}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Deflection limit: L/175 (Facade standard).</li>
                    <li>Stress limit: Yield strength / Safety Factor (γ).</li>
                    <li>Supported Loads: Dead (D), Live (L), Wind (W), Snow (S).</li>
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

export default function Root() {
  return <App />;
}

function SummaryCard({ label, value, subValue, icon, status }: { 
  label: string; 
  value: string; 
  subValue?: string; 
  icon: React.ReactNode;
  status?: 'pass' | 'fail';
}) {
  return (
    <Card className="shadow-sm border-slate-200 overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate mr-1">{label}</span>
          <div className="shrink-0">{icon}</div>
        </div>
        <div className="text-sm sm:text-lg font-bold tracking-tight truncate">{value}</div>
        {subValue && (
          <div className={cn(
            "text-[9px] sm:text-[10px] font-medium mt-1 truncate",
            status === 'fail' ? "text-rose-600" : status === 'pass' ? "text-emerald-600" : "text-slate-400"
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
