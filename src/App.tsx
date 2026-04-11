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
  BookOpen,
  Activity,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Printer,
  Save,
  FolderOpen
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
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
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
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
  aluminum_6063_t5: { name: 'Aluminum 6063-T5', e: 70000, yield: 110 },
  aluminum_6061_t6: { name: 'Aluminum 6061-T6 (High Strength)', e: 70000, yield: 240 },
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
  wind: { name: 'Wind Load (W)', color: 'text-green-500', bg: 'bg-green-100' },
  snow: { name: 'Snow Load (S)', color: 'text-cyan-500', bg: 'bg-cyan-100' },
  seismic: { name: 'Seismic Load (E)', color: 'text-rose-500', bg: 'bg-rose-100' },
};

const SEISMIC_REGIONS = {
  china: { name: 'China (GB 50011)', coeff: 0.16, desc: 'Intensity 7, αmax=0.16' },
  eurocode: { name: 'Eurocode (EN 1998)', coeff: 0.15, desc: 'ag=0.15g, S=1.2' },
  hongkong: { name: 'Hong Kong (CoP)', coeff: 0.12, desc: 'ag=0.12g' },
  thailand: { name: 'Thailand (DPT)', coeff: 0.10, desc: 'Zone 1' },
  malaysia: { name: 'Malaysia (MS EN)', coeff: 0.07, desc: 'ag=0.07g' },
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
    seismic: 'Seismic Analysis',
    seismicRegion: 'Seismic Region',
    seismicCoeff: 'Seismic Coeff (Cs)',
    applySeismic: 'Apply Seismic Load',
    saveProject: 'Save Project',
    loadProject: 'Load Project',
    projectSaved: 'Project saved to local storage',
    projectLoaded: 'Project loaded successfully',
    noProject: 'No saved project found',
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
    seismic: '地震分析',
    seismicRegion: '地震区域',
    seismicCoeff: '地震系数 (Cs)',
    applySeismic: '应用地震荷载',
    saveProject: '保存项目',
    loadProject: '加载项目',
    projectSaved: '项目已保存到本地存储',
    projectLoaded: '项目加载成功',
    noProject: '未找到保存的项目',
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
    seismic: 'การวิเคราะห์แผ่นดินไหว',
    seismicRegion: 'ภูมิภาคแผ่นดินไหว',
    seismicCoeff: 'สัมประสิทธิ์แผ่นดินไหว (Cs)',
    applySeismic: 'ใช้น้ำหนักบรรทุกแผ่นดินไหว',
    saveProject: 'บันทึกโครงการ',
    loadProject: 'โหลดโครงการ',
    projectSaved: 'บันทึกโครงการลงในที่เก็บข้อมูลในตัวเครื่องแล้ว',
    projectLoaded: 'โหลดโครงการสำเร็จแล้ว',
    noProject: 'ไม่พบโครงการที่บันทึกไว้',
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
    seismic: 'Analisis Seismik',
    seismicRegion: 'Wilayah Seismik',
    seismicCoeff: 'Pekali Seismik (Cs)',
    applySeismic: 'Gunakan Beban Seismik',
    saveProject: 'Simpan Projek',
    loadProject: 'Muat Projek',
    projectSaved: 'Projek disimpan ke storan tempatan',
    projectLoaded: 'Projek berjaya dimuatkan',
    noProject: 'Tiada projek yang disimpan ditemui',
  }
};

const CODES_OF_PRACTICE = [
  { country: 'Eurocodes (EU)', codes: ['EN 1990 (Basis of Design)', 'EN 1991 (Actions)', 'EN 1993 (Steel)', 'EN 1999 (Aluminum)', 'EN 1998 (Seismic)'] },
  { country: 'China (National)', codes: ['GB 50009 (Loads)', 'JGJ 102 (Curtain Wall)', 'GB 50011 (Seismic)', 'GB 50017 (Steel)'] },
  { country: 'Hong Kong', codes: ['CoP for Glass 2018', 'CoP on Wind 2019', 'CoP for Seismic Design 2024'] },
  { country: 'Shanghai', codes: ['DGJ08-56 (Curtain Wall)', 'DGJ08-11 (Loads)', 'DGJ08-9 (Steel)'] },
  { country: 'Shenzhen', codes: ['SZJG 48 (Glass)', 'SZJG 54 (Metal/Stone)', 'SJG 15 (Wind)'] },
  { country: 'Guangzhou', codes: ['DBJ/T 15-30 (Curtain Wall)', 'DBJ 15-101 (Wind)', 'GZJG (Guidelines)'] },
  { country: 'England', codes: ['BS EN 1991 (Actions)', 'BS EN 1999 (Aluminum)', 'BS EN 1998 (Seismic)'] },
  { country: 'Thailand', codes: ['EIT 1011-46 (Steel)', 'DPT 1311-50 (Wind)', 'DPT 1301/1302 (Seismic)'] },
  { country: 'Malaysia', codes: ['MS 1553 (Wind)', 'MS EN 1991 (EC1)', 'MS EN 1998 (Seismic)'] },
];

interface Combination {
  id: string;
  name: string;
  factors: Record<keyof typeof LOAD_CATEGORIES, number>;
}

// Helper for robust number parsing
const safeParseNumber = (val: string | number, fallback: number = 0): number => {
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? fallback : parsed;
};

export function App() {
  // Beam State
  const [length, setLength] = useState(3000); // mm
  const [material, setMaterial] = useState<keyof typeof MATERIALS>('aluminum_6063_t6');
  const [sectionType, setSectionType] = useState<'solid' | 'hollow'>('hollow');
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(100);
  const [thickness, setThickness] = useState(3);
  const [safetyFactor, setSafetyFactor] = useState(1.5);
  const [selectedCodeId, setSelectedCodeId] = useState<string>('Eurocodes (EU)');
  const [hoveredLoad, setHoveredLoad] = useState<Load | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Loads State
  const [loads, setLoads] = useState<Load[]>([
    { id: '1', type: 'udl', category: 'dead', value: 0.5 },
  ]);

  // Combinations State
  const [combinations, setCombinations] = useState<Combination[]>([
    { id: 'c1', name: 'Serviceability (D+L)', factors: { dead: 1.0, live: 1.0, wind: 0, snow: 0, seismic: 0 } },
    { id: 'c2', name: 'Ultimate (1.2D + 1.6L)', factors: { dead: 1.2, live: 1.6, wind: 0, snow: 0, seismic: 0 } },
    { id: 'c3', name: 'Wind Dominant (D + W)', factors: { dead: 1.0, live: 0, wind: 1.0, snow: 0, seismic: 0 } },
    { id: 'c4', name: 'Seismic Dominant (D + E)', factors: { dead: 1.0, live: 0.5, wind: 0, snow: 0, seismic: 1.0 } },
  ]);
  const [activeCombinationId, setActiveCombinationId] = useState('c1');
  const [activeTab, setActiveTab] = useState('deflection');
  const [isChartExpanded, setIsChartExpanded] = useState(false);
  const [lang, setLang] = useState<keyof typeof TRANSLATIONS>('en');
  const t = TRANSLATIONS[lang];

  // Seismic State
  const [seismicRegion, setSeismicRegion] = useState<keyof typeof SEISMIC_REGIONS>('china');
  const [seismicCoeff, setSeismicCoeff] = useState(SEISMIC_REGIONS.china.coeff);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto-clear notification
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Calculations
  const sectionProps = useMemo(() => {
    if (sectionType === 'solid') {
      return calculateRectangularProperties(width, height);
    }
    return calculateHollowRectangularProperties(width, height, thickness);
  }, [width, height, thickness, sectionType]);

  const activeCombination = useMemo(() => 
    combinations.find(c => c.id === activeCombinationId) || combinations[0] || { id: 'default', name: 'Default', factors: { dead: 1, live: 0, wind: 0, snow: 0, seismic: 0 } }
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

  const results = useMemo(() => {
    try {
      if (length <= 0 || !activeCombination) throw new Error('Invalid inputs');
      return calculateBeam(beamProps, factoredLoads);
    } catch (error) {
      console.error('Calculation error:', error);
      return {
        points: [],
        summary: {
          maxDeflection: 0,
          maxMoment: 0,
          maxShear: 0,
          maxStress: 0,
          deflectionRatio: 'N/A',
          status: 'fail' as const
        }
      };
    }
  }, [beamProps, factoredLoads, length, activeCombination]);

  const addLoad = (type: Load['type'] = 'point', category: Load['category'] = 'dead', value?: number) => {
    const newLoad: Load = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      category,
      value: value ?? (type === 'point' ? 1000 : 0.5),
      position: type === 'point' ? length / 2 : undefined,
      value2: type === 'trapezoidal' ? 0.5 : undefined,
      start: type === 'trapezoidal' ? 0 : undefined,
      end: type === 'trapezoidal' ? length : undefined,
    };
    setLoads([...loads, newLoad]);
  };

  const totalDeadMagnitude = useMemo(() => {
    return loads
      .filter(l => l.category === 'dead')
      .reduce((sum, l) => {
        const v1 = safeParseNumber(l.value, 0);
        const v2 = safeParseNumber(l.value2 ?? l.value, v1);
        if (l.type === 'udl') return sum + (v1 * length);
        if (l.type === 'point') return sum + v1;
        if (l.type === 'trapezoidal') {
          const x1 = safeParseNumber(l.start ?? 0, 0);
          const x2 = safeParseNumber(l.end ?? length, length);
          return sum + (0.5 * (v1 + v2) * Math.max(0, x2 - x1));
        }
        return sum;
      }, 0);
  }, [loads, length]);

  const applySeismicLoad = () => {
    // Seismic load as UDL: Fs = (Dead * Cs) / L
    const seismicValue = (totalDeadMagnitude * seismicCoeff) / Math.max(1, length);
    addLoad('udl', 'seismic', Number(seismicValue.toFixed(4)));
  };

  const removeLoad = (id: string) => {
    setLoads(loads.filter(l => l.id !== id));
  };

  const updateLoad = (id: string, updates: Partial<Load>) => {
    setLoads(loads.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const exportToCSV = () => {
    const headers = ['Distance (mm)', 'Deflection (mm)', 'Moment (Nmm)', 'Shear (N)', 'Stress (MPa)'];
    const rows = results.points.map(p => [
      p.x.toFixed(2),
      p.deflection.toFixed(4),
      p.moment.toFixed(2),
      p.shear.toFixed(2),
      p.stress.toFixed(4)
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `FacadeCalc_Analysis_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const data = {
      project: {
        name: t.title,
        date: new Date().toISOString(),
        combination: activeCombination.name,
        designCode: selectedCodeId
      },
      beam: {
        length,
        material,
        sectionType,
        width,
        height,
        thickness,
        safetyFactor
      },
      loads,
      results: {
        summary: results.summary
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FacadeCalc_Report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const addCombination = () => {
    const newComb: Combination = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Combination',
      factors: { dead: 1.0, live: 0, wind: 0, snow: 0, seismic: 0 }
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

  const saveProject = () => {
    const projectData = {
      length,
      material,
      sectionType,
      width,
      height,
      thickness,
      safetyFactor,
      selectedCodeId,
      loads,
      combinations,
      activeCombinationId,
      seismicRegion,
      seismicCoeff
    };
    localStorage.setItem('facadecalc_project', JSON.stringify(projectData));
    setNotification({ message: t.projectSaved, type: 'success' });
  };

  const loadProject = () => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.length !== undefined) setLength(data.length);
        if (data.material) setMaterial(data.material);
        if (data.sectionType) setSectionType(data.sectionType);
        if (data.width !== undefined) setWidth(data.width);
        if (data.height !== undefined) setHeight(data.height);
        if (data.thickness !== undefined) setThickness(data.thickness);
        if (data.safetyFactor !== undefined) setSafetyFactor(data.safetyFactor);
        if (data.selectedCodeId) setSelectedCodeId(data.selectedCodeId);
        if (data.loads) setLoads(data.loads);
        if (data.combinations) setCombinations(data.combinations);
        if (data.activeCombinationId) setActiveCombinationId(data.activeCombinationId);
        if (data.seismicRegion) setSeismicRegion(data.seismicRegion);
        if (data.seismicCoeff !== undefined) setSeismicCoeff(data.seismicCoeff);
        setNotification({ message: t.projectLoaded, type: 'success' });
      } catch (e) {
        console.error("Failed to load project", e);
        setNotification({ message: 'Error loading project', type: 'error' });
      }
    } else {
      setNotification({ message: t.noProject, type: 'error' });
    }
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
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-red-50 text-red-700 border-red-200"
            )}>
              {results.summary.status === 'pass' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {results.summary.status === 'pass' ? t.valid.split(' ')[1].toUpperCase() : t.fail.split(' ')[1].toUpperCase()}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={saveProject}
                className="gap-2 h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.saveProject}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadProject}
                className="gap-2 h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.loadProject}</span>
              </Button>
            </div>

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
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" size="sm" className="gap-2 h-8 text-xs flex-1 md:flex-none border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.print}</span>
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.print()} className="gap-2">
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>Print / Save as PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToCSV} className="gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-green-500" />
                    <span>Export Data (CSV)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToJSON} className="gap-2">
                    <FileJson className="w-4 h-4 text-amber-500" />
                    <span>Export Report (JSON)</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className={cn(
              "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border",
              results.summary.status === 'pass' 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-red-50 text-red-700 border-red-200"
            )}>
              {results.summary.status === 'pass' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {results.summary.status === 'pass' ? t.valid : t.fail}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={cn(
              "fixed top-16 left-1/2 z-[100] px-4 py-2 rounded-full shadow-lg border text-xs font-bold flex items-center gap-2",
              notification.type === 'success' 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-red-50 text-red-700 border-red-200"
            )}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        
        {/* Print Only Header */}
        <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
              <p className="text-slate-500 font-medium">{t.subtitle}</p>
              <div className="mt-6 grid grid-cols-2 gap-x-16 gap-y-3 text-sm">
                <div className="flex gap-2"><span className="font-bold text-slate-700">Date:</span> <span>{new Date().toLocaleDateString()}</span></div>
                <div className="flex gap-2"><span className="font-bold text-slate-700">Design Code:</span> <span className="text-blue-700 font-bold">{selectedCodeId}</span></div>
                <div className="flex gap-2"><span className="font-bold text-slate-700">Combination:</span> <span>{activeCombination.name}</span></div>
                <div className="flex gap-2"><span className="font-bold text-slate-700">Material:</span> <span>{MATERIALS[material].name}</span></div>
                <div className="flex gap-2"><span className="font-bold text-slate-700">Span:</span> <span>{length} mm</span></div>
                <div className="flex gap-2"><span className="font-bold text-slate-700">Section:</span> <span>{sectionType === 'hollow' ? `${width}x${height}x${thickness}mm` : `${width}x${height}mm`}</span></div>
              </div>
            </div>
            <div className={cn(
              "px-6 py-4 rounded-xl border-4 font-black text-2xl tracking-tighter",
              results.summary.status === 'pass' ? "border-green-500 text-green-600 bg-green-50" : "border-red-500 text-red-600 bg-red-50"
            )}>
              {results.summary.status === 'pass' ? "PASS" : "FAIL"}
            </div>
          </div>
        </div>

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
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
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
                  onChange={(e) => setLength(Math.max(0, safeParseNumber(e.target.value, length)))}
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
                  onChange={(e) => setSafetyFactor(Math.max(0.1, safeParseNumber(e.target.value, safetyFactor)))}
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
                    onChange={(e) => setWidth(Math.max(0, safeParseNumber(e.target.value, width)))}
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
                    onChange={(e) => setHeight(Math.max(0, safeParseNumber(e.target.value, height)))}
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
                    onChange={(e) => setThickness(Math.max(0, safeParseNumber(e.target.value, thickness)))}
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
              <CardTitle className="text-lg">Select Design Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {CODES_OF_PRACTICE.map((item) => (
                <div 
                  key={item.country} 
                  className={cn(
                    "space-y-1 p-2 rounded-lg border transition-all cursor-pointer",
                    selectedCodeId === item.country 
                      ? "bg-blue-50 border-blue-200 ring-1 ring-blue-200" 
                      : "border-transparent hover:bg-slate-50 hover:border-slate-200"
                  )}
                  onClick={() => setSelectedCodeId(item.country)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{item.country}</h4>
                    {selectedCodeId === item.country && (
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    )}
                  </div>
                  <ul className="text-[10px] text-slate-500 list-disc list-inside">
                    {item.codes.map((code, idx) => (
                      <li key={idx}>{code}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Seismic Analysis */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-rose-600 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{t.seismic}</span>
              </div>
              <CardTitle className="text-lg">{t.seismic}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>{t.seismicRegion}</Label>
                <Select 
                  value={seismicRegion} 
                  onValueChange={(v: any) => {
                    setSeismicRegion(v);
                    setSeismicCoeff(SEISMIC_REGIONS[v as keyof typeof SEISMIC_REGIONS].coeff);
                  }}
                >
                  <SelectTrigger className="bg-slate-50/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SEISMIC_REGIONS).map(([key, region]) => (
                      <SelectItem key={key} value={key}>{region.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-slate-400 italic">
                  {SEISMIC_REGIONS[seismicRegion].desc}
                </p>
              </div>

              <div className="grid gap-2">
                <Label>{t.seismicCoeff}</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={seismicCoeff} 
                    onChange={(e) => setSeismicCoeff(Number(e.target.value))}
                    className="bg-slate-50/50"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shrink-0 gap-2 h-10 border-rose-200 text-rose-600 hover:bg-rose-50"
                    onClick={applySeismicLoad}
                  >
                    <PlusCircle className="w-4 h-4" />
                    {t.applySeismic}
                  </Button>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                  <span>Total Dead Load:</span>
                  <span>{(totalDeadMagnitude / 1000).toFixed(2)} kN</span>
                </div>
              </div>
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
                        onChange={(e) => updateLoad(load.id, { value: safeParseNumber(e.target.value, load.value) })}
                        className="h-8 text-sm"
                      />
                    </div>
                    {load.type === 'point' && (
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-slate-400">Pos (mm)</Label>
                        <Input 
                          type="number" 
                          value={load.position ?? 0} 
                          onChange={(e) => updateLoad(load.id, { position: safeParseNumber(e.target.value, load.position ?? 0) })}
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
                          onChange={(e) => updateLoad(load.id, { value2: safeParseNumber(e.target.value, load.value2 ?? load.value) })}
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
                          onChange={(e) => updateLoad(load.id, { start: safeParseNumber(e.target.value, load.start ?? 0) })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-slate-400">End (mm)</Label>
                        <Input 
                          type="number" 
                          value={load.end ?? length} 
                          onChange={(e) => updateLoad(load.id, { end: safeParseNumber(e.target.value, load.end ?? length) })}
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
              status={results.summary.maxDeflection > (length / 175) ? 'fail' : 'pass'}
              onClick={() => setActiveTab('deflection')}
              active={activeTab === 'deflection'}
            />
            <SummaryCard 
              label="Max Stress" 
              value={`${results.summary.maxStress.toFixed(1)} MPa`} 
              subValue={`Yield: ${MATERIALS[material].yield} MPa`}
              icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
              status={results.summary.maxStress > (MATERIALS[material].yield / Math.max(0.1, safetyFactor)) ? 'fail' : 'pass'}
              onClick={() => setActiveTab('stress')}
              active={activeTab === 'stress'}
            />
            <SummaryCard 
              label="Max Moment" 
              value={`${(results.summary.maxMoment / 1000000).toFixed(2)} kNm`} 
              icon={<Layout className="w-4 h-4 text-purple-500" />}
              onClick={() => setActiveTab('moment')}
              active={activeTab === 'moment'}
            />
            <SummaryCard 
              label="Max Shear" 
              value={`${(results.summary.maxShear / 1000).toFixed(2)} kN`} 
              icon={<ChevronRight className="w-4 h-4 text-green-500" />}
              onClick={() => setActiveTab('shear')}
              active={activeTab === 'shear'}
            />
          </div>

          {/* Charts */}
          <Card className={cn(
            "shadow-sm border-slate-200 transition-all duration-300",
            isChartExpanded ? "fixed inset-0 z-[100] bg-white rounded-none border-none" : ""
          )}>
            <CardHeader className={cn("pb-0", isChartExpanded ? "p-6" : "")}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{t.results}</CardTitle>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={cn(
                        "h-8 w-8 transition-colors",
                        isChartExpanded ? "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100" : "text-slate-400 hover:text-blue-600"
                      )}
                      onClick={() => setIsChartExpanded(!isChartExpanded)}
                      title={isChartExpanded ? "Collapse" : "Expand"}
                    >
                      {isChartExpanded ? <Maximize2 className="w-4 h-4 rotate-180" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                  </div>
                  <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
                    <TabsTrigger value="deflection" className="text-[10px] sm:text-xs">{t.deflection}</TabsTrigger>
                    <TabsTrigger value="moment" className="text-[10px] sm:text-xs">{t.moment}</TabsTrigger>
                    <TabsTrigger value="shear" className="text-[10px] sm:text-xs">{t.shear}</TabsTrigger>
                    <TabsTrigger value="stress" className="text-[10px] sm:text-xs">{t.stress}</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="deflection" className={cn("mt-0", isChartExpanded ? "h-[calc(100vh-180px)]" : "h-[300px] sm:h-[400px]")}>
                  <ChartContainer 
                    data={results.points} 
                    dataKey="deflection" 
                    color="#3B82F6" 
                    unit="mm" 
                    label="Deflection"
                    invert
                  />
                </TabsContent>
                <TabsContent value="moment" className={cn("mt-0", isChartExpanded ? "h-[calc(100vh-180px)]" : "h-[300px] sm:h-[400px]")}>
                  <ChartContainer 
                    data={results.points} 
                    dataKey="moment" 
                    color="#8B5CF6" 
                    unit="Nmm" 
                    label="Bending Moment"
                    formatter={(v) => (v / 1000000).toFixed(2) + ' kNm'}
                  />
                </TabsContent>
                <TabsContent value="shear" className={cn("mt-0", isChartExpanded ? "h-[calc(100vh-180px)]" : "h-[300px] sm:h-[400px]")}>
                  <ChartContainer 
                    data={results.points} 
                    dataKey="shear" 
                    color="#10B981" 
                    unit="kN" 
                    label="Shear Force"
                    formatter={(v) => (v / 1000).toFixed(2) + ' kN'}
                  />
                </TabsContent>
                <TabsContent value="stress" className={cn("mt-0", isChartExpanded ? "h-[calc(100vh-180px)]" : "h-[300px] sm:h-[400px]")}>
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
            <CardContent className="h-64 relative flex items-center justify-center bg-slate-50 px-4 sm:px-8">
              <svg 
                className="w-full h-full overflow-visible" 
                viewBox="0 0 1000 250" 
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Definitions for gradients and patterns */}
                <defs>
                  <linearGradient id="beamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                  <pattern id="seismicPattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="2" opacity="0.3" />
                  </pattern>
                </defs>

                {/* Beam Body */}
                <rect 
                  x="50" 
                  y="120" 
                  width="900" 
                  height="12" 
                  fill="url(#beamGradient)" 
                  rx="2"
                  className="stroke-slate-400 stroke-1"
                />

                {/* Supports */}
                {/* Left Support (Pinned) */}
                <g transform="translate(50, 132)">
                  <path d="M 0,0 L -15,25 L 15,25 Z" fill="#475569" />
                  <rect x="-20" y="25" width="40" height="4" fill="#1e293b" rx="1" />
                </g>
                {/* Right Support (Roller) */}
                <g transform="translate(950, 132)">
                  <path d="M 0,0 L -15,25 L 15,25 Z" fill="#475569" />
                  <circle cx="-8" cy="28" r="3" fill="#1e293b" />
                  <circle cx="8" cy="28" r="3" fill="#1e293b" />
                  <rect x="-20" y="31" width="40" height="4" fill="#1e293b" rx="1" />
                </g>

                {/* Loads */}
                {(() => {
                  const maxLoadVal = Math.max(...loads.map(l => Math.max(l.value, l.value2 ?? 0, 1)), 1);
                  const getScale = (val: number) => Math.min(Math.max((val / maxLoadVal) * 80, 20), 100);

                  return loads.map((load) => {
                    const isSeismic = load.category === 'seismic';
                    const color = isSeismic ? "#ef4444" : "#3b82f6";
                    const fillColor = isSeismic ? "url(#seismicPattern)" : `${color}22`;
                    
                    const handleMouseEnter = (e: React.MouseEvent) => {
                      const factored = factoredLoads.find(fl => fl.id === load.id);
                      setHoveredLoad({ ...load, factoredValue: factored?.value, factoredValue2: factored?.value2 });
                      setMousePos({ x: e.clientX, y: e.clientY });
                    };
                    
                    const handleMouseMove = (e: React.MouseEvent) => {
                      setMousePos({ x: e.clientX, y: e.clientY });
                    };

                    if (load.type === 'point') {
                      const x = 50 + (load.position! / length) * 900;
                      const h = getScale(load.value);
                      return (
                        <g 
                          key={load.id} 
                          className="group cursor-help"
                          onMouseEnter={handleMouseEnter}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={() => setHoveredLoad(null)}
                        >
                          {/* Invisible wider hit area */}
                          <line x1={x} y1={120 - h - 10} x2={x} y2={125} stroke="transparent" strokeWidth="20" />
                          
                          <line x1={x} y1={120 - h} x2={x} y2={115} stroke={color} strokeWidth="3" strokeLinecap="round" className="transition-all group-hover:stroke-blue-400" />
                          <path d={`M ${x-5},${115} L ${x},120 L ${x+5},${115}`} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" className="transition-all group-hover:stroke-blue-400" />
                          <circle cx={x} cy={120-h} r="4" fill={color} className="transition-all group-hover:r-6 group-hover:fill-blue-400" />
                        </g>
                      );
                    } else if (load.type === 'udl') {
                      const h = getScale(load.value);
                      return (
                        <g 
                          key={load.id} 
                          className="group cursor-help"
                          onMouseEnter={handleMouseEnter}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={() => setHoveredLoad(null)}
                        >
                          <rect x="50" y={120 - h} width="900" height={h} fill={fillColor} stroke={color} strokeWidth="1.5" strokeDasharray={isSeismic ? "4 2" : "none"} className="transition-all group-hover:fill-blue-400/20 group-hover:stroke-blue-400" />
                          {/* Arrows for UDL */}
                          {[...Array(11)].map((_, i) => {
                            const ax = 50 + (i * 90);
                            return (
                              <path key={i} d={`M ${ax-3},${115} L ${ax},120 L ${ax+3},${115}`} fill="none" stroke={color} strokeWidth="1.5" className="transition-all group-hover:stroke-blue-400" />
                            );
                          })}
                        </g>
                      );
                    } else {
                      const h1 = getScale(load.value);
                      const h2 = getScale(load.value2 ?? load.value);
                      const x1 = 50 + (load.start! / length) * 900;
                      const x2 = 50 + (load.end! / length) * 900;
                      return (
                        <g 
                          key={load.id} 
                          className="group cursor-help"
                          onMouseEnter={handleMouseEnter}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={() => setHoveredLoad(null)}
                        >
                          <path 
                            d={`M ${x1},120 L ${x1},${120-h1} L ${x2},${120-h2} L ${x2},120 Z`} 
                            fill={fillColor} 
                            stroke={color} 
                            strokeWidth="1.5" 
                            className="transition-all group-hover:fill-blue-400/20 group-hover:stroke-blue-400"
                          />
                        </g>
                      );
                    }
                  });
                })()}

                {/* Dimension Line */}
                <g transform="translate(0, 190)">
                  <line x1="50" y1="0" x2="950" y2="0" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="50" y1="-5" x2="50" y2="5" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="950" y1="-5" x2="950" y2="5" stroke="#94a3b8" strokeWidth="1" />
                  <text x="500" y="20" textAnchor="middle" fill="#64748b" className="text-[14px] font-mono font-bold">
                    L = {length} mm
                  </text>
                </g>
              </svg>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t px-6 py-4">
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.adjustSpan}</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number"
                      value={length}
                      onChange={(e) => setLength(Math.max(0, safeParseNumber(e.target.value, length)))}
                      className="h-8 w-24 text-right font-mono font-bold text-blue-600 bg-white"
                    />
                    <span className="text-xs font-bold text-slate-400">mm</span>
                  </div>
                </div>
                <Slider 
                  value={[length ?? 3000]} 
                  onValueChange={(vals) => setLength(vals[0] ?? 3000)} 
                  min={500} 
                  max={30000} 
                  step={50}
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                  <span>500 mm</span>
                  <span>30,000 mm</span>
                </div>
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
                    <li>Supported Loads: D, L, W, S, Seismic (E).</li>
                    <li>Seismic load (E) is calculated as Cs × Total Dead Load.</li>
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

      {/* Floating Tooltip */}
      <AnimatePresence>
        {hoveredLoad && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed z-[100] pointer-events-none bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-slate-700/50 backdrop-blur-sm min-w-[180px]"
            style={{ 
              left: Math.min(mousePos.x + 15, window.innerWidth - 200), 
              top: Math.max(mousePos.y - 120, 20) 
            }}
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: hoveredLoad.category === 'seismic' ? '#ef4444' : '#3b82f6' }} 
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {LOAD_CATEGORIES[hoveredLoad.category].name}
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-500">#{hoveredLoad.id.slice(0, 4)}</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[9px] uppercase text-slate-500 mb-0.5">Characteristic Value</div>
                <div className="text-sm font-bold flex items-baseline gap-1">
                  {hoveredLoad.type === 'trapezoidal' ? (
                    <>
                      <span>{hoveredLoad.value}</span>
                      <span className="text-xs font-normal text-slate-400">→</span>
                      <span>{hoveredLoad.value2}</span>
                      <span className="text-[10px] font-normal text-slate-400 ml-1">N/mm</span>
                    </>
                  ) : (
                    <>
                      <span>{hoveredLoad.value}</span>
                      <span className="text-[10px] font-normal text-slate-400 ml-1">
                        {hoveredLoad.type === 'point' ? 'N' : 'N/mm'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {activeCombination.factors[hoveredLoad.category] !== 1 && (
                <div>
                  <div className="text-[9px] uppercase text-blue-400 mb-0.5 flex items-center gap-1">
                    Factored Value <span className="text-[8px] opacity-70">(×{activeCombination.factors[hoveredLoad.category]})</span>
                  </div>
                  <div className="text-sm font-bold text-blue-300 flex items-baseline gap-1">
                    {(hoveredLoad as any).factoredValue !== undefined && (
                      hoveredLoad.type === 'trapezoidal' ? (
                        <>
                          <span>{(hoveredLoad as any).factoredValue.toFixed(2)}</span>
                          <span className="text-xs font-normal opacity-50">→</span>
                          <span>{(hoveredLoad as any).factoredValue2.toFixed(2)}</span>
                          <span className="text-[10px] font-normal opacity-50 ml-1">N/mm</span>
                        </>
                      ) : (
                        <>
                          <span>{(hoveredLoad as any).factoredValue.toFixed(2)}</span>
                          <span className="text-[10px] font-normal opacity-50 ml-1">
                            {hoveredLoad.type === 'point' ? 'N' : 'N/mm'}
                          </span>
                        </>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-white/5 flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase text-slate-500">Position</span>
                  <div className="text-[10px] font-medium text-slate-300 flex items-center gap-1">
                    <Maximize2 className="w-2.5 h-2.5" />
                    {hoveredLoad.type === 'point' ? (
                      <span>{hoveredLoad.position} mm</span>
                    ) : hoveredLoad.type === 'udl' ? (
                      <span>0 - {length} mm</span>
                    ) : (
                      <span>{hoveredLoad.start} - {hoveredLoad.end} mm</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase text-slate-500">Type</span>
                  <span className="text-[10px] font-medium text-slate-300 uppercase">{hoveredLoad.type}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Root() {
  return <App />;
}

function SummaryCard({ label, value, subValue, icon, status, onClick, active }: { 
  label: string; 
  value: string; 
  subValue?: string; 
  icon: React.ReactNode;
  status?: 'pass' | 'fail';
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <Card 
      className={cn(
        "shadow-sm border-slate-200 overflow-hidden cursor-pointer transition-all duration-200 group",
        active ? "ring-2 ring-blue-500 border-transparent" : "hover:border-blue-300 hover:shadow-md"
      )}
      onClick={onClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={cn(
            "text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate mr-1 transition-colors",
            active ? "text-blue-600" : "text-slate-500 group-hover:text-blue-500"
          )}>{label}</span>
          <div className={cn(
            "shrink-0 transition-transform duration-300",
            active ? "scale-110" : "group-hover:scale-110"
          )}>{icon}</div>
        </div>
        <div className="text-sm sm:text-lg font-bold tracking-tight truncate">{value}</div>
        {subValue && (
          <div className={cn(
            "text-[9px] sm:text-[10px] font-medium mt-1 truncate",
            status === 'fail' ? "text-red-600" : status === 'pass' ? "text-green-600" : "text-slate-400"
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
        <ChartTooltip 
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
