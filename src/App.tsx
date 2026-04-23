/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useMemo } from 'react';
import { 
  Calculator, 
  Plus, 
  Minus,
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
  Box,
  BookOpen,
  Activity,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Printer,
  Save,
  FolderOpen,
  Copy,
  RotateCcw,
  Settings,
  Languages,
  Menu,
  X,
  MapPin,
  Search,
  HelpCircle,
  Scale,
  FileCode,
  ArrowDown,
  Undo2,
  Redo2,
  Zap,
  Image as ImageIcon,
  Paperclip,
  Square
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from '@/components/ui/switch';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  Label as RechartsLabel
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { BeamVisualizer3D } from './components/BeamVisualizer3D';
import { 
  calculateBeam, 
  calculateRectangularProperties, 
  calculateHollowRectangularProperties,
  calculateChannelProperties,
  calculateLPlateProperties,
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
  aluminum_6063_t6: { name: 'Aluminum 6063-T6 (Extrusion)', e: 70000, yield: 160, poisson: 0.33, category: 'Aluminum', density: 2700 },
  aluminum_6063_t66: { name: 'Aluminum 6063-T66 (High Strength Extrusion)', e: 70000, yield: 200, poisson: 0.33, category: 'Aluminum', density: 2700 },
  aluminum_6063_t5: { name: 'Aluminum 6063-T5', e: 70000, yield: 110, poisson: 0.33, category: 'Aluminum', density: 2700 },
  aluminum_6061_t6: { name: 'Aluminum 6061-T6 (Structural)', e: 70000, yield: 240, poisson: 0.33, category: 'Aluminum', density: 2710 },
  aluminum_6082_t6: { name: 'Aluminum 6082-T6 (Structural)', e: 70000, yield: 250, poisson: 0.33, category: 'Aluminum', density: 2710 },
  aluminum_3003_h14: { name: 'Aluminum 3003-H14 (Cladding)', e: 70000, yield: 145, poisson: 0.33, category: 'Aluminum', density: 2730 },
  aluminum_5005_h34: { name: 'Aluminum 5005-H34 (Anodized)', e: 70000, yield: 135, poisson: 0.33, category: 'Aluminum', density: 2700 },
  aluminum_5754_h22: { name: 'Aluminum 5754-H22 (High Strength)', e: 70000, yield: 190, poisson: 0.33, category: 'Aluminum', density: 2660 },
  steel_s235: { name: 'Steel S235', e: 210000, yield: 235, poisson: 0.30, category: 'Steel', density: 7850 },
  steel_s275: { name: 'Steel S275', e: 210000, yield: 275, poisson: 0.30, category: 'Steel', density: 7850 },
  steel_s355: { name: 'Steel S355', e: 210000, yield: 355, poisson: 0.30, category: 'Steel', density: 7850 },
  steel_s420: { name: 'Steel S420', e: 210000, yield: 420, poisson: 0.30, category: 'Steel', density: 7850 },
  steel_s460: { name: 'Steel S460', e: 210000, yield: 460, poisson: 0.30, category: 'Steel', density: 7850 },
  stainless_304: { name: 'Stainless Steel 304', e: 193000, yield: 205, poisson: 0.30, category: 'Stainless Steel', density: 8000 },
  stainless_316: { name: 'Stainless Steel 316', e: 200000, yield: 215, poisson: 0.30, category: 'Stainless Steel', density: 8000 },
  stainless_2205: { name: 'Stainless Steel 2205 (Duplex)', e: 200000, yield: 450, poisson: 0.30, category: 'Stainless Steel', density: 7800 },
  concrete_c25: { name: 'Concrete C25/30', e: 31000, yield: 25, poisson: 0.20, category: 'Concrete', density: 2400 },
  concrete_c30: { name: 'Concrete C30/37', e: 33000, yield: 30, poisson: 0.20, category: 'Concrete', density: 2400 },
  concrete_c40: { name: 'Concrete C40/50', e: 35000, yield: 40, poisson: 0.20, category: 'Concrete', density: 2400 },
  timber_softwood: { name: 'Timber (Softwood C24)', e: 11000, yield: 24, poisson: 0.30, category: 'Timber', density: 420 },
  timber_hardwood: { name: 'Timber (Hardwood D40)', e: 14000, yield: 40, poisson: 0.30, category: 'Timber', density: 700 },
  timber_glulam: { name: 'Timber (Glulam GL24h)', e: 11500, yield: 24, poisson: 0.30, category: 'Timber', density: 450 },
  timber_clt: { name: 'Timber (CLT)', e: 11000, yield: 24, poisson: 0.30, category: 'Timber', density: 500 },
  glass_annealed: { name: 'Glass (Annealed Soda-Lime)', e: 70000, yield: 45, poisson: 0.22, category: 'Glass', density: 2500 },
  glass_tempered: { name: 'Glass (Fully Tempered Soda-Lime)', e: 70000, yield: 120, poisson: 0.22, category: 'Glass', density: 2500 },
  glass_hs: { name: 'Glass (Heat Strengthened Soda-Lime)', e: 70000, yield: 70, poisson: 0.22, category: 'Glass', density: 2500 },
  glass_low_iron_annealed: { name: 'Glass (Low Iron Annealed)', e: 70000, yield: 45, poisson: 0.22, category: 'Glass', density: 2500 },
  glass_low_iron_tempered: { name: 'Glass (Low Iron Tempered)', e: 70000, yield: 120, poisson: 0.22, category: 'Glass', density: 2500 },
  glass_laminated_pvb: { name: 'Glass (Laminated PVB - Effective)', e: 70000, yield: 45, poisson: 0.22, category: 'Glass', density: 2500 },
  glass_laminated_sgp: { name: 'Glass (Laminated SentryGlas - Effective)', e: 70000, yield: 120, poisson: 0.22, category: 'Glass', density: 2500 },
  glass_borosilicate_annealed: { name: 'Glass (Borosilicate Annealed)', e: 64000, yield: 50, poisson: 0.20, category: 'Glass', density: 2200 },
  glass_borosilicate_tempered: { name: 'Glass (Borosilicate Tempered)', e: 64000, yield: 150, poisson: 0.20, category: 'Glass', density: 2200 },
  glass_ceramic: { name: 'Glass (Ceramic / Fire Rated)', e: 92000, yield: 180, poisson: 0.24, category: 'Glass', density: 2600 },
  glass_wired: { name: 'Glass (Wired / Safety)', e: 70000, yield: 30, poisson: 0.22, category: 'Glass', density: 2500 },
  glass_patterned: { name: 'Glass (Patterned / Textured)', e: 70000, yield: 35, poisson: 0.22, category: 'Glass', density: 2500 },
  stone_granite: { name: 'Stone (Granite)', e: 60000, yield: 10, poisson: 0.25, category: 'Stone', density: 2700 },
  stone_marble: { name: 'Stone (Marble)', e: 50000, yield: 8, poisson: 0.25, category: 'Stone', density: 2600 },
  stone_limestone: { name: 'Stone (Limestone)', e: 40000, yield: 5, poisson: 0.25, category: 'Stone', density: 2400 },
  stone_sandstone: { name: 'Stone (Sandstone)', e: 20000, yield: 3, poisson: 0.25, category: 'Stone', density: 2300 },
  plastic_polycarb: { name: 'Polycarbonate', e: 2300, yield: 60, poisson: 0.37, category: 'Plastics', density: 1200 },
  plastic_acrylic: { name: 'Acrylic (PMMA)', e: 3200, yield: 70, poisson: 0.35, category: 'Plastics', density: 1180 },
  plastic_pvc: { name: 'PVC (Rigid)', e: 3000, yield: 50, poisson: 0.38, category: 'Plastics', density: 1400 },
  composite_acm: { name: 'ACM (Aluminum Composite)', e: 70000, yield: 100, poisson: 0.33, category: 'Composites', density: 1500 },
  composite_hpl: { name: 'HPL (High Pressure Laminate)', e: 9000, yield: 80, poisson: 0.30, category: 'Composites', density: 1350 },
  metal_copper: { name: 'Copper', e: 117000, yield: 70, poisson: 0.34, category: 'Other Metals', density: 8960 },
  metal_zinc: { name: 'Zinc', e: 90000, yield: 100, poisson: 0.25, category: 'Other Metals', density: 7140 },
  metal_brass: { name: 'Brass', e: 105000, yield: 200, poisson: 0.34, category: 'Other Metals', density: 8500 },
  grc: { name: 'GRC Panel', e: 15000, yield: 8, poisson: 0.24, category: 'Other', density: 2100 },
  terracotta: { name: 'Terracotta', e: 30000, yield: 15, poisson: 0.20, category: 'Other', density: 2100 },
  custom: { name: 'Custom', e: 200000, yield: 200, poisson: 0.30, category: 'Other', density: 7850 },
};

const LOAD_CATEGORIES = {
  dead: { name: 'Dead Load (D)', color: 'text-slate-500', bg: 'bg-slate-100' },
  live: { name: 'Live Load (L)', color: 'text-blue-500', bg: 'bg-blue-100' },
  wind: { name: 'Wind Load (W)', color: 'text-green-500', bg: 'bg-green-100' },
  snow: { name: 'Snow Load (S)', color: 'text-cyan-500', bg: 'bg-cyan-100' },
  seismic: { name: 'Seismic Load (E)', color: 'text-rose-500', bg: 'bg-rose-100' },
};

const SEISMIC_REGIONS = {
  china: { name: 'China (GB 50011)', coeff: 0.16, desc: 'Intensity 7, αmax=0.16', accel: 0.16, importance: 1.0, respMod: 1.0 },
  eurocode: { name: 'Eurocode (EN 1998)', coeff: 0.15, desc: 'ag=0.15g, S=1.2', accel: 0.15, importance: 1.0, respMod: 1.0 },
  hongkong: { name: 'Hong Kong (CoP)', coeff: 0.12, desc: 'ag=0.12g', accel: 0.12, importance: 1.0, respMod: 1.0 },
  thailand: { name: 'Thailand (DPT)', coeff: 0.10, desc: 'Zone 1', accel: 0.10, importance: 1.0, respMod: 1.0 },
  malaysia: { name: 'Malaysia (MS EN)', coeff: 0.07, desc: 'ag=0.07g', accel: 0.07, importance: 1.0, respMod: 1.0 },
  singapore: { name: 'Singapore (BC)', coeff: 0.05, desc: 'Low seismicity', accel: 0.05, importance: 1.0, respMod: 1.0 },
  usa_west: { name: 'US West (ASCE 7)', coeff: 0.30, desc: 'High Seismicity, Sds=1.0g', accel: 1.0, importance: 1.0, respMod: 1.0 },
  usa_east: { name: 'US East (ASCE 7)', coeff: 0.10, desc: 'Low Seismicity, Sds=0.33g', accel: 0.33, importance: 1.0, respMod: 1.0 },
  japan: { name: 'Japan (BCJ)', coeff: 0.40, desc: 'Z=1.0, Co=0.2', accel: 1.0, importance: 1.0, respMod: 1.0 },
  philippines: { name: 'Philippines (NSCP)', coeff: 0.35, desc: 'Zone 4, Cv=0.44', accel: 0.44, importance: 1.0, respMod: 1.0 },
  india: { name: 'India (IS 1893)', coeff: 0.24, desc: 'Zone IV, ag=0.24g', accel: 0.24, importance: 1.0, respMod: 1.0 },
  korea: { name: 'South Korea (KDS)', coeff: 0.22, desc: 'Zone 1, S=0.22g', accel: 0.22, importance: 1.0, respMod: 1.0 },
  turkey: { name: 'Turkey (TBDY)', coeff: 0.45, desc: 'High Seismicity, Sds=1.5', accel: 1.5, importance: 1.0, respMod: 1.0 },
};

const LOCATION_SEISMIC_MAPPING: Record<string, keyof typeof SEISMIC_REGIONS> = {
  'shanghai': 'china',
  'beijing': 'china',
  'guangzhou': 'china',
  'shenzhen': 'china',
  'hong kong': 'hongkong',
  'macau': 'hongkong',
  'bangkok': 'thailand',
  'kuala lumpur': 'malaysia',
  'johor bahru': 'malaysia',
  'singapore': 'singapore',
  'london': 'eurocode',
  'paris': 'eurocode',
  'berlin': 'eurocode',
  'munich': 'eurocode',
  'madrid': 'eurocode',
  'rome': 'eurocode',
  'athens': 'turkey', // High seismic in Eurocode region
  'istanbul': 'turkey',
  'ankara': 'turkey',
  'vancouver': 'philippines', // Higher seismic
  'toronto': 'usa_east',
  'mexico city': 'philippines', // Very high seismic
  'los angeles': 'usa_west',
  'san francisco': 'usa_west',
  'seattle': 'usa_west',
  'new york': 'usa_east',
  'chicago': 'usa_east',
  'houston': 'usa_east',
  'tokyo': 'japan',
  'osaka': 'japan',
  'nagoya': 'japan',
  'yokohama': 'japan',
  'taipei': 'japan', // High seismic
  'hanoi': 'thailand', // moderate
  'ho chi minh': 'thailand',
  'manila': 'philippines',
  'cebu': 'philippines',
  'davao': 'philippines',
  'jakarta': 'philippines',
  'mumbai': 'india',
  'delhi': 'india',
  'bangalore': 'india',
  'chennai': 'india',
  'seoul': 'korea',
  'busan': 'korea',
  'dubai': 'singapore', // Relatively low
  'abu dhabi': 'singapore',
  'riyadh': 'singapore',
  'doha': 'singapore',
  'muscat': 'singapore',
  'cairo': 'thailand', // moderate
  'johannesburg': 'singapore',
  'cape town': 'singapore',
};

const PANEL_MATERIALS = {
  aluminum_solid: { name: 'Solid Aluminum (3mm)', e: 70000, yield: 160, density: 2700, poisson: 0.33 },
  aluminum_solid_high: { name: 'Solid Aluminum (High Strength)', e: 70000, yield: 240, density: 2700, poisson: 0.33 },
  acm_4mm: { name: 'ACM / Composite (4mm)', e: 70000, yield: 120, density: 1500, poisson: 0.25, skinThickness: 0.5, totalThickness: 4.0 },
  acm_3mm: { name: 'ACM / Composite (3mm)', e: 70000, yield: 120, density: 1500, poisson: 0.25, skinThickness: 0.5, totalThickness: 3.0 },
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
    model3d: '3D Model',
    structuralModel: 'Structural Model',
    notes: 'Calculation Notes',
    codes: 'Codes of Practice',
    assumptions: 'Assumptions',
    limits: 'Design Limits',
    materialProps: 'Material Properties',
    adjustSpan: 'Adjust Span Length',
    supportCondition: 'Support Condition',
    simplySupported: 'Simply Supported',
    cantilever: 'Cantilever',
    fixedFixed: 'Fixed-Fixed',
    fixedPinned: 'Fixed-Pinned',
    proppedCantilever: 'Propped Cantilever',
    continuous: 'Continuous Beam',
    seismic: 'Seismic Analysis',
    seismicRegion: 'Seismic Region',
    seismicCoeff: 'Seismic Coeff (Cs)',
    applySeismic: 'Apply Seismic Load',
    saveProject: 'Save Project',
    loadProject: 'Load Project',
    projectSaved: 'Project saved to local storage',
    projectLoaded: 'Project loaded successfully',
    noProject: 'No saved project found',
    navIntro: 'Introduction',
    navCalculator: 'Calculator',
    navDocs: 'Documentation',
    heroTitle: 'Professional Facade Structural Analysis',
    heroDesc: 'A powerful, web-based tool for engineers to analyze and validate facade beam designs with real-time 3D visualization.',
    getStarted: 'Start Analysis',
    howItWorks: 'How it Works',
    features: 'Key Features',
    footerRights: 'All rights reserved.',
    unitSystem: 'Unit System',
    metric: 'Metric (mm, MPa)',
    imperial: 'Imperial (in, psi)',
    analysisMode: 'Analysis Mode',
    beamMode: 'Beam Member',
    panelMode: 'Cladding Panel',
    panelProps: 'Panel Properties',
    stiffenerProps: 'Backing Stiffeners',
    skinMaterial: 'Skin Material',
    skinThickness: 'Skin Thickness',
    stiffenerSpacing: 'Stiffener Spacing',
    maxSkinDeflection: 'Max Skin Deflection',
    maxSkinStress: 'Max Skin Stress',
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
    model3d: '3D 模型',
    structuralModel: '结构模型',
    notes: '计算说明',
    codes: '规范参考',
    assumptions: '计算假设',
    limits: '设计限值',
    materialProps: '材料属性',
    adjustSpan: '调整跨度',
    supportCondition: '支撑条件',
    simplySupported: '简支',
    cantilever: '悬臂',
    fixedFixed: '双端固定',
    fixedPinned: '一端固定一端简支',
    proppedCantilever: '支承悬臂梁',
    continuous: '连续梁',
    seismic: '地震分析',
    seismicRegion: '地震区域',
    seismicCoeff: '地震系数 (Cs)',
    applySeismic: '应用地震荷载',
    saveProject: '保存项目',
    loadProject: '加载项目',
    projectSaved: '项目已保存到本地存储',
    projectLoaded: '项目加载成功',
    noProject: '未找到保存的项目',
    navIntro: '介绍',
    navCalculator: '计算器',
    navDocs: '文档',
    heroTitle: '专业幕墙结构分析',
    heroDesc: '功能强大的网页版工具，为工程师提供实时 3D 可视化的幕墙梁设计分析与验证。',
    getStarted: '开始分析',
    howItWorks: '工作原理',
    features: '核心功能',
    footerRights: '版权所有。',
    unitSystem: '单位制',
    metric: '公制 (mm, MPa)',
    imperial: '英制 (in, psi)',
    analysisMode: '分析模式',
    beamMode: '结构梁',
    panelMode: '幕墙面板',
    panelProps: '面板属性',
    stiffenerProps: '加强肋/后置筋',
    skinMaterial: '面板材料',
    skinThickness: '面板厚度',
    stiffenerSpacing: '筋条间距',
    maxSkinDeflection: '最大面板挠度',
    maxSkinStress: '最大面板应力',
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
    model3d: 'โมเดล 3 มิติ',
    structuralModel: 'แบบจำลองโครงสร้าง',
    notes: 'บันทึกการคำนวณ',
    codes: 'มาตรฐานการออกแบบ',
    assumptions: 'ข้อสมมติฐาน',
    limits: 'ขีดจำกัดการออกแบบ',
    materialProps: 'คุณสมบัติวัสดุ',
    adjustSpan: 'ปรับความยาวช่วง',
    supportCondition: 'เงื่อนไขการรองรับ',
    simplySupported: 'รองรับแบบจุดหมุน',
    cantilever: 'คานยื่น',
    fixedFixed: 'ยึดแน่นทั้งสองด้าน',
    fixedPinned: 'ยึดแน่นหนึ่งด้าน',
    proppedCantilever: 'คานยื่นแบบมีจุดรองรับ',
    continuous: 'คานต่อเนื่อง',
    seismic: 'การวิเคราะห์แผ่นดินไหว',
    seismicRegion: 'ภูมิภาคแผ่นดินไหว',
    seismicCoeff: 'สัมประสิทธิ์แผ่นดินไหว (Cs)',
    applySeismic: 'ใช้น้ำหนักบรรทุกแผ่นดินไหว',
    saveProject: 'บันทึกโครงการ',
    loadProject: 'โหลดโครงการ',
    projectSaved: 'บันทึกโครงการลงในที่เก็บข้อมูลในตัวเครื่องแล้ว',
    projectLoaded: 'โหลดโครงการสำเร็จแล้ว',
    noProject: 'ไม่พบโครงการที่บันทึกไว้',
    navIntro: 'บทนำ',
    navCalculator: 'เครื่องคำนวณ',
    navDocs: 'เอกสาร',
    heroTitle: 'การวิเคราะห์โครงสร้างฟาซาดระดับมืออาชีพ',
    heroDesc: 'เครื่องมือบนเว็บที่ทรงพลังสำหรับวิศวกรในการวิเคราะห์และตรวจสอบการออกแบบคานฟาซาดพร้อมการแสดงภาพ 3 มิติแบบเรียลไทม์',
    getStarted: 'เริ่มการวิเคราะห์',
    howItWorks: 'วิธีการทำงาน',
    features: 'คุณสมบัติหลัก',
    footerRights: 'สงวนลิขสิทธิ์.',
    unitSystem: 'ระบบหน่วย',
    metric: 'เมตริก (mm, MPa)',
    imperial: 'อิมพีเรียล (in, psi)',
    analysisMode: 'โหมดการวิเคราะห์',
    beamMode: 'คานโครงสร้าง',
    panelMode: 'แผงหุ้ม',
    panelProps: 'คุณสมบัติของแผง',
    stiffenerProps: 'ตัวเสริมความแข็งแรง',
    skinMaterial: 'วัสดุผิว',
    skinThickness: 'ความหนาของผิว',
    stiffenerSpacing: 'ระยะห่างตัวเสริม',
    maxSkinDeflection: 'การโก่งตัวสูงสุดของผิว',
    maxSkinStress: 'หน่วยแรงสูงสุดของผิว',
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
    model3d: 'Model 3D',
    structuralModel: 'Model Struktur',
    notes: 'Nota Pengiraan',
    codes: 'Kod Amalan',
    assumptions: 'Andaian',
    limits: 'Had Reka Bentuk',
    materialProps: 'Sifat Bahan',
    adjustSpan: 'Laraskan Panjang Rentang',
    supportCondition: 'Keadaan Sokongan',
    simplySupported: 'Sokongan Mudah',
    cantilever: 'Cantilever',
    fixedFixed: 'Tetap-Tetap',
    fixedPinned: 'Tetap-Pin',
    proppedCantilever: 'Propped Cantilever',
    continuous: 'Rasuk Berterusan',
    seismic: 'Analisis Seismik',
    seismicRegion: 'Wilayah Seismik',
    seismicCoeff: 'Pekali Seismik (Cs)',
    applySeismic: 'Gunakan Beban Seismik',
    saveProject: 'Simpan Projek',
    loadProject: 'Muat Projek',
    projectSaved: 'Projek disimpan ke storan tempatan',
    projectLoaded: 'Projek berjaya dimuatkan',
    noProject: 'Tiada projek yang disimpan ditemui',
    navIntro: 'Pengenalan',
    navCalculator: 'Kalkulator',
    navDocs: 'Dokumentasi',
    heroTitle: 'Analisis Struktur Fasad Profesional',
    heroDesc: 'Alat berasaskan web yang berkuasa untuk jurutera menganalisisและ mengesahkan reka bentuk rasuk fasad dengan visualisasi 3D masa nyata.',
    getStarted: 'Mula Analisis',
    howItWorks: 'Cara Ia Berfungsi',
    features: 'Ciri Utama',
    footerRights: 'Hak cipta terpelihara.',
    unitSystem: 'Sistem Unit',
    metric: 'Metrik (mm, MPa)',
    imperial: 'Imperial (in, psi)',
    analysisMode: 'Mod Analisis',
    beamMode: 'Rasuk Struktur',
    panelMode: 'Panel Kemasan',
    panelProps: 'Sifat Panel',
    stiffenerProps: 'Pengeras Belakang',
    skinMaterial: 'Bahan Kulit',
    skinThickness: 'Ketebalan Kulit',
    stiffenerSpacing: 'Jarak Pengeras',
    maxSkinDeflection: 'Pesongan Kulit Maks',
    maxSkinStress: 'Tegangan Kulit Maks',
  }
};

// Mapping for automatic design code selection based on location input in multiple languages
const LOCATION_CODE_MAPPING: Record<string, { codes: string[], matches: string[] }> = {
  'Hong Kong': {
    codes: ['Hong Kong'],
    matches: ['hong kong', 'hk', 'kowloon', 'lantau', '香港', '九龙', '九龍', '大屿山', '大嶼山']
  },
  'Shanghai': {
    codes: ['Shanghai'],
    matches: ['shanghai', 'pudong', 'puxi', 'jingan', 'xuhui', '上海', '浦东', '浦西', '静安', '徐汇']
  },
  'Shenzhen': {
    codes: ['Shenzhen'],
    matches: ['shenzhen', 'futian', 'nanshan', 'baoan', 'luohu', '深圳', '福田', '南山', '宝安', '罗湖']
  },
  'Guangzhou': {
    codes: ['Guangzhou'],
    matches: ['guangzhou', 'tianhe', 'yuexiu', 'haizhu', 'panyu', '广州', '廣州', '天河', '越秀', '海珠', '番禺']
  },
  'Macau': {
    codes: ['Macau'],
    matches: ['macau', 'macao', 'taipa', '澳门', '澳門', '氹仔']
  },
  'Singapore': {
    codes: ['Singapore'],
    matches: ['singapore', 'sg', 'changi', 'jurong', 'sentosa', '新加坡']
  },
  'Malaysia': {
    codes: ['Malaysia'],
    matches: ['malaysia', 'kuala lumpur', 'kl', 'penang', 'johor', 'selangor', 'putrajaya', '马来西亚', '馬來西亞', '吉隆坡', '槟城', '柔佛']
  },
  'Thailand': {
    codes: ['Thailand'],
    matches: ['thailand', 'bangkok', 'phuket', 'chiang mai', 'pattaya', 'samui', '泰国', '泰國', '曼谷', '普吉', '清迈', '芭提雅']
  },
  'Viet Nam': {
    codes: ['Vietnam'],
    matches: ['vietnam', 'hanoi', 'ho chi minh', 'hcmc', 'da nang', '越南', '河内', '胡志明', '岘港']
  },
  'Taiwan': {
    codes: ['China (National)'],
    matches: ['taiwan', 'taipei', 'kaohsiung', 'taichung', '台湾', '台北', '高雄', '台中']
  },
  'Spain': {
    codes: ['Eurocodes (EU-General)'],
    matches: ['spain', 'madrid', 'barcelona', 'valencia', 'seville', '西班牙', '马德里', '巴塞罗那']
  },
  'United Kingdom': {
    codes: ['United Kingdom'],
    matches: ['united kingdom', 'uk', 'england', 'london', 'manchester', 'birmingham', 'leeds', 'glasgow', '英国', '英國', '伦敦', '曼彻斯特']
  },
  'United States': {
    codes: ['United States'],
    matches: ['united states', 'usa', 'us ', 'america', 'new york', 'los angeles', 'chicago', 'houston', 'miami', 'seattle', 'san francisco', '美国', '美國', '纽约', '洛杉矶', '迈阿密']
  },
  'Canada': {
    codes: ['Canada'],
    matches: ['canada', 'toronto', 'vancouver', 'montreal', 'ottawa', 'calgary', '加拿大', '多伦多', '温哥华']
  },
  'Australia': {
    codes: ['Australia'],
    matches: ['australia', 'au ', 'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', '澳大利亚', '澳洲', '悉尼', '墨尔本']
  },
  'New Zealand': {
    codes: ['New Zealand'],
    matches: ['new zealand', 'nz', 'auckland', 'wellington', 'christchurch', '新西兰', '新西蘭', '奥克兰']
  },
  'Japan': {
    codes: ['Japan'],
    matches: ['japan', 'jp', 'tokyo', 'osaka', 'kyoto', 'yokohama', 'nagoya', '日本', '东京', '東京', '大阪']
  },
  'South Korea': {
    codes: ['South Korea'],
    matches: ['korea', 'south korea', 'seoul', 'busan', 'incheon', '韩国', '韓國', '首尔', '釜山']
  },
  'India': {
    codes: ['India'],
    matches: ['india', 'mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', '印度', '孟买', '德里']
  },
  'UAE': {
    codes: ['UAE / Dubai'],
    matches: ['uae', 'united arab emirates', 'dubai', 'abu dhabi', 'sharjah', '阿联酋', '迪拜', '阿布扎比']
  },
  'Saudi Arabia': {
    codes: ['Saudi Arabia'],
    matches: ['saudi', 'saudi arabia', 'ksa', 'riyadh', 'jeddah', 'dammam', '沙特', '利雅得', '吉达']
  },
  'South Africa': {
    codes: ['South Africa'],
    matches: ['south africa', 'za', 'cape town', 'johannesburg', 'joburg', 'pretoria', 'durban', '南非', '开普敦']
  },
  'Germany': {
    codes: ['Germany'],
    matches: ['germany', 'de', 'berlin', 'munich', 'hamburg', 'frankfurt', 'stuttgart', '德国', '德國', '柏林', '慕尼黑']
  },
  'France': {
    codes: ['France'],
    matches: ['france', 'fr', 'paris', 'lyon', 'marseille', 'bordeaux', '法国', '法國', '巴黎', '里昂']
  },
  'Italy': {
    codes: ['Italy'],
    matches: ['italy', 'it ', 'rome', 'milan', 'venice', 'florence', 'naples', '意大利', '義大利', '罗马', '米兰']
  },
  'Brazil': {
    codes: ['Brazil'],
    matches: ['brazil', 'brasil', 'rio de janeiro', 'sao paulo', 'brasilia', 'curitiba', '巴西', '里约', '圣保罗']
  },
  'Oman': {
    codes: ['UAE / Dubai'],
    matches: ['oman', 'muscat', '阿曼', '马斯喀特']
  },
  'Egypt': {
    codes: ['Eurocodes (EU-General)'],
    matches: ['egypt', 'cairo', 'alexandria', '埃及', '开罗']
  },
  'Nigeria': {
    codes: ['Eurocodes (EU-General)'],
    matches: ['nigeria', 'lagos', 'abuja', '尼日利亚', '拉各斯']
  },
  'Eurocodes': {
    codes: ['Eurocodes (EU-General)'],
    matches: ['europe', 'eu ', 'spain', 'netherlands', 'belgium', 'austria', 'sweden', 'madrid', 'amsterdam', '欧洲', '歐洲', '西班牙', '荷兰', '比利时']
  },
  'China National': {
    codes: ['China (National)'],
    matches: ['china', 'beijing', 'tianjin', 'nanjing', 'wuhan', 'chengdu', 'xian', '中国', '中國', '北京', '天津', '南京', '武汉', '成都', '西安']
  }
};

const CODES_OF_PRACTICE = [
  // EUROPE
  { region: 'Europe', country: 'Eurocodes (EU-General)', codes: ['EN 1990 (Basis)', 'EN 1991 (Actions)', 'EN 1993 (Steel)', 'EN 1999 (Aluminum)', 'EN 1998 (Seismic)'] },
  { region: 'Europe', country: 'United Kingdom', codes: ['BS EN 1991 (UK NA)', 'BS EN 1993 (Steel)', 'BS EN 1999 (Aluminum)', 'BS EN 1998 (Seismic)', 'BS 6399 (Legacy Wind)'] },
  { region: 'Europe', country: 'Germany', codes: ['DIN EN 1991 (NA)', 'DIN EN 1993 (Steel)', 'DIN EN 1999 (Aluminum)', 'DIN 18008 (Glass)'] },
  { region: 'Europe', country: 'France', codes: ['NF EN 1991 (NA)', 'NF EN 1993 (Steel)', 'NF EN 1999 (Aluminum)', 'NF DTU 39 (Glass)'] },
  { region: 'Europe', country: 'Italy', codes: ['UNI EN 1991 (NA)', 'NTC 2018 (National Code)', 'CNR-DT 210 (Glass)'] },

  // ASIA PACIFIC - EAST ASIA
  { region: 'Asia', country: 'China (National)', codes: ['GB 50009 (Loads)', 'JGJ 102 (Curtain Wall)', 'GB 50011 (Seismic)', 'GB 50017 (Steel)'] },
  { region: 'Asia', country: 'Japan', codes: ['AIJ (Loads)', 'BCJ (Building Code)', 'JIS G 3101 (Steel)', 'JASS 14 (Curtain Wall)'] },
  { region: 'Asia', country: 'South Korea', codes: ['KDS 41 (Building)', 'KDS 14 (Steel)', 'KBC 2022'] },
  { region: 'Asia', country: 'Hong Kong', codes: ['CoP for Glass 2018', 'CoP on Wind 2019', 'CoP for Seismic Design 2024', 'CoP for Structural Steel 2011'] },
  { region: 'Asia', country: 'Macau', codes: ['RCAM (Actions)', 'REAE (Seismic)', 'RSM (Steel)'] },
  { region: 'Asia', country: 'Taiwan', codes: ['Building Structural Design', 'Wind Load Standards', 'Steel Structure Code'] },
  { region: 'Asia', country: 'Shanghai', codes: ['DGJ08-56 (Curtain Wall)', 'DGJ08-11 (Loads)', 'DGJ08-9 (Steel)'] },
  { region: 'Asia', country: 'Shenzhen', codes: ['SZJG 48 (Glass)', 'SZJG 54 (Metal/Stone)', 'SJG 15 (Wind)'] },
  { region: 'Asia', country: 'Guangzhou', codes: ['DBJ/T 15-30 (Curtain Wall)', 'DBJ 15-101 (Wind)', 'GZJG (Guidelines)'] },

  // ASIA PACIFIC - SOUTHEAST ASIA
  { region: 'Asia', country: 'Singapore', codes: ['SS EN 1991 (Actions)', 'SS EN 1993 (Steel)', 'SS EN 1999 (Aluminum)', 'BC1:2023 (Steel)'] },
  { region: 'Asia', country: 'Malaysia', codes: ['MS 1553 (Wind)', 'MS EN 1991 (EC1)', 'MS EN 1998 (Seismic)', 'UBBL 2021'] },
  { region: 'Asia', country: 'Thailand', codes: ['EIT 1011-46 (Steel)', 'DPT 1311-50 (Wind)', 'DPT 1301/1302 (Seismic)'] },
  { region: 'Asia', country: 'Vietnam', codes: ['TCVN 2737:2023 (Loads)', 'TCVN 5575:2012 (Steel)', 'TCVN 9386:2012 (Seismic)'] },
  { region: 'Asia', country: 'Philippines', codes: ['NSCP 2015 (Vol 1)', 'ASEP Guidelines', 'DPWH Standards'] },
  { region: 'Asia', country: 'Indonesia', codes: ['SNI 1727:2020 (Loads)', 'SNI 1726:2019 (Seismic)', 'SNI 1729:2020 (Steel)'] },

  // ASIA PACIFIC - SOUTH ASIA
  { region: 'Asia', country: 'India', codes: ['IS 875 (Loads)', 'IS 800 (Steel)', 'IS 1893 (Seismic)', 'IS 16231 (Glass)'] },

  // AMERICAS
  { region: 'Americas', country: 'United States', codes: ['ASCE 7-22 (Loads)', 'AISC 360-22 (Steel)', 'ADM 2020 (Aluminum)', 'ASTM E1300 (Glass)', 'IBC 2024'] },
  { region: 'Americas', country: 'Canada', codes: ['NBCC 2020 (Loads)', 'CSA S16 (Steel)', 'CSA S157 (Aluminum)', 'CAN/CGSB 12.20 (Glass)'] },
  { region: 'Americas', country: 'Brazil', codes: ['NBR 6123 (Wind)', 'NBR 8800 (Steel)', 'NBR 7199 (Glass)', 'NBR 14762 (Cold-Formed)'] },
  { region: 'Americas', country: 'Mexico', codes: ['NTC-EDIF (Building)', 'CFE (Wind/Seismic)', 'IMCA (Steel)'] },

  // OCEANIA
  { region: 'Oceania', country: 'Australia', codes: ['AS/NZS 1170 (Loads)', 'AS 4100 (Steel)', 'AS/NZS 1664 (Aluminum)', 'AS 1288 (Glass)'] },
  { region: 'Oceania', country: 'New Zealand', codes: ['AS/NZS 1170 (Loads)', 'NZS 3404 (Steel)', 'AS/NZS 1664 (Aluminum)', 'NZS 4223 (Glass)'] },

  // MIDDLE EAST
  { region: 'Middle East', country: 'UAE / Dubai', codes: ['DBC (Loads)', 'Dubai Wind Code', 'AISC 360 (Steel)', 'ADM (Aluminum)'] },
  { region: 'Middle East', country: 'Saudi Arabia', codes: ['SBC 301 (Loads)', 'SBC 304 (Steel)', 'SBC 306 (Aluminum)'] },
  { region: 'Middle East', country: 'Qatar', codes: ['QCS 2014', 'BS EN / ASCE 7 References'] },

  // AFRICA
  { region: 'Africa', country: 'South Africa', codes: ['SANS 10160 (Loads)', 'SANS 10162 (Steel)', 'SANS 10137 (Glass)'] },
  { region: 'Africa', country: 'Egypt', codes: ['ECP 201 (Loads)', 'ECP 205 (Steel)', 'Egyptian Building Code'] },
];

const UNITS = {
  metric: {
    length: 'mm',
    stress: 'MPa',
    force: 'N',
    udl: 'N/mm',
    moment: 'Nmm',
    momentDisplay: 'kNm',
    forceDisplay: 'kN',
  },
  imperial: {
    length: 'in',
    stress: 'psi',
    force: 'lbf',
    udl: 'lb/in',
    moment: 'lb-in',
    momentDisplay: 'lb-ft',
    forceDisplay: 'kip',
  }
};

const CONVERSION = {
  mm_to_in: 1 / 25.4,
  in_to_mm: 25.4,
  mpa_to_psi: 145.0377,
  psi_to_mpa: 1 / 145.0377,
  n_to_lbf: 1 / 4.44822,
  lbf_to_n: 4.44822,
  n_per_mm_to_lb_per_in: 5.710147,
  lb_per_in_to_n_per_mm: 1 / 5.710147,
  nmm_to_lbin: 1 / 112.985,
  lbin_to_nmm: 112.985,
  lbin_to_lbft: 1 / 12,
  lbft_to_lbin: 12,
  n_to_kn: 1 / 1000,
  lbf_to_kip: 1 / 1000,
};

interface Combination {
  id: string;
  name: string;
  description: string;
  factors: Record<keyof typeof LOAD_CATEGORIES, number>;
}

const DEFAULT_COMBINATIONS: Combination[] = [
  { 
    id: 'c1', 
    name: 'Serviceability (D+L)', 
    description: 'Used for checking deflection limits (SLS). Ensures the structure remains functional and aesthetically pleasing under normal usage.',
    factors: { dead: 1.0, live: 1.0, wind: 0, snow: 0, seismic: 0 } 
  },
  { 
    id: 'c2', 
    name: 'Ultimate (1.2D + 1.6L)', 
    description: 'Primary strength check (ULS). Applies safety factors to dead and live loads to ensure structural integrity against collapse.',
    factors: { dead: 1.2, live: 1.6, wind: 0, snow: 0, seismic: 0 } 
  },
  { 
    id: 'c3', 
    name: 'Wind Dominant (D + W)', 
    description: 'Checks structural response under maximum design wind pressures. Critical for facade members and external cladding.',
    factors: { dead: 1.0, live: 0, wind: 1.0, snow: 0, seismic: 0 } 
  },
  { 
    id: 'c4', 
    name: 'Seismic Dominant (D + E)', 
    description: 'Evaluates performance during earthquake events. Includes a portion of live load as per most international building codes.',
    factors: { dead: 1.0, live: 0.5, wind: 0, snow: 0, seismic: 1.0 } 
  },
];

// Helper for robust number parsing with clamping
const safeParseNumber = (val: string | number, fallback: number = 0, min: number = -Infinity, max: number = Infinity): number => {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return fallback;
  return Math.min(Math.max(num, min), max);
};

const getCriticalPoints = (results: any, unitSystem: string, u: any, toDisplay: any) => {
  if (!results || results.points.length === 0) return null;
  
  const maxDeflectionPoint = results.points.reduce((max: any, p: any) => Math.abs(p.deflection) > Math.abs(max.deflection) ? p : max, results.points[0]);
  const maxMomentPoint = results.points.reduce((max: any, p: any) => Math.abs(p.moment) > Math.abs(max.moment) ? p : max, results.points[0]);
  const maxShearPoint = results.points.reduce((max: any, p: any) => Math.abs(p.shear) > Math.abs(max.shear) ? p : max, results.points[0]);
  const maxStressPoint = results.points.reduce((max: any, p: any) => p.stress > max.stress ? p : max, results.points[0]);

  return {
    deflection: [{ 
      x: Number(toDisplay(maxDeflectionPoint.x, 'length').toFixed(2)), 
      y: Number(toDisplay(maxDeflectionPoint.deflection, 'length').toFixed(3)), 
      label: `Δ_max: ${toDisplay(maxDeflectionPoint.deflection, 'length').toFixed(2)} ${u.length}` 
    }],
    moment: [{ 
      x: Number(toDisplay(maxMomentPoint.x, 'length').toFixed(2)), 
      y: Number(toDisplay(maxMomentPoint.moment, 'moment').toFixed(2)), 
      label: `M_max: ${unitSystem === 'metric' ? (maxMomentPoint.moment / 1000000).toFixed(2) + ' kNm' : (toDisplay(maxMomentPoint.moment, 'moment') * CONVERSION.lbin_to_lbft).toFixed(1) + ' lb-ft'}` 
    }],
    shear: [
      { 
        x: Number(toDisplay(results.points[0].x ?? 0, 'length').toFixed(2)), 
        y: Number(toDisplay(results.points[0].shear ?? 0, 'force').toFixed(2)), 
        label: `R_left: ${unitSystem === 'metric' ? ((results.points[0].shear ?? 0) / 1000).toFixed(2) + ' kN' : (toDisplay(results.points[0].shear ?? 0, 'force') / 1000).toFixed(2) + ' kip'}` 
      },
      { 
        x: Number(toDisplay(results.points[results.points.length-1].x ?? 0, 'length').toFixed(2)), 
        y: Number(toDisplay(results.points[results.points.length-1].shear ?? 0, 'force').toFixed(2)), 
        label: `R_right: ${unitSystem === 'metric' ? (-(results.points[results.points.length-1].shear ?? 0) / 1000).toFixed(2) + ' kN' : (toDisplay(-(results.points[results.points.length-1].shear ?? 0), 'force') / 1000).toFixed(2) + ' kip'}` 
      }
    ],
    stress: [{ 
      x: Number(toDisplay(maxStressPoint.x ?? 0, 'length').toFixed(2)), 
      y: Number(toDisplay(maxStressPoint.stress ?? 0, 'stress').toFixed(2)), 
      label: `σ_max: ${(maxStressPoint.stress ?? 0).toFixed(2)} MPa` 
    }]
  };
};

interface HistoryState {
  projectTitle: string;
  projectLocation: string;
  projectDescription: string;
  projectDate: string;
  projectTime: string;
  projectAttachment?: string;
  calculationMode: 'beam' | 'panel';
  length: number;
  material: keyof typeof MATERIALS;
  panelMaterialId: keyof typeof PANEL_MATERIALS;
  sectionType: 'solid' | 'hollow' | 'channel' | 'l-plate';
  beamType: 'mullion' | 'transom';
  width: number;
  height: number;
  thickness: number;
  thickness2: number;
  supportCondition: 'simply_supported' | 'cantilever' | 'propped_cantilever' | 'fixed_fixed' | 'fixed_pinned' | 'continuous';
  intermediateSupports: number[];
  safetyFactor: number;
  stiffenerCount: number;
  stiffenerWidth: number;
  stiffenerHeight: number;
  stiffenerThickness: number;
  selectedCodeId: string;
  loads: Load[];
  combinations: Combination[];
  activeCombinationId: string;
  seismicRegion: keyof typeof SEISMIC_REGIONS;
  seismicCoeff: number;
  unitSystem: 'metric' | 'imperial';
  projectNotes: string;
}

interface Project extends HistoryState {
  id: string;
}

const createNewProject = (id: string, title: string): Project => ({
  id,
  projectTitle: title,
  projectLocation: 'Shanghai, China',
  projectDescription: 'Structural analysis for Shanghai facade project.',
  projectDate: new Date().toISOString().split('T')[0],
  projectTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
  projectAttachment: '',
  calculationMode: 'beam',
  length: 3500,
  material: 'aluminum_6061_t6',
  panelMaterialId: 'aluminum_solid',
  sectionType: 'hollow',
  beamType: 'mullion',
  width: 65,
  height: 150,
  thickness: 3.5,
  thickness2: 3.5,
  supportCondition: 'simply_supported',
  intermediateSupports: [],
  safetyFactor: 1.5,
  stiffenerCount: 0,
  stiffenerWidth: 40,
  stiffenerHeight: 40,
  stiffenerThickness: 2,
  selectedCodeId: 'Shanghai',
  loads: [{ id: '1', type: 'udl', category: 'dead', value: 0.5 }],
  combinations: DEFAULT_COMBINATIONS,
  activeCombinationId: 'c1',
  seismicRegion: 'china',
  seismicCoeff: SEISMIC_REGIONS.china.coeff,
  unitSystem: 'metric',
  projectNotes: 'Initial structural calculation for project.'
});

const getProjectResults = (project: Project) => {
  const sectionProps = project.sectionType === 'solid' 
    ? calculateRectangularProperties(project.width, project.height)
    : project.sectionType === 'channel'
    ? calculateChannelProperties(project.width, project.height, project.thickness, project.thickness2)
    : project.sectionType === 'l-plate'
    ? calculateLPlateProperties(project.width, project.height, project.thickness, project.thickness2)
    : calculateHollowRectangularProperties(project.width, project.height, project.thickness, project.thickness2);

  const activeCombination = project.combinations.find(c => c.id === project.activeCombinationId) || project.combinations[0];
  
  const factoredLoads = project.loads.map(load => ({
    ...load,
    value: load.value * (activeCombination.factors[load.category] || 0),
    value2: load.value2 !== undefined ? load.value2 * (activeCombination.factors[load.category] || 0) : undefined,
  }));

  const beamProps: BeamProperties = {
    length: project.length,
    elasticModulus: MATERIALS[project.material].e,
    momentOfInertia: sectionProps.momentOfInertia,
    sectionModulus: sectionProps.sectionModulus,
    yieldStrength: MATERIALS[project.material].yield,
    safetyFactor: project.safetyFactor,
    supportCondition: project.supportCondition,
    beamType: project.beamType,
    intermediateSupports: project.intermediateSupports,
  };

  try {
    return calculateBeam(beamProps, factoredLoads);
  } catch (error) {
    return {
      points: [],
      summary: {
        maxDeflection: 0,
        maxMoment: 0,
        maxShear: 0,
        maxStress: 0,
        deflectionRatio: 'N/A',
        status: 'fail' as const,
        utilizationStress: 0,
        utilizationDeflection: 0
      }
    };
  }
};

const PanelResultsView = ({
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
  const maxUtilization = results.summary.utilization;

  return (
    <div className="space-y-4">
      <Card 
        className={cn(
          "shadow-sm border-slate-200 bg-gradient-to-br from-white to-slate-50/30",
          results.summary.status === 'pass' ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"
        )}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tighter text-slate-900">
                  {(maxUtilization * 100).toFixed(1)}%
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Governing Utilization</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={results.summary.status === 'pass' ? 'outline' : 'destructive'} className={cn(
                  "text-[10px] font-bold uppercase py-0 px-2 h-5",
                  results.summary.status === 'pass' && "border-green-200 bg-green-50 text-green-700"
                )}>
                  {results.summary.status === 'pass' ? "PASS" : "FAIL"}
                </Badge>
                <span className="text-[10px] font-medium text-slate-500">
                  Method: <span className="font-bold text-slate-700">Roark's Formulas</span>
                </span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
               <Activity className="w-5 h-5 text-slate-300" />
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, maxUtilization * 100)}%` }}
              className={cn(
                "h-full rounded-full transition-all duration-500",
                maxUtilization > 1 ? "bg-red-500" : maxUtilization > 0.8 ? "bg-amber-500" : "bg-blue-500"
              )}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Skin Analysis Card */}
        <Card className="shadow-sm border-slate-200 overflow-hidden group hover:border-blue-200 transition-colors">
          <CardHeader className="p-3 sm:p-4 border-b bg-blue-50/30">
            <div className="flex items-center gap-2 text-blue-600">
              <Square className="w-4 h-4" />
              <CardTitle className="text-sm font-bold uppercase tracking-wide">Skin Analysis (Panel)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Deflection</p>
                  <p className="text-lg font-black text-slate-900">{results.skin.deflection.toFixed(2)} <span className="text-xs font-normal text-slate-500">mm</span></p>
                  <Badge variant={results.skin.utilizationDeflection > 1 ? 'destructive' : 'outline'} className="text-[9px] h-4 px-1">
                    U: {(results.skin.utilizationDeflection * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Max Stress</p>
                  <p className="text-lg font-black text-slate-900">{results.skin.stress.toFixed(1)} <span className="text-xs font-normal text-slate-500">MPa</span></p>
                  <Badge variant={results.skin.utilizationStress > 1 ? 'destructive' : 'outline'} className="text-[9px] h-4 px-1 ml-auto">
                    U: {(results.skin.utilizationStress * 100).toFixed(1)}%
                  </Badge>
                </div>
             </div>
             <Separator className="bg-slate-100" />
             <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 italic">
               <div>a: {results.dimensions?.a.toFixed(0)}mm</div>
               <div className="text-center">b: {results.dimensions?.b.toFixed(0)}mm</div>
               <div className="text-right">a/b: {(results.dimensions?.a / results.dimensions?.b).toFixed(2)}</div>
             </div>
          </CardContent>
        </Card>

        {/* Stiffener Analysis Card */}
        <Card className="shadow-sm border-slate-200 overflow-hidden group hover:border-rose-200 transition-colors">
          <CardHeader className="p-3 sm:p-4 border-b bg-rose-50/30">
            <div className="flex items-center gap-2 text-rose-600">
              <Layout className="w-4 h-4" />
              <CardTitle className="text-sm font-bold uppercase tracking-wide">Stiffener Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
             {results.stiffener ? (
               <>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Deflection</p>
                      <p className="text-lg font-black text-slate-900">{results.stiffener.maxDeflection.toFixed(2)} <span className="text-xs font-normal text-slate-500">mm</span></p>
                      <Badge variant={results.stiffener.utilizationDeflection > 1 ? 'destructive' : 'outline'} className="text-[9px] h-4 px-1">
                        U: {(results.stiffener.utilizationDeflection * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Bending Stress</p>
                      <p className="text-lg font-black text-slate-900">{results.stiffener.maxStress.toFixed(1)} <span className="text-xs font-normal text-slate-500">MPa</span></p>
                      <Badge variant={results.stiffener.utilizationStress > 1 ? 'destructive' : 'outline'} className="text-[9px] h-4 px-1 ml-auto">
                        U: {(results.stiffener.utilizationStress * 100).toFixed(1)}%
                      </Badge>
                    </div>
                 </div>
                 <div className="pt-2">
                   <p className="text-[10px] text-slate-400 font-mono">Tributary: {results.stiffener.loadWidth.toFixed(0)} mm | Count: {results.stiffener.count}</p>
                 </div>
               </>
             ) : (
               <div className="h-full flex items-center justify-center py-6 text-slate-400 italic text-xs">
                 No stiffeners added
               </div>
             )}
          </CardContent>
        </Card>
      </div>
      
      {/* Weight Summary */}
      <Card className="shadow-sm border-slate-200 bg-slate-50/50">
        <CardContent className="p-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-white rounded-full shadow-sm border">
               <Scale className="w-4 h-4 text-slate-500" />
             </div>
             <p className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-none">Estimated Total Weight</p>
           </div>
           <div className="text-right">
             <p className="text-xl font-black text-slate-900">{(results.summary.weight / 9.81).toFixed(1)} <span className="text-xs font-normal text-slate-500">kg</span></p>
             <p className="text-[10px] text-slate-400 font-mono">Includes Skin + Stiffeners</p>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProjectResultsView = ({ 
  project, 
  results, 
  panelResults,
  calculationMode,
  unitSystem, 
  t, 
  u, 
  toDisplay, 
  activeTab, 
  setActiveTab,
  isChartExpanded,
  setIsChartExpanded,
  criticalPoints
}: { 
  project: Project; 
  results: any; 
  panelResults?: any;
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
}) => {
  if (calculationMode === 'panel' && panelResults) {
    return <PanelResultsView results={panelResults} unitSystem={unitSystem} t={t} u={u} toDisplay={toDisplay} />;
  }

  const governingCriteria = results.summary.utilizationStress >= results.summary.utilizationDeflection ? 'Stress' : 'Deflection';
  const maxUtilization = Math.max(0, results.summary.utilizationStress || 0, results.summary.utilizationDeflection || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <h3 className="text-[10px] sm:text-sm font-bold text-slate-500 uppercase tracking-wider truncate max-w-[60%]">{project.projectTitle}</h3>
        <div className={cn(
          "px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-bold uppercase whitespace-nowrap",
          results.summary.status === 'pass' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {results.summary.status === 'pass' ? "Valid" : "Fails"}
        </div>
      </div>

      {/* Utilization Overview */}
      <Card 
        className={cn(
          "shadow-sm border-slate-200 cursor-pointer transition-all hover:ring-2 hover:ring-blue-100",
          results.summary.status === 'pass' ? "bg-gradient-to-br from-white to-green-50/30" : "bg-gradient-to-br from-white to-red-50/30"
        )}
        onClick={() => setActiveTab('utilization')}
      >
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900">
                  {(maxUtilization * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Utilization</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={cn(
                  "text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded uppercase tracking-wider",
                  results.summary.status === 'pass' ? "bg-green-500 text-white" : "bg-red-500 text-white"
                )}>
                  {results.summary.status === 'pass' ? "Pass" : "Fail"}
                </span>
                <span className="text-[8px] sm:text-[10px] font-medium text-slate-500 truncate max-w-[80px] sm:max-w-none">
                  Gov: <span className="font-bold text-slate-700">{governingCriteria}</span>
                </span>
              </div>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 sm:border-4 border-slate-100 flex items-center justify-center relative">
              <svg className="h-full w-full -rotate-90">
                <circle
                  cx="20" cy="20" r="18"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-slate-100 sm:hidden"
                />
                <circle
                  cx="24" cy="24" r="20"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-slate-100 hidden sm:block"
                />
                <circle
                  cx="20" cy="20" r="18"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={113}
                  strokeDashoffset={113 * (1 - Math.min(1, maxUtilization))}
                  className={cn(
                    "transition-all duration-1000 sm:hidden",
                    maxUtilization > 1 ? "text-red-500" : maxUtilization > 0.8 ? "text-amber-500" : "text-blue-500"
                  )}
                />
                <circle
                  cx="24" cy="24" r="20"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 * (1 - Math.min(1, maxUtilization))}
                  className={cn(
                    "transition-all duration-1000 hidden sm:block",
                    maxUtilization > 1 ? "text-red-500" : maxUtilization > 0.8 ? "text-amber-500" : "text-blue-500"
                  )}
                />
              </svg>
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 absolute text-slate-300" />
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, maxUtilization * 100)}%` }}
              className={cn(
                "h-full rounded-full",
                maxUtilization > 1 ? "bg-red-500" : maxUtilization > 0.8 ? "bg-amber-500" : "bg-blue-500"
              )}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <SummaryCard 
        label={t.maxDeflection} 
        value={`${toDisplay(results.summary.maxDeflection ?? 0, 'length').toFixed(unitSystem === 'metric' ? 2 : 4)} ${u.length}`} 
        subValue={results.summary.deflectionRatio}
        icon={<Maximize2 className="w-4 h-4 text-blue-500" />}
        status={(results.summary.utilizationDeflection ?? 0) > 1 ? 'fail' : 'pass'}
        progress={results.summary.utilizationDeflection ?? 0}
        tooltip="Maximum vertical displacement of the beam under applied loads."
      />
      <SummaryCard 
        label={t.maxStress} 
        value={`${toDisplay(results.summary.maxStress ?? 0, 'stress').toFixed(unitSystem === 'metric' ? 2 : 4)} ${u.stress}`} 
        icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
        status={(results.summary.utilizationStress ?? 0) > 1 ? 'fail' : 'pass'}
        progress={results.summary.utilizationStress ?? 0}
        tooltip="Maximum internal stress in the material. Must be less than the allowable yield strength."
      />
      <SummaryCard 
        label={t.maxMoment} 
        value={unitSystem === 'metric' 
          ? `${((results.summary.maxMoment ?? 0) / 1000000).toFixed(2)} kNm` 
          : `${(toDisplay(results.summary.maxMoment ?? 0, 'moment') * CONVERSION.lbin_to_lbft).toFixed(1)} lb-ft`} 
        icon={<Layout className="w-4 h-4 text-purple-500" />}
        tooltip="Maximum bending moment occurring along the beam span."
      />
      <SummaryCard 
        label={t.maxShear} 
        value={unitSystem === 'metric'
          ? `${((results.summary.maxShear ?? 0) / 1000).toFixed(2)} kN`
          : `${(toDisplay(results.summary.maxShear ?? 0, 'force') / 1000).toFixed(2)} kip`} 
        icon={<ChevronRight className="w-4 h-4 text-green-500" />}
        tooltip="Maximum internal shear force acting perpendicular to the beam axis."
      />
      </div>

      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4 border-b bg-slate-50/50 flex items-center justify-between overflow-x-auto no-scrollbar">
            <TabsList className="bg-transparent border-none h-auto p-0 gap-4 flex-nowrap">
              <TabsTrigger value="deflection" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 pb-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">{t.deflection}</TabsTrigger>
              <TabsTrigger value="moment" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 pb-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">{t.moment}</TabsTrigger>
              <TabsTrigger value="shear" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 pb-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">{t.shear}</TabsTrigger>
              <TabsTrigger value="stress" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 pb-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">{t.stress}</TabsTrigger>
              <TabsTrigger value="utilization" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 pb-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">Utilization</TabsTrigger>
              <TabsTrigger value="3d" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 pb-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">3D Model</TabsTrigger>
            </TabsList>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-slate-400 hover:text-blue-600 shrink-0 ml-2 hidden sm:flex"
              onClick={() => setIsChartExpanded(!isChartExpanded)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className={cn("p-3 sm:p-4", isChartExpanded ? "h-[600px]" : "h-[280px] sm:h-[350px]")}>
            <TabsContent value="deflection" className="h-full m-0">
              <ChartContainer 
                data={results.points.map((p: any) => ({ ...p, x: toDisplay(p.x, 'length'), deflection: toDisplay(p.deflection, 'length') }))} 
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
            </TabsContent>
            <TabsContent value="moment" className="h-full m-0">
              <ChartContainer 
                data={results.points.map((p: any) => ({ ...p, x: toDisplay(p.x, 'length'), moment: toDisplay(p.moment, 'moment') }))} 
                dataKey="moment" 
                color="#8B5CF6" 
                unit={u.moment} 
                label={t.moment}
                formatter={(v) => unitSystem === 'metric' ? (v / 1000000).toFixed(2) + ' kNm' : (v * CONVERSION.lbin_to_lbft).toFixed(1) + ' lb-ft'}
                unitSystem={unitSystem as any}
                u={u}
                criticalPoints={criticalPoints?.moment}
              />
            </TabsContent>
            <TabsContent value="shear" className="h-full m-0">
              <ChartContainer 
                data={results.points.map((p: any) => ({ ...p, x: toDisplay(p.x, 'length'), shear: toDisplay(p.shear, 'force') }))} 
                dataKey="shear" 
                color="#10B981" 
                unit={u.force} 
                label={t.shear}
                formatter={(v) => unitSystem === 'metric' ? (v / 1000).toFixed(2) + ' kN' : (v / 1000).toFixed(2) + ' kip'}
                unitSystem={unitSystem as any}
                u={u}
                criticalPoints={criticalPoints?.shear}
              />
            </TabsContent>
            <TabsContent value="stress" className="h-full m-0">
              <ChartContainer 
                data={results.points.map((p: any) => ({ ...p, x: toDisplay(p.x, 'length'), stress: toDisplay(p.stress, 'stress') }))} 
                dataKey="stress" 
                color="#F59E0B" 
                unit={u.stress} 
                label={t.stress}
                formatter={(v) => v.toFixed(unitSystem === 'metric' ? 1 : 0) + ' ' + u.stress}
                unitSystem={unitSystem as any}
                u={u}
                criticalPoints={criticalPoints?.stress}
              />
            </TabsContent>
            <TabsContent value="utilization" className="h-full m-0">
              <ChartContainer 
                data={results.points.map((p: any) => ({ ...p, x: toDisplay(p.x, 'length'), utilization: Math.max(p.utilizationStress, p.utilizationDeflection) * 100 }))} 
                dataKey="utilization" 
                color="#EF4444" 
                unit="%" 
                label="Total Utilization"
                formatter={(v) => v.toFixed(1) + '%'}
                unitSystem={unitSystem as any}
                u={u}
              />
            </TabsContent>
            <TabsContent value="3d" className="h-full m-0">
              <BeamVisualizer3D 
                length={project.length} 
                width={project.width} 
                height={project.height} 
                thickness={project.thickness} 
                thickness2={project.thickness2 || project.thickness}
                sectionType={project.sectionType} 
                supportCondition={project.supportCondition}
                intermediateSupports={project.intermediateSupports}
                unitSystem={unitSystem as any}
              />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

const PRESET_PROFILES = [
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

const ReferenceAttachmentCard = ({ 
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
              <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-7 text-[10px] gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 bg-transparent border-none cursor-pointer">
                <Box className="w-3 h-3" />
                Presets
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Standard Profiles</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {PRESET_PROFILES.map((preset) => (
                    <DropdownMenuItem 
                      key={preset.id} 
                      onClick={() => onApplyPreset?.(preset)}
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

const CalculusStepsCard = ({ 
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
  loads
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
}) => {
  const toggleOption = (key: keyof typeof options) => {
    setOptions({ ...options, [key]: !options[key] });
  };

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
        {options.section && (
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
            <p className="text-[9px] text-slate-400 px-1 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
              <strong>Note:</strong> The seismic coefficient derived is based on the equivalent static force method as per the selected regional standard. For non-structural facade components, dynamic amplification may be required depending on the component's natural frequency and mounting height relative to the building height.
            </p>
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

const REGIONS = [
  { 
    id: 'asia-east', 
    name: 'East Asia', 
    icon: <Globe className="w-4 h-4" />,
    cities: ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Hong Kong', 'Macau', 'Taipei', 'Tokyo', 'Osaka', 'Seoul', 'Busan'] 
  },
  { 
    id: 'asia-se', 
    name: 'Southeast & South Asia', 
    icon: <MapPin className="w-4 h-4" />,
    cities: ['Singapore', 'Kuala Lumpur', 'Bangkok', 'Jakarta', 'Manila', 'Ho Chi Minh', 'Mumbai', 'Delhi', 'Bangalore'] 
  },
  { 
    id: 'europe', 
    name: 'Europe & UK', 
    icon: <Box className="w-4 h-4" />,
    cities: ['London', 'Birmingham', 'Berlin', 'Munich', 'Paris', 'Lyon', 'Rome', 'Milan', 'Madrid', 'Barcelona', 'Amsterdam'] 
  },
  { 
    id: 'americas', 
    name: 'Americas', 
    icon: <PlusCircle className="w-4 h-4" />,
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Toronto', 'Vancouver', 'Mexico City', 'Sao Paulo', 'Rio de Janeiro'] 
  },
  { 
    id: 'mideast-africa', 
    name: 'Middle East & Africa', 
    icon: <Layers className="w-4 h-4" />,
    cities: ['Dubai', 'Abu Dhabi', 'Riyadh', 'Jeddah', 'Doha', 'Muscat', 'Cape Town', 'Johannesburg', 'Cairo', 'Lagos'] 
  },
  { 
    id: 'oceania', 
    name: 'Oceania', 
    icon: <Activity className="w-4 h-4" />,
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Auckland', 'Wellington', 'Christchurch'] 
  },
];

function KeyMapDialog({ onSelect }: { onSelect: (location: string) => void }) {
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
          {REGIONS.map((region) => (
            <div key={region.id} className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                <span className="bg-slate-100 p-1.5 rounded-lg text-slate-500">
                  {region.icon}
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
                    className="justify-start h-9 sm:h-10 text-[10px] sm:text-[11px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all border border-transparent hover:border-blue-100 px-2"
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
          <DialogClose render={<Button variant="outline" className="rounded-xl font-bold text-xs h-8 sm:h-9" />}>
            Close Map
          </DialogClose>
        </DialogFooter>
      </div>
    </DialogContent>
  );
}

export function App() {
  // Beam State
  const [length, setLength] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.length ?? 3500;
      } catch (e) { return 3500; }
    }
    return 3500;
  });
  const [material, setMaterial] = useState<keyof typeof MATERIALS>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.material ?? 'aluminum_6061_t6';
      } catch (e) { return 'aluminum_6061_t6'; }
    }
    return 'aluminum_6061_t6';
  });
  const [sectionType, setSectionType] = useState<'solid' | 'hollow' | 'channel' | 'l-plate'>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.sectionType ?? 'hollow';
      } catch (e) { return 'hollow'; }
    }
    return 'hollow';
  });
  const [beamType, setBeamType] = useState<'mullion' | 'transom'>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.beamType ?? 'mullion';
      } catch (e) { return 'mullion'; }
    }
    return 'mullion';
  });
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.width ?? 65;
      } catch (e) { return 65; }
    }
    return 65;
  });
  const [height, setHeight] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.height ?? 150;
      } catch (e) { return 150; }
    }
    return 150;
  });
  const [thickness, setThickness] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.thickness ?? 3.5;
      } catch (e) { return 3.5; }
    }
    return 3.5;
  });
  const [thickness2, setThickness2] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.thickness2 ?? data.thickness ?? 3.5;
      } catch (e) { return 3.5; }
    }
    return 3.5;
  });
  const [supportCondition, setSupportCondition] = useState<'simply_supported' | 'cantilever' | 'propped_cantilever' | 'fixed_fixed' | 'fixed_pinned' | 'continuous'>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.supportCondition ?? 'simply_supported';
      } catch (e) { return 'simply_supported'; }
    }
    return 'simply_supported';
  });
  const [intermediateSupports, setIntermediateSupports] = useState<number[]>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.intermediateSupports ?? [];
      } catch (e) { return []; }
    }
    return [];
  });
  const [safetyFactor, setSafetyFactor] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.safetyFactor ?? 1.5;
      } catch (e) { return 1.5; }
    }
    return 1.5;
  });
  const [selectedCodeId, setSelectedCodeId] = useState<string>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.selectedCodeId ?? 'Shanghai';
      } catch (e) { return 'Shanghai'; }
    }
    return 'Shanghai';
  });
  const [hoveredLoad, setHoveredLoad] = useState<Load | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Loads State
  const [loads, setLoads] = useState<Load[]>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.loads ?? [{ id: '1', type: 'udl', category: 'dead', value: 0.5 }];
      } catch (e) { return [{ id: '1', type: 'udl', category: 'dead', value: 0.5 }]; }
    }
    return [{ id: '1', type: 'udl', category: 'dead', value: 0.5 }];
  });

  // Combinations State
  const [combinations, setCombinations] = useState<Combination[]>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.combinations ?? DEFAULT_COMBINATIONS;
      } catch (e) { return DEFAULT_COMBINATIONS; }
    }
    return DEFAULT_COMBINATIONS;
  });
  const [activeCombinationId, setActiveCombinationId] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.activeCombinationId ?? 'c1';
      } catch (e) { return 'c1'; }
    }
    return 'c1';
  });
  const [isCombinationManagerOpen, setIsCombinationManagerOpen] = useState(false);
  const [isLocationMapOpen, setIsLocationMapOpen] = useState(false);
  const [showAllCodes, setShowAllCodes] = useState(false);
  const [showCalculusSteps, setShowCalculusSteps] = useState(false);
  const [calcStepOptions, setCalcStepOptions] = useState({
    section: true,
    loads: true,
    analysis: true,
    stress: true,
    seismic: true
  });
  const [visualAnalysisOptions, setVisualAnalysisOptions] = useState({
    deflection: true,
    stress: true,
    loads: true
  });
  const [activeTab, setActiveTab] = useState('deflection');
  const [isChartExpanded, setIsChartExpanded] = useState(false);
  const [lang, setLang] = useState<keyof typeof TRANSLATIONS>('en');
  const [view, setView] = useState<'home' | 'calculator' | 'docs'>('calculator');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.unitSystem ?? 'metric';
      } catch (e) { return 'metric'; }
    }
    return 'metric';
  });
  
  // Multi-Project State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('facadecalc_projects_list');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (Array.isArray(data) && data.length > 0) return data;
      } catch (e) { console.error("Failed to load projects list", e); }
    }
    return [];
  });
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const saved = localStorage.getItem('facadecalc_active_project_id');
    return saved ?? 'p1';
  });
  const [comparisonProjectId, setComparisonProjectId] = useState<string | null>(null);
  const [isBiViewMode, setIsBiViewMode] = useState(false);

  // Project Info State
  const [calculationMode, setCalculationMode] = useState<'beam' | 'panel'>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.calculationMode ?? 'beam';
      } catch (e) { return 'beam'; }
    }
    return 'beam';
  });

  const [panelMaterialId, setPanelMaterialId] = useState<keyof typeof PANEL_MATERIALS>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.panelMaterialId ?? 'aluminum_solid';
      } catch (e) { return 'aluminum_solid'; }
    }
    return 'aluminum_solid';
  });

  const [stiffenerSpacing, setStiffenerSpacing] = useState(600);
  const [stiffenerCount, setStiffenerCount] = useState(1);
  const [stiffenerWidth, setStiffenerWidth] = useState(40);
  const [stiffenerHeight, setStiffenerHeight] = useState(40);
  const [stiffenerThickness, setStiffenerThickness] = useState(2.0);

  const [projectTitle, setProjectTitle] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.projectTitle ?? 'Shanghai Project';
      } catch (e) { return 'Shanghai Project'; }
    }
    return 'Shanghai Project';
  });
  const [projectLocation, setProjectLocation] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.projectLocation ?? 'Shanghai, China';
      } catch (e) { return 'Shanghai, China'; }
    }
    return 'Shanghai, China';
  });
  const [projectDescription, setProjectDescription] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.projectDescription ?? 'Structural analysis for Shanghai facade project.';
      } catch (e) { return 'Structural analysis for Shanghai facade project.'; }
    }
    return 'Structural analysis for Shanghai facade project.';
  });
  const [projectAttachment, setProjectAttachment] = useState<string>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.projectAttachment ?? '';
      } catch (e) { return ''; }
    }
    return '';
  });
  const [projectDate, setProjectDate] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.projectDate ?? new Date().toISOString().split('T')[0];
      } catch (e) { return new Date().toISOString().split('T')[0]; }
    }
    return new Date().toISOString().split('T')[0];
  });
  const [projectTime, setProjectTime] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.projectTime ?? new Date().toTimeString().split(' ')[0].slice(0, 5);
      } catch (e) { return new Date().toTimeString().split(' ')[0].slice(0, 5); }
    }
    return new Date().toTimeString().split(' ')[0].slice(0, 5);
  });

  const [projectNotes, setProjectNotes] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.projectNotes ?? 'Structural calculation for this project.';
      } catch (e) { return 'Structural calculation for this project.'; }
    }
    return 'Structural calculation for this project.';
  });

  const t = TRANSLATIONS[lang];
  const u = UNITS[unitSystem];

  // Unit Conversion Helpers
  const toDisplay = (val: number, type: keyof typeof UNITS.metric): number => {
    if (unitSystem === 'metric') return val;
    switch (type) {
      case 'length': return val * CONVERSION.mm_to_in;
      case 'stress': return val * CONVERSION.mpa_to_psi;
      case 'force': return val * CONVERSION.n_to_lbf;
      case 'udl': return val * CONVERSION.n_per_mm_to_lb_per_in;
      case 'moment': return val * CONVERSION.nmm_to_lbin;
      case 'momentDisplay': return val * CONVERSION.nmm_to_lbin * CONVERSION.lbin_to_lbft;
      case 'forceDisplay': return val * CONVERSION.n_to_lbf * CONVERSION.lbf_to_kip;
      default: return val;
    }
  };

  const fromDisplay = (val: number, type: keyof typeof UNITS.metric): number => {
    if (unitSystem === 'metric') return val;
    switch (type) {
      case 'length': return val * CONVERSION.in_to_mm;
      case 'stress': return val * CONVERSION.psi_to_mpa;
      case 'force': return val * CONVERSION.lbf_to_n;
      case 'udl': return val * CONVERSION.lb_per_in_to_n_per_mm;
      case 'moment': return val * CONVERSION.lbin_to_nmm;
      default: return val;
    }
  };

  // Seismic State
  const [seismicRegion, setSeismicRegion] = useState<keyof typeof SEISMIC_REGIONS>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.seismicRegion ?? 'china';
      } catch (e) { return 'china'; }
    }
    return 'china';
  });
  const [seismicCoeff, setSeismicCoeff] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.seismicCoeff ?? SEISMIC_REGIONS.china.coeff;
      } catch (e) { return SEISMIC_REGIONS.china.coeff; }
    }
    return SEISMIC_REGIONS.china.coeff;
  });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Auto-switch design code based on location (Multilingual Support)
  React.useEffect(() => {
    if (!projectLocation) return;
    
    const loc = projectLocation.toLowerCase().trim();
    let foundCode = '';

    // Search through the mapping for multilingual matches
    for (const key in LOCATION_CODE_MAPPING) {
      const entry = LOCATION_CODE_MAPPING[key];
      if (entry.matches.some(match => loc.includes(match.toLowerCase()))) {
        foundCode = entry.codes[0];
        break;
      }
    }

    if (foundCode && foundCode !== selectedCodeId) {
      setSelectedCodeId(foundCode);
      
      // Optional: Inform user of auto-detection
      setNotification({
        message: `Auto-detected location: ${projectLocation}. Applied ${foundCode} design standards.`,
        type: 'success'
      });
      setTimeout(() => setNotification(null), 3000);
    }

    // Seismic detection mapping
    let foundSeismic: keyof typeof SEISMIC_REGIONS | '' = '';
    for (const city in LOCATION_SEISMIC_MAPPING) {
      if (loc.includes(city)) {
        foundSeismic = LOCATION_SEISMIC_MAPPING[city];
        break;
      }
    }

    if (foundSeismic && foundSeismic !== seismicRegion) {
      setSeismicRegion(foundSeismic);
      setSeismicCoeff(SEISMIC_REGIONS[foundSeismic].coeff);
    }
  }, [projectLocation, selectedCodeId, seismicRegion]);

  // History State for Undo/Redo
  const [past, setPast] = useState<HistoryState[]>([]);
  const [future, setFuture] = useState<HistoryState[]>([]);
  const isHistoryAction = React.useRef(false);

  const getCurrentState = (): HistoryState => ({
    projectTitle,
    projectLocation,
    projectDescription,
    projectDate,
    projectTime,
    projectAttachment,
    calculationMode,
    length,
    material,
    panelMaterialId,
    sectionType,
    beamType,
    width,
    height,
    thickness,
    thickness2,
    supportCondition,
    intermediateSupports,
    safetyFactor,
    stiffenerCount,
    stiffenerWidth,
    stiffenerHeight,
    stiffenerThickness,
    selectedCodeId,
    loads,
    combinations,
    activeCombinationId,
    seismicRegion,
    seismicCoeff,
    unitSystem,
    projectNotes
  });

  const applyState = (state: HistoryState) => {
    isHistoryAction.current = true;
    setProjectTitle(state.projectTitle);
    setProjectLocation(state.projectLocation);
    setProjectDescription(state.projectDescription);
    setProjectDate(state.projectDate);
    setProjectTime(state.projectTime ?? new Date().toTimeString().split(' ')[0].slice(0, 5));
    setProjectAttachment(state.projectAttachment ?? '');
    setCalculationMode(state.calculationMode ?? 'beam');
    setLength(state.length);
    setMaterial(state.material);
    setPanelMaterialId(state.panelMaterialId ?? 'aluminum_solid');
    setSectionType(state.sectionType);
    setWidth(state.width);
    setHeight(state.height);
    setThickness(state.thickness);
    setThickness2(state.thickness2 ?? state.thickness);
    setSupportCondition(state.supportCondition);
    setIntermediateSupports(state.intermediateSupports ?? []);
    setSafetyFactor(state.safetyFactor);
    setStiffenerCount(state.stiffenerCount ?? 0);
    setStiffenerWidth(state.stiffenerWidth ?? 40);
    setStiffenerHeight(state.stiffenerHeight ?? 40);
    setStiffenerThickness(state.stiffenerThickness ?? 2);
    setSelectedCodeId(state.selectedCodeId);
    setLoads(state.loads);
    setCombinations(state.combinations);
    setActiveCombinationId(state.activeCombinationId);
    setSeismicRegion(state.seismicRegion);
    setSeismicCoeff(state.seismicCoeff);
    setUnitSystem(state.unitSystem ?? 'metric');
    setProjectNotes(state.projectNotes ?? '');
  };

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setFuture([getCurrentState(), ...future]);
    setPast(newPast);
    applyState(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast([...past, getCurrentState()]);
    setFuture(newFuture);
    applyState(next);
  };

  // Effect to track changes and push to history with debounce
  const lastStateRef = React.useRef<HistoryState | null>(null);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  React.useEffect(() => {
    if (isHistoryAction.current) {
      isHistoryAction.current = false;
      lastStateRef.current = getCurrentState(); // Update last state to avoid immediate push after undo/redo
      return;
    }
    
    const currentState = getCurrentState();
    const hasChanged = !lastStateRef.current || JSON.stringify(lastStateRef.current) !== JSON.stringify(currentState);
    
    if (hasChanged) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      
      debounceTimerRef.current = setTimeout(() => {
        if (lastStateRef.current) {
          setPast(prev => [...prev.slice(-49), lastStateRef.current!]); // Keep last 50 actions
          setFuture([]);
        }
        lastStateRef.current = currentState;
      }, 500); // 500ms debounce
    }
    
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [
    projectTitle, projectLocation, projectDescription, projectDate, projectTime, projectAttachment,
    length, material, sectionType, width, height, thickness,
    supportCondition, safetyFactor, selectedCodeId,
    loads, combinations, activeCombinationId,
    seismicRegion, seismicCoeff, projectNotes
  ]);

  // Keyboard shortcuts for Undo/Redo
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [past, future, projectTitle, projectLocation, projectDescription, projectDate, length, material, sectionType, width, height, thickness, supportCondition, safetyFactor, selectedCodeId, loads, combinations, activeCombinationId, seismicRegion, seismicCoeff, projectNotes]);

  // Ensure thickness is valid relative to dimensions to prevent geometric errors
  React.useEffect(() => {
    if (sectionType === 'hollow') {
      const maxT = Math.min(width, height) / 2.1;
      if (thickness > maxT) {
        setThickness(Number(maxT.toFixed(1)));
      }
    }
  }, [width, height, sectionType, thickness]);

  // Ensure all loads are within beam length and logically valid
  React.useEffect(() => {
    let changed = false;
    const validatedLoads = loads.map(load => {
      let updated = { ...load };
      let loadChanged = false;

      if (load.type === 'point') {
        if (load.position !== undefined && load.position > length) {
          updated.position = length;
          loadChanged = true;
        }
        if (load.position !== undefined && load.position < 0) {
          updated.position = 0;
          loadChanged = true;
        }
      } else if (load.type === 'trapezoidal') {
        if (load.start !== undefined && load.start > length) {
          updated.start = length;
          loadChanged = true;
        }
        if (load.start !== undefined && load.start < 0) {
          updated.start = 0;
          loadChanged = true;
        }
        if (load.end !== undefined && load.end > length) {
          updated.end = length;
          loadChanged = true;
        }
        if (load.end !== undefined && load.end < 0) {
          updated.end = 0;
          loadChanged = true;
        }
        // Ensure start <= end
        if (updated.start !== undefined && updated.end !== undefined && updated.start > updated.end) {
          updated.start = updated.end;
          loadChanged = true;
        }
      }

      if (loadChanged) changed = true;
      return updated;
    });

    if (changed) {
      setLoads(validatedLoads);
    }
  }, [length, loads]);

  // Auto-clear notification
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Initialize projects list if empty
  React.useEffect(() => {
    if (projects.length === 0) {
      const initialProj = { ...getCurrentState(), id: activeProjectId };
      setProjects([initialProj]);
      localStorage.setItem('facadecalc_projects_list', JSON.stringify([initialProj]));
    }
  }, []);

  // Automatically update Unit System to follow selected region
  React.useEffect(() => {
    const code = CODES_OF_PRACTICE.find(c => c.country === selectedCodeId);
    if (code) {
      if (code.country === 'United States') {
        setUnitSystem('imperial');
      } else {
        setUnitSystem('metric');
      }
    }
  }, [selectedCodeId]);

  // Sync current project to list periodically
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const currentState = getCurrentState();
      setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...currentState, id: activeProjectId } : p));
    }, 1000);
    return () => clearTimeout(timer);
  }, [
    projectTitle, projectLocation, projectDescription, projectDate,
    length, material, sectionType, width, height, thickness,
    supportCondition, safetyFactor, selectedCodeId,
    loads, combinations, activeCombinationId,
    seismicRegion, seismicCoeff, projectNotes
  ]);

  // Calculations
  const sectionProps = useMemo(() => {
    if (sectionType === 'solid') {
      return calculateRectangularProperties(width, height);
    } else if (sectionType === 'channel') {
      return calculateChannelProperties(width, height, thickness, thickness2);
    } else if (sectionType === 'l-plate') {
      return calculateLPlateProperties(width, height, thickness, thickness2);
    }
    return calculateHollowRectangularProperties(width, height, thickness, thickness2);
  }, [width, height, thickness, thickness2, sectionType]);

  const activeCombination = useMemo(() => 
    combinations.find(c => c.id === activeCombinationId) || combinations[0] || { id: 'default', name: 'Default', description: 'Default fallback combination.', factors: { dead: 1, live: 0, wind: 0, snow: 0, seismic: 0 } }
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
    supportCondition,
  }), [length, material, sectionProps, safetyFactor, supportCondition]);

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
          status: 'fail' as const,
          utilizationStress: 0,
          utilizationDeflection: 0
        }
      };
    }
  }, [beamProps, factoredLoads, length, activeCombination]);

  const criticalPoints = useMemo(() => 
    getCriticalPoints(results, unitSystem, u, toDisplay)
  , [results, unitSystem, u, toDisplay]);

  const panelResults = useMemo(() => {
    if (calculationMode !== 'panel') return null;

    const mat = PANEL_MATERIALS[panelMaterialId];
    const E = mat.e;
    const nu = mat.poisson;
    const t = (mat as any).totalThickness ?? 3.0;
    
    // Total wind pressure in MPa (N/mm2)
    const q_wind_factored = loads
      .filter(l => l.category === 'wind')
      .reduce((sum, l) => sum + (safeParseNumber(l.value, 0) / 1000) * (activeCombination.factors.wind || 0), 0);

    const b_panel = Math.min(width, length);
    const a_panel = Math.max(width, length);
    
    const b_eff = stiffenerCount > 0 ? (length / (stiffenerCount + 1)) : b_panel;
    const a_eff = width;
    const s_min = Math.min(a_eff, b_eff);
    const s_max = Math.max(a_eff, b_eff);
    const ratio = s_max / s_min;

    // Roark coefficients
    const alphaMap = [
      { r: 1.0, a: 0.00406, b: 0.2874 },
      { r: 1.2, a: 0.00564, b: 0.3762 },
      { r: 1.4, a: 0.00705, b: 0.4530 },
      { r: 1.6, a: 0.00830, b: 0.5172 },
      { r: 1.8, a: 0.00931, b: 0.5688 },
      { r: 2.0, a: 0.01013, b: 0.6102 },
      { r: 3.0, a: 0.01223, b: 0.7134 },
      { r: 5.0, a: 0.01297, b: 0.7410 },
      { r: 10, a: 0.01302, b: 0.7500 },
    ];

    let alpha = 0.01302;
    let beta = 0.7500;
    for (let i = 0; i < alphaMap.length - 1; i++) {
      if (ratio >= alphaMap[i].r && ratio <= alphaMap[i+1].r) {
        const frac = (ratio - alphaMap[i].r) / (alphaMap[i+1].r - alphaMap[i].r);
        alpha = alphaMap[i].a + frac * (alphaMap[i+1].a - alphaMap[i].a);
        beta = alphaMap[i].b + frac * (alphaMap[i+1].b - alphaMap[i].b);
        break;
      }
    }

    const D = (E * Math.pow(t, 3)) / (12 * (1 - nu * nu));
    const maxSkinDeflection = (alpha * q_wind_factored * Math.pow(s_min, 4)) / D;
    const maxSkinStress = (beta * q_wind_factored * Math.pow(s_min, 2)) / (t * t);

    // Stiffener Analysis
    const tribWidth = width / (stiffenerCount + 1);
    const stiffenerLoads = loads.map(l => ({
      ...l,
      value: l.type === 'udl' ? l.value * tribWidth : l.value,
      value2: l.value2 !== undefined ? l.value2 * tribWidth : undefined,
    }));

    const stiffProps = calculateLPlateProperties(stiffenerWidth, stiffenerHeight, stiffenerThickness, stiffenerThickness);
    
    const stiffenerBeamProps = {
      length: length,
      elasticModulus: 70000,
      momentOfInertia: stiffProps.momentOfInertia,
      sectionModulus: stiffProps.sectionModulus,
      yieldStrength: 160,
      safetyFactor: safetyFactor,
      supportCondition: 'simply_supported' as any,
    };

    const stiffenerAnalysis = calculateBeam(stiffenerBeamProps, stiffenerLoads.map(l => ({
      ...l,
      value: safeParseNumber(l.value, 0) * (activeCombination.factors[l.category] || 0),
      value2: l.value2 !== undefined ? safeParseNumber(l.value2, 0) * (activeCombination.factors[l.category] || 0) : undefined,
    })));

    return {
      skin: {
        deflection: maxSkinDeflection,
        stress: maxSkinStress,
        allowableStress: mat.yield / safetyFactor,
        allowableDeflection: s_min / 60,
        utilizationStress: maxSkinStress / (mat.yield / safetyFactor),
        utilizationDeflection: maxSkinDeflection / (s_min / 60)
      },
      stiffener: stiffenerAnalysis.summary,
      totalWeight: (mat.density * width * length * t * 1e-9)
    };
  }, [calculationMode, panelMaterialId, width, length, loads, activeCombination, stiffenerCount, stiffenerWidth, stiffenerHeight, stiffenerThickness, safetyFactor]);

  const addLoad = (type: Load['type'] = 'point', category: Load['category'] = 'dead', value?: number) => {
    const newLoad: Load = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      category,
      value: value ?? (type === 'point' ? 1000 : 0.5),
      position: type === 'point' ? length / 2 : undefined,
      value2: type === 'trapezoidal' ? 1.5 : undefined,
      start: type === 'trapezoidal' ? length * 0.25 : undefined,
      end: type === 'trapezoidal' ? length * 0.75 : undefined,
    };
    setLoads([...loads, newLoad]);
  };

  const selfWeightPerUnit = useMemo(() => {
    const areaMm2 = sectionProps.area ?? 0;
    const densityKgM3 = (MATERIALS[material as keyof typeof MATERIALS] as any).density ?? 2700;
    // Area (mm2) * 1e-6 (m2) * Density (kg/m3) * 9.81 (N/kg) = N/m
    // Divide by 1000 to get N/mm
    return (areaMm2 * 1e-6 * densityKgM3 * 9.81) / 1000;
  }, [sectionProps.area, material]);

  const totalDeadMagnitude = useMemo(() => {
    const appliedDead = loads
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
    
    const selfWeight = selfWeightPerUnit * length;
    return appliedDead + selfWeight;
  }, [loads, length, selfWeightPerUnit]);

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
    const headers = [
      `Distance (${u.length})`, 
      `Deflection (${u.length})`, 
      `Moment (${u.moment})`, 
      `Shear (${u.force})`, 
      `Stress (${u.stress})`
    ];
    const rows = results.points.map(p => [
      toDisplay(p.x ?? 0, 'length').toFixed(2),
      toDisplay(p.deflection ?? 0, 'length').toFixed(4),
      toDisplay(p.moment ?? 0, 'moment').toFixed(2),
      toDisplay(p.shear ?? 0, 'force').toFixed(2),
      toDisplay(p.stress ?? 0, 'stress').toFixed(4)
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
        safetyFactor,
        supportCondition
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
      description: 'Custom user-defined load combination.',
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

  const updateCombinationDescription = (id: string, description: string) => {
    setCombinations(combinations.map(c => c.id === id ? { ...c, description } : c));
  };

  const removeCombination = (id: string) => {
    if (combinations.length <= 1) return;
    const newCombs = combinations.filter(c => c.id !== id);
    setCombinations(newCombs);
    if (activeCombinationId === id) setActiveCombinationId(newCombs[0].id);
  };

  const duplicateCombination = (id: string) => {
    const comb = combinations.find(c => c.id === id);
    if (!comb) return;
    const newComb: Combination = {
      ...comb,
      id: Math.random().toString(36).substr(2, 9),
      name: `${comb.name} (Copy)`
    };
    setCombinations([...combinations, newComb]);
    setActiveCombinationId(newComb.id);
  };

  const resetCombinations = () => {
    setCombinations(DEFAULT_COMBINATIONS);
    setActiveCombinationId(DEFAULT_COMBINATIONS[0].id);
  };

  const saveProject = () => {
    const projectData = {
      projectTitle,
      projectLocation,
      projectDescription,
      projectDate,
      projectTime,
      projectAttachment,
      length,
      material,
      sectionType,
      width,
      height,
      thickness,
      safetyFactor,
      supportCondition,
      selectedCodeId,
      loads,
      combinations,
      activeCombinationId,
      seismicRegion,
      seismicCoeff,
      thickness2,
      projectNotes
    };
    localStorage.setItem('facadecalc_project', JSON.stringify(projectData));
    setNotification({ message: t.projectSaved, type: 'success' });
  };

  const loadProject = () => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        applyState(data);
        setNotification({ message: t.projectLoaded, type: 'success' });
      } catch (e) {
        console.error("Failed to load project", e);
        setNotification({ message: 'Error loading project', type: 'error' });
      }
    } else {
      setNotification({ message: t.noProject, type: 'error' });
    }
  };

  const switchProject = (id: string) => {
    // Save current state to projects list first
    const currentState = getCurrentState();
    const updatedProjects = projects.map(p => p.id === activeProjectId ? { ...currentState, id: activeProjectId } : p);
    
    // If current project wasn't in list, add it (shouldn't happen with proper init)
    if (!projects.find(p => p.id === activeProjectId)) {
      updatedProjects.push({ ...currentState, id: activeProjectId });
    }
    
    setProjects(updatedProjects);
    localStorage.setItem('facadecalc_projects_list', JSON.stringify(updatedProjects));

    // Load new project
    const nextProject = updatedProjects.find(p => p.id === id);
    if (nextProject) {
      applyState(nextProject);
      setActiveProjectId(id);
      localStorage.setItem('facadecalc_active_project_id', id);
    }
  };

  const addNewProject = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newProj = createNewProject(newId, `Project ${projects.length + 1}`);
    
    // Save current before switching
    const currentState = getCurrentState();
    const updatedProjects = projects.map(p => p.id === activeProjectId ? { ...currentState, id: activeProjectId } : p);
    if (!projects.find(p => p.id === activeProjectId)) {
      updatedProjects.push({ ...currentState, id: activeProjectId });
    }
    
    const finalProjects = [...updatedProjects, newProj];
    setProjects(finalProjects);
    localStorage.setItem('facadecalc_projects_list', JSON.stringify(finalProjects));
    
    applyState(newProj);
    setActiveProjectId(newId);
    localStorage.setItem('facadecalc_active_project_id', newId);
    setNotification({ message: 'New project created', type: 'success' });
  };

  const deleteProject = (id: string) => {
    if (projects.length <= 1) {
      setNotification({ message: 'Cannot delete the only project', type: 'error' });
      return;
    }
    
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('facadecalc_projects_list', JSON.stringify(updatedProjects));
    
    if (activeProjectId === id) {
      const nextProj = updatedProjects[0];
      applyState(nextProj);
      setActiveProjectId(nextProj.id);
      localStorage.setItem('facadecalc_active_project_id', nextProj.id);
    }
    
    if (comparisonProjectId === id) {
      setComparisonProjectId(null);
      setIsBiViewMode(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-blue-100 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('calculator')}>
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-bold text-xl tracking-tight">{t.title}</h1>
              {view === 'calculator' && (
                <motion.div 
                  animate={results.summary.status === 'fail' ? { 
                    scale: [1, 1.05, 1],
                    transition: { repeat: Infinity, duration: 2 }
                  } : {}}
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm transition-all duration-500",
                    results.summary.status === 'pass' 
                      ? "bg-green-500 text-white" 
                      : "bg-red-500 text-white"
                  )}
                >
                  {results.summary.status === 'pass' ? 'PASS' : 'FAIL'}
                </motion.div>
              )}
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setView('calculator')}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  view === 'calculator' ? "text-blue-600" : "text-slate-500"
                )}
              >
                {t.navCalculator}
              </button>
              <button 
                onClick={() => setView('docs')}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  view === 'docs' ? "text-blue-600" : "text-slate-500"
                )}
              >
                {t.navDocs}
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 p-1 rounded-lg border">
              <Settings2 className="w-3.5 h-3.5 text-slate-500 ml-1" />
              <Select value={unitSystem} onValueChange={(v: any) => setUnitSystem(v)}>
                <SelectTrigger className="h-7 border-none bg-white shadow-none focus:ring-0 w-[90px] text-[10px] font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric</SelectItem>
                  <SelectItem value="imperial">Imperial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-slate-100 p-1 rounded-lg border">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
              <Select value={lang} onValueChange={(v: any) => setLang(v)}>
                <SelectTrigger className="h-7 border-none bg-white shadow-none focus:ring-0 w-[80px] text-[10px] font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="zh">ZH</SelectItem>
                  <SelectItem value="th">TH</SelectItem>
                  <SelectItem value="ms">MS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {view !== 'calculator' ? (
              <Button size="sm" onClick={() => setView('calculator')} className="bg-blue-600 hover:bg-blue-700">
                {t.getStarted}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 rounded-md p-0.5 mr-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={undo} 
                    disabled={past.length === 0}
                    className="h-7 w-7 text-slate-500 hover:text-blue-600 disabled:opacity-30"
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={redo} 
                    disabled={future.length === 0}
                    className="h-7 w-7 text-slate-500 hover:text-blue-600 disabled:opacity-30"
                    title="Redo (Ctrl+Y)"
                  >
                    <Redo2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <Button 
                  variant={isBiViewMode ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setIsBiViewMode(!isBiViewMode)}
                  className={cn("h-8 text-xs gap-2", isBiViewMode && "bg-blue-600")}
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Bi-View</span>
                </Button>

                <Button variant="outline" size="sm" onClick={saveProject} className="h-8 text-xs gap-2">
                  <Save className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{t.saveProject}</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 text-xs gap-2 px-3 py-1 bg-transparent border border-input hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">{t.print}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => window.print()} className="gap-2">
                      <Printer className="w-4 h-4 text-slate-500" />
                      <span>Print / PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToCSV} className="gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-green-500" />
                      <span>CSV</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Project Tabs Bar */}
      {view === 'calculator' && (
        <div className="bg-white border-b px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar print:hidden">
          {projects.map(p => (
            <div 
              key={p.id}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all cursor-pointer group shrink-0",
                activeProjectId === p.id 
                  ? "bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200" 
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              )}
              onClick={() => activeProjectId !== p.id && switchProject(p.id)}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="text-xs font-bold truncate max-w-[120px]">{p.projectTitle}</span>
              {projects.length > 1 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(p.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={addNewProject}
            className="h-8 w-8 p-0 rounded-full hover:bg-blue-50 hover:text-blue-600"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}

      <main className={cn("flex-1 flex flex-col", view === 'calculator' ? "overflow-hidden" : "overflow-y-auto")}>
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 py-8 md:py-24"
            >
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
                    <Activity className="w-3 h-3" />
                    v1.0.0 Now Live
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                    {t.heroTitle}
                  </h2>
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    {t.heroDesc}
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <Button size="lg" onClick={() => setView('calculator')} className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                      {t.getStarted}
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setView('docs')} className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg border-slate-200">
                      {t.howItWorks}
                    </Button>
                  </div>
                  <div className="flex items-center gap-6 pt-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                          <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                    <div className="text-sm">
                      <div className="font-bold text-slate-900">Trusted by 500+ Engineers</div>
                      <div className="text-slate-500">Worldwide facade design teams</div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-600/5 rounded-[2rem] blur-3xl" />
                  <Card className="relative border-slate-200 shadow-2xl overflow-hidden rounded-[2rem]">
                    <div className="aspect-video bg-slate-900 flex items-center justify-center">
                      <BeamVisualizer3D 
                        length={3500}
                        width={65}
                        height={150}
                        thickness={3.5}
                        thickness2={3.5}
                        sectionType="hollow"
                        supportCondition="simply_supported"
                        intermediateSupports={[]}
                        unitSystem="metric"
                      />
                    </div>
                    <CardContent className="p-6 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Preview</div>
                          <div className="text-lg font-bold text-slate-900">Interactive 3D Structural Model</div>
                        </div>
                        <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Validated
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-32 grid md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                    <Box className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">3D Visualization</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Real-time 3D rendering of your beam sections and applied loads for better spatial understanding.
                  </p>
                </div>
                <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Seismic Analysis</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Integrated seismic coefficient calculator supporting major international design codes.
                  </p>
                </div>
                <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Professional Reports</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Export high-quality PDF reports, CSV data, and JSON project files for your documentation.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col min-h-0 print:block overflow-hidden"
            >
              <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-0 print:block overflow-hidden">
                {/* Left Column: Inputs */}
                <div className="lg:col-span-4 xl:col-span-3 h-full overflow-y-auto p-3 sm:p-4 border-r border-slate-200 bg-slate-50/30 no-scrollbar print:hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                    {/* Analysis Mode Switch */}
                    <div className="px-1">
                      <Tabs value={calculationMode} onValueChange={(v: any) => {
                        setCalculationMode(v);
                        if (v === 'panel') {
                          // Default loads for panel?
                        }
                      }} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-9 p-1 bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm rounded-xl">
                          <TabsTrigger value="beam" className="text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300 flex items-center gap-1.5">
                            <Box className="w-3 h-3" />
                            {t.beamMode}
                          </TabsTrigger>
                          <TabsTrigger value="panel" className="text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300 flex items-center gap-1.5">
                            <Square className="w-3 h-3" />
                            {t.panelMode}
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    {/* Project Information */}
                    <Card className="shadow-sm border-slate-200 overflow-hidden">
                  <CardHeader className="p-3 sm:p-4 border-b bg-slate-50/50">
                    <div className="flex items-center gap-2 text-blue-600 mb-0.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Project Info</span>
                    </div>
                    <CardTitle className="text-sm sm:text-base">General Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 space-y-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="proj-title" className="text-[10px] uppercase font-bold text-slate-400">Project Title</Label>
                      <Input 
                        id="proj-title"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Enter project name..."
                        className="bg-white h-8 text-sm"
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Label htmlFor="proj-loc" className="text-[10px] uppercase font-bold text-slate-400">Location</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="w-2.5 h-2.5 text-slate-300 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-[10px]">Input location in any language (English, Chinese, Thai, etc.). Design codes will be auto-selected.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Dialog open={isLocationMapOpen} onOpenChange={setIsLocationMapOpen}>
                          <DialogTrigger render={<Button variant="ghost" className="h-4 px-1 text-[9px] text-blue-500 font-black flex items-center gap-1 hover:bg-blue-50" />}>
                            <Globe className="w-2.5 h-2.5" />
                            KEY MAP
                          </DialogTrigger>
                          <KeyMapDialog onSelect={(loc) => {
                            setProjectLocation(loc);
                            setIsLocationMapOpen(false);
                          }} />
                        </Dialog>
                      </div>
                      <div className="relative">
                        <Input 
                          id="proj-loc"
                          value={projectLocation}
                          onChange={(e) => setProjectLocation(e.target.value)}
                          placeholder="City, Country..."
                          className="bg-white h-8 text-sm pl-8"
                        />
                        <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      </div>
                      {(() => {
                        const loc = projectLocation.toLowerCase().trim();
                        let foundKey = "";
                        for (const key in LOCATION_CODE_MAPPING) {
                          if (LOCATION_CODE_MAPPING[key].matches.some(match => loc.includes(match.toLowerCase()))) {
                            foundKey = key;
                            break;
                          }
                        }
                        if (foundKey) {
                          return (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-100 rounded text-[9px] text-blue-700 font-bold animate-in fade-in slide-in-from-top-1">
                              <Zap className="w-2.5 h-2.5" />
                              AUTO-DETECTED: {foundKey} Standard Applied
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="proj-date" className="text-[10px] uppercase font-bold text-slate-400">Date</Label>
                        <Input 
                          id="proj-date"
                          type="date"
                          value={projectDate}
                          onChange={(e) => setProjectDate(e.target.value)}
                          className="bg-white h-8 text-xs"
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="proj-time" className="text-[10px] uppercase font-bold text-slate-400">Time</Label>
                        <Input 
                          id="proj-time"
                          type="time"
                          value={projectTime}
                          onChange={(e) => setProjectTime(e.target.value)}
                          className="bg-white h-8 text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="proj-desc" className="text-[10px] uppercase font-bold text-slate-400">Description</Label>
                      <textarea 
                        id="proj-desc"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Project details..."
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-white px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="proj-notes" className="text-[10px] uppercase font-bold text-slate-400">Structural Notes</Label>
                      <textarea 
                        id="proj-notes"
                        value={projectNotes}
                        onChange={(e) => setProjectNotes(e.target.value)}
                        placeholder="Add structural assumptions, member constraints, or local site conditions..."
                        className="flex min-h-[100px] w-full rounded-md border border-blue-100 bg-blue-50/20 px-3 py-2 text-xs text-blue-900 ring-offset-background placeholder:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Codes of Practice */}
                <Card className="shadow-sm border-slate-200 overflow-hidden">
                  <CardHeader className="p-3 sm:p-4 border-b bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-600">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t.codes}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2"
                        onClick={() => setShowAllCodes(!showAllCodes)}
                      >
                        {showAllCodes ? "Hide Options" : "Change Code"}
                      </Button>
                    </div>
                    <CardTitle className="text-sm sm:text-base mt-1">Design Standard</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-3 space-y-4">
                    {!showAllCodes ? (
                      // Only show active standard
                      <div className="bg-blue-50 border border-blue-200 ring-1 ring-blue-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter">Active Standard</span>
                            <span className="text-sm font-bold text-blue-900">{selectedCodeId}</span>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {CODES_OF_PRACTICE.find(c => c.country === selectedCodeId)?.codes.map((code, idx) => (
                            <span key={idx} className="text-[9px] px-2 py-0.5 bg-white text-blue-700 rounded-full border border-blue-100 font-medium">
                              {code}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 pt-2 border-t border-blue-100 flex items-center justify-between">
                          <span className="text-[9px] text-blue-600/70 italic">Units synced: {unitSystem === 'metric' ? 'Metric (SI)' : 'Imperial (US)'}</span>
                          <span className="text-[9px] font-bold text-blue-600">{CODES_OF_PRACTICE.find(c => c.country === selectedCodeId)?.region}</span>
                        </div>
                      </div>
                    ) : (
                      // Show all options for selection
                      Array.from(new Set(CODES_OF_PRACTICE.map(c => c.region))).map(region => (
                        <div key={region} className="space-y-1.5">
                          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1 flex items-center gap-2">
                            <span className="h-px flex-1 bg-blue-100"></span>
                            {region}
                            <span className="h-px flex-1 bg-blue-100"></span>
                          </h3>
                          <div className="grid grid-cols-1 gap-1">
                            {CODES_OF_PRACTICE.filter(c => c.region === region).map((item) => (
                              <div 
                                key={item.country} 
                                className={cn(
                                  "group relative flex flex-col p-2 rounded-lg border transition-all cursor-pointer",
                                  selectedCodeId === item.country 
                                    ? "bg-blue-50 border-blue-200 ring-1 ring-blue-200 shadow-sm" 
                                    : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50"
                                )}
                                onClick={() => {
                                  setSelectedCodeId(item.country);
                                  setShowAllCodes(false);
                                }}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className={cn(
                                    "text-[11px] font-bold transition-colors",
                                    selectedCodeId === item.country ? "text-blue-700" : "text-slate-700 group-hover:text-slate-900"
                                  )}>
                                    {item.country}
                                  </span>
                                  {selectedCodeId === item.country && (
                                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {item.codes.map((code, idx) => (
                                    <span key={idx} className="text-[8px] px-1 py-0.5 bg-slate-100 text-slate-500 rounded-sm border border-slate-200/50">
                                      {code.split(' (')[0]}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Reference Attachment */}
                <ReferenceAttachmentCard 
                  attachment={projectAttachment}
                  onAttachmentChange={setProjectAttachment}
                  setNotification={setNotification}
                  onApplyPreset={(preset) => {
                    setProjectAttachment(preset.url);
                    setWidth(preset.dimensions.width);
                    setHeight(preset.dimensions.height);
                    setThickness(preset.dimensions.thickness);
                    setThickness2(preset.dimensions.thickness2 ?? preset.dimensions.thickness);
                    if ((preset as any).sectionType) {
                      setSectionType((preset as any).sectionType);
                    } else {
                      setSectionType('hollow');
                    }
                    setNotification({ message: `Applied ${preset.name} preset`, type: 'success' });
                  }}
                />

                {/* Active Combination Selector for Mobile/Quick Access */}
                <Card className="shadow-sm border-slate-200 lg:hidden overflow-hidden">
                  <CardContent className="p-3">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block">{t.activeCase}</Label>
                    <Select value={activeCombinationId} onValueChange={setActiveCombinationId}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {combinations.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
          
                {/* Combinations Manager */}
                <Card className="shadow-sm border-slate-200 overflow-hidden">
                  <CardHeader className="p-3 sm:p-4 border-b bg-slate-50/50 flex flex-row items-center justify-between space-y-0">
                    <div>
                      <div className="flex items-center gap-2 text-blue-600 mb-0.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t.combinations}</span>
                      </div>
                      <CardTitle className="text-sm sm:text-base">{t.combinations.split(' ')[1]}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Dialog open={isCombinationManagerOpen} onOpenChange={setIsCombinationManagerOpen}>
                        <DialogTrigger render={<Button size="icon" variant="outline" className="h-7 w-7" />}>
                          <Settings className="h-3.5 w-3.5" />
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{t.combinations}</DialogTitle>
                            <DialogDescription>
                              Manage load factors for different analysis cases.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6 py-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button onClick={addCombination} size="sm" className="gap-2">
                                  <PlusCircle className="h-4 w-4" />
                                  Add Combination
                                </Button>
                                <Button onClick={resetCombinations} variant="outline" size="sm" className="gap-2">
                                  <RotateCcw className="h-4 w-4" />
                                  Reset to Defaults
                                </Button>
                              </div>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-slate-50">
                                    <TableHead className="w-[250px]">
                                      <div className="flex items-center gap-1">
                                        Name & Description
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <HelpCircle className="h-3 w-3 text-slate-400" />
                                          </TooltipTrigger>
                                          <TooltipContent side="top" className="text-[10px] max-w-[200px]">
                                            Define the name and a brief description for each load combination.
                                          </TooltipContent>
                                        </Tooltip>
                                      </div>
                                    </TableHead>
                                    {Object.entries(LOAD_CATEGORIES).map(([key, cat]) => (
                                      <TableHead key={key} className="text-center px-2">
                                        <div className="text-[10px] uppercase text-slate-400">{key}</div>
                                        <div className="text-[10px] font-bold">{cat.name.split(' ')[0]}</div>
                                      </TableHead>
                                    ))}
                                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {combinations.map((comb) => (
                                    <TableRow key={comb.id} className={cn(activeCombinationId === comb.id && "bg-blue-50/50")}>
                                      <TableCell className="space-y-1.5">
                                        <Input 
                                          value={comb.name} 
                                          onChange={(e) => updateCombinationName(comb.id, e.target.value)}
                                          className="h-8 font-medium"
                                          placeholder="Name"
                                        />
                                        <Input 
                                          value={comb.description} 
                                          onChange={(e) => updateCombinationDescription(comb.id, e.target.value)}
                                          className="h-7 text-[10px] text-slate-500 italic"
                                          placeholder="Description"
                                        />
                                      </TableCell>
                                      {Object.keys(LOAD_CATEGORIES).map((key) => (
                                        <TableCell key={key} className="px-1">
                                          <NumericInputWithControls 
                                            min={-10}
                                            max={10}
                                            step={0.1}
                                            precision={2}
                                            value={comb.factors[key as keyof typeof LOAD_CATEGORIES] ?? 0} 
                                            onChange={(val) => updateCombinationFactor(comb.id, key as keyof typeof LOAD_CATEGORIES, val)}
                                            className="w-24 mx-auto"
                                          />
                                        </TableCell>
                                      ))}
                                      <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-slate-400 hover:text-blue-600"
                                            onClick={() => duplicateCombination(comb.id)}
                                            title="Duplicate"
                                          >
                                            <Copy className="h-4 w-4" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-slate-400 hover:text-rose-500"
                                            onClick={() => removeCombination(comb.id)}
                                            disabled={combinations.length <= 1}
                                            title="Delete"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button onClick={() => setIsCombinationManagerOpen(false)}>Close</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button size="icon" variant="outline" onClick={addCombination} className="h-7 w-7">
                        <PlusCircle className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-3 space-y-1.5">
                    {combinations.map(comb => (
                      <div 
                        key={comb.id}
                        className={cn(
                          "p-2 border rounded-lg transition-all group relative",
                          activeCombinationId === comb.id 
                            ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/30 shadow-sm" 
                            : "bg-white hover:border-slate-300 hover:bg-slate-50/30"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex-1 min-w-0 mr-1.5 flex items-center gap-1.5">
                            <Input 
                              value={comb.name ?? ''} 
                              onChange={(e) => updateCombinationName(comb.id, e.target.value)}
                              className="h-5 text-[10px] font-bold border-none bg-transparent p-0 focus-visible:ring-0 truncate text-slate-700 placeholder:text-slate-300 flex-1"
                              placeholder="Combination Name"
                            />
                            <Tooltip>
                              <TooltipTrigger className="bg-transparent border-none p-0 cursor-help flex items-center shrink-0">
                                <Info className="h-3 w-3 text-slate-300 group-hover:text-blue-500 transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-[200px] p-2 space-y-1">
                                <p className="font-bold text-[10px] text-blue-600">{comb.name || 'Combination Detail'}</p>
                                <p className="text-[9px] text-slate-500 leading-relaxed">{comb.description || 'No description provided'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <div 
                              className="h-5 w-5 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-100/50 rounded transition-colors cursor-pointer"
                              onClick={() => duplicateCombination(comb.id)}
                              title="Duplicate"
                            >
                              <Copy className="h-2.5 w-2.5" />
                            </div>
                            <div 
                              className="h-5 w-5 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-100/50 rounded transition-colors cursor-pointer"
                              onClick={() => removeCombination(comb.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </div>
                            <div className="ml-1">
                              <div 
                                className={cn(
                                  "h-5 text-[8px] px-1.5 font-black uppercase tracking-tighter flex items-center justify-center rounded border transition-colors cursor-pointer",
                                  activeCombinationId === comb.id ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : "text-slate-400 border-slate-200 hover:bg-slate-50"
                                )}
                                onClick={() => setActiveCombinationId(comb.id)}
                              >
                                {activeCombinationId === comb.id ? "Active" : "Select"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-5 gap-0.5 bg-slate-100/80 rounded-sm p-0.5 sm:p-1">
                          {Object.entries(LOAD_CATEGORIES).map(([key]) => (
                            <div key={key} className="text-center border-r border-slate-200/50 last:border-none px-0.5">
                              <div className="text-[5px] sm:text-[6px] uppercase text-slate-500 font-black leading-none mb-0.5">{key[0]}</div>
                              <div className={cn(
                                "text-[8px] sm:text-[9px] font-mono font-bold leading-none",
                                comb.factors[key as keyof typeof LOAD_CATEGORIES] > 0 ? "text-blue-600" : "text-slate-400"
                              )}>
                                {comb.factors[key as keyof typeof LOAD_CATEGORIES]}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Geometry & Material */}
                <Card className="shadow-sm border-slate-200 overflow-hidden">
                  <CardHeader className="p-3 sm:p-4 border-b bg-slate-50/50">
                    <div className="flex items-center gap-2 text-blue-600 mb-0.5">
                      <Settings2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{calculationMode === 'beam' ? t.properties : t.panelProps}</span>
                    </div>
                    <CardTitle className="text-sm sm:text-base">{calculationMode === 'beam' ? t.properties : t.panelProps}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 space-y-3">
                    <div className="grid gap-1.5">
                      <Label className="text-[10px] uppercase font-bold text-slate-400">{t.unitSystem}</Label>
                      <Tabs value={unitSystem} onValueChange={(v: any) => setUnitSystem(v)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-8">
                          <TabsTrigger value="metric" className="text-[10px]">{t.metric}</TabsTrigger>
                          <TabsTrigger value="imperial" className="text-[10px]">{t.imperial}</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="length" className="text-[10px] uppercase font-bold text-slate-400">{calculationMode === 'beam' ? t.span : 'Panel Height'} ({u.length})</Label>
                      <NumericInputWithControls 
                        id="length"
                        min={toDisplay(100, 'length')}
                        max={toDisplay(50000, 'length')}
                        step={unitSystem === 'metric' ? 100 : 1}
                        precision={unitSystem === 'metric' ? 0 : 2}
                        value={toDisplay(length ?? 0, 'length')} 
                        onChange={(val) => setLength(fromDisplay(val, 'length'))}
                      />
                    </div>

                    {calculationMode === 'panel' && (
                      <div className="grid gap-1.5">
                        <Label htmlFor="width" className="text-[10px] uppercase font-bold text-slate-400">Panel Width ({u.length})</Label>
                        <NumericInputWithControls 
                          id="width" 
                          min={toDisplay(100, 'length')}
                          max={toDisplay(50000, 'length')}
                          step={unitSystem === 'metric' ? 100 : 1}
                          precision={unitSystem === 'metric' ? 0 : 2}
                          value={toDisplay(width ?? 0, 'length')} 
                          onChange={(val) => setWidth(fromDisplay(val, 'length'))}
                        />
                      </div>
                    )}
                    
                    <div className="grid gap-1.5">
                      <Label className="text-[10px] uppercase font-bold text-slate-400">{calculationMode === 'beam' ? t.material : t.skinMaterial}</Label>
                      {calculationMode === 'beam' ? (
                        <Select value={material} onValueChange={(v: any) => setMaterial(v)}>
                          <SelectTrigger className="bg-white h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(new Set(Object.values(MATERIALS).map(m => m.category))).map(category => (
                              <SelectGroup key={category}>
                                <SelectLabel className="text-blue-600 font-bold px-2 py-1.5 text-[10px] uppercase tracking-wider bg-blue-50/50">{category}</SelectLabel>
                                {Object.entries(MATERIALS)
                                  .filter(([_, m]) => m.category === category)
                                  .map(([key, m]) => (
                                    <SelectItem key={key} value={key} className="text-xs">{m.name}</SelectItem>
                                  ))}
                              </SelectGroup>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Select value={panelMaterialId} onValueChange={(v: any) => setPanelMaterialId(v)}>
                          <SelectTrigger className="bg-white h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(PANEL_MATERIALS).map(([key, m]) => (
                              <SelectItem key={key} value={key} className="text-xs">{m.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="safetyFactor" className="text-[10px] uppercase font-bold text-slate-400">{t.safetyFactor} (γ)</Label>
                        <NumericInputWithControls 
                          id="safetyFactor" 
                          min={1}
                          max={20}
                          step={0.1}
                          precision={1}
                          value={safetyFactor ?? 1} 
                          onChange={(val) => setSafetyFactor(val)}
                        />
                      </div>

                      {calculationMode === 'beam' && (
                        <div className="grid gap-1.5">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">{t.supportCondition}</Label>
                          <Select value={supportCondition} onValueChange={(v: any) => setSupportCondition(v)}>
                            <SelectTrigger className="bg-white h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="simply_supported" className="text-xs">{t.simplySupported}</SelectItem>
                              <SelectItem value="cantilever" className="text-xs">{t.cantilever}</SelectItem>
                              <SelectItem value="propped_cantilever" className="text-xs">{t.proppedCantilever}</SelectItem>
                              <SelectItem value="fixed_fixed" className="text-xs">{t.fixedFixed}</SelectItem>
                              <SelectItem value="fixed_pinned" className="text-xs">{t.fixedPinned}</SelectItem>
                              <SelectItem value="continuous" className="text-xs">{t.continuous}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {calculationMode === 'beam' && supportCondition === 'continuous' && (
                      <div className="grid gap-1.5 p-2 bg-blue-50/50 rounded-md border border-blue-100">
                        <Label className="text-[10px] uppercase font-bold text-blue-600 flex items-center justify-between">
                          Intermediate Supports (mm)
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 text-blue-600 hover:bg-blue-100"
                            onClick={() => {
                              const newPos = Math.round(length / 2);
                              if (!intermediateSupports.includes(newPos)) {
                                setIntermediateSupports([...intermediateSupports, newPos].sort((a, b) => a - b));
                              }
                            }}
                          >
                            <PlusCircle className="h-3 w-3" />
                          </Button>
                        </Label>
                        <div className="space-y-1.5">
                          {intermediateSupports.map((pos, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <NumericInputWithControls
                                id={`support-${idx}`}
                                value={toDisplay(pos, 'length')}
                                min={0.1}
                                max={toDisplay(length, 'length') - 0.1}
                                onChange={(val) => {
                                  const newSupports = [...intermediateSupports];
                                  newSupports[idx] = fromDisplay(val, 'length');
                                  setIntermediateSupports(newSupports.sort((a, b) => a - b));
                                }}
                                className="h-7 text-xs"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-rose-500"
                                onClick={() => setIntermediateSupports(intermediateSupports.filter((_, i) => i !== idx))}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                          {intermediateSupports.length === 0 && (
                            <div className="text-[10px] text-slate-400 italic text-center py-1">No mid-supports added</div>
                          )}
                        </div>
                      </div>
                    )}

                    {calculationMode === 'beam' && (
                      <div className="grid gap-1.5">
                        <Label className="text-[10px] uppercase font-bold text-slate-400">Beam Type</Label>
                        <Tabs value={beamType} onValueChange={(v: any) => setBeamType(v)} className="w-full">
                          <TabsList className="grid w-full grid-cols-2 h-8">
                            <TabsTrigger value="mullion" className="text-[10px]">Mullion (Vertical)</TabsTrigger>
                            <TabsTrigger value="transom" className="text-[10px]">Transom (Horizontal)</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    )}

                    <Separator className="my-1" />

                    {calculationMode === 'beam' ? (
                      <>
                        <div className="grid gap-1.5">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">{t.sectionType}</Label>
                          <Tabs value={sectionType} onValueChange={(v: any) => setSectionType(v)} className="w-full">
                            <TabsList className="grid w-full grid-cols-4 h-8">
                              <TabsTrigger value="solid" className="text-[10px]">{t.solid}</TabsTrigger>
                              <TabsTrigger value="hollow" className="text-[10px]">{t.hollow}</TabsTrigger>
                              <TabsTrigger value="channel" className="text-[10px]">Channel</TabsTrigger>
                              <TabsTrigger value="l-plate" className="text-[10px]">L-Plate</TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-1.5">
                            <Label htmlFor="width" className="text-[10px] uppercase font-bold text-slate-400">{t.width} ({u.length})</Label>
                            <NumericInputWithControls 
                              id="width" 
                              min={toDisplay(1, 'length')}
                              max={toDisplay(1000, 'length')}
                              step={unitSystem === 'metric' ? 1 : 0.1}
                              precision={unitSystem === 'metric' ? 0 : 2}
                              value={toDisplay(width ?? 0, 'length')} 
                              onChange={(val) => setWidth(fromDisplay(val, 'length'))}
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="height" className="text-[10px] uppercase font-bold text-slate-400">{t.height} ({u.length})</Label>
                            <NumericInputWithControls 
                              id="height" 
                              min={toDisplay(1, 'length')}
                              max={toDisplay(1000, 'length')}
                              step={unitSystem === 'metric' ? 1 : 0.1}
                              precision={unitSystem === 'metric' ? 0 : 2}
                              value={toDisplay(height ?? 0, 'length')} 
                              onChange={(val) => setHeight(fromDisplay(val, 'length'))}
                            />
                          </div>
                        </div>

                        {sectionType !== 'solid' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-1.5">
                              <Label htmlFor="thickness" className="text-[10px] uppercase font-bold text-slate-400">
                                {sectionType === 'hollow' ? 'Width Thickness (tx)' : 
                                 sectionType === 'channel' ? 'Web Thickness (tw)' : 
                                 'Horiz. Thickness (th)'} ({u.length})
                              </Label>
                              <NumericInputWithControls 
                                id="thickness" 
                                min={toDisplay(0.1, 'length')}
                                max={toDisplay(Math.max(width, height) / 2.1, 'length')}
                                step={unitSystem === 'metric' ? 0.1 : 0.01}
                                precision={unitSystem === 'metric' ? 1 : 3}
                                value={toDisplay(thickness ?? 0, 'length')} 
                                onChange={(val) => setThickness(fromDisplay(val, 'length'))}
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <Label htmlFor="thickness2" className="text-[10px] uppercase font-bold text-slate-400">
                                {sectionType === 'hollow' ? 'Height Thickness (ty)' : 
                                 sectionType === 'channel' ? 'Flange Thickness (tf)' : 
                                 'Vert. Thickness (tv)'} ({u.length})
                              </Label>
                              <NumericInputWithControls 
                                id="thickness2" 
                                min={toDisplay(0.1, 'length')}
                                max={toDisplay(Math.min(width, height) / 2.1, 'length')}
                                step={unitSystem === 'metric' ? 0.1 : 0.01}
                                precision={unitSystem === 'metric' ? 1 : 3}
                                value={toDisplay(thickness2 ?? 0, 'length')} 
                                onChange={(val) => setThickness2(fromDisplay(val, 'length'))}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="grid gap-1.5">
                          <Label htmlFor="skin-thickness" className="text-[10px] uppercase font-bold text-slate-400">Skin/Panel Thickness ({u.length})</Label>
                          <NumericInputWithControls 
                            id="skin-thickness"
                            min={0.1}
                            max={50}
                            step={0.1}
                            value={panelMaterialId.includes('acm') ? (PANEL_MATERIALS[panelMaterialId] as any).totalThickness : (thickness || 3)}
                            onChange={(val) => setThickness(val)}
                            disabled={panelMaterialId.includes('acm')}
                          />
                          {panelMaterialId.includes('acm') && <p className="text-[9px] text-slate-400 italic">ACM thickness is fixed per specification.</p>}
                        </div>
                      </>
                    )}
                  </CardContent>
                  {calculationMode === 'beam' && (
                    <CardFooter className="bg-slate-50/50 border-t px-4 py-2">
                      <div className="w-full grid grid-cols-2 gap-4 text-[9px] font-mono text-slate-500 uppercase font-bold">
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="cursor-help hover:text-blue-600 transition-colors">I: {sectionProps.momentOfInertia.toExponential(2)} mm⁴</div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px] text-[10px]">
                            <p><strong>Moment of Inertia (I)</strong>: A geometric property that measures a shape's resistance to bending. Higher values mean less deflection.</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="cursor-help hover:text-blue-600 transition-colors">W: {sectionProps.sectionModulus.toExponential(2)} mm³</div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px] text-[10px]">
                            <p><strong>Section Modulus (W)</strong>: Ratio of Moment of Inertia to distance from neutral axis. Used to calculate maximum bending stress.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </CardFooter>
                  )}
                </Card>

                {calculationMode === 'panel' && (
                  <Card className="shadow-sm border-slate-200 overflow-hidden">
                    <CardHeader className="p-3 sm:p-4 border-b bg-rose-50/50">
                      <div className="flex items-center gap-2 text-rose-600 mb-0.5">
                        <Layout className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t.stiffenerProps}</span>
                      </div>
                      <CardTitle className="text-sm sm:text-base">Panel Reinforcement</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 space-y-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="stiffener-count" className="text-[10px] uppercase font-bold text-slate-400">Total Stiffeners</Label>
                        <NumericInputWithControls 
                          id="stiffener-count"
                          min={0}
                          max={10}
                          value={stiffenerCount}
                          onChange={(val) => setStiffenerCount(val)}
                        />
                      </div>
                      
                      {stiffenerCount > 0 && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-1.5">
                              <Label htmlFor="s-width" className="text-[10px] uppercase font-bold text-slate-400">Stiffener Width</Label>
                              <NumericInputWithControls id="s-width" min={1} value={stiffenerWidth} onChange={setStiffenerWidth} />
                            </div>
                            <div className="grid gap-1.5">
                              <Label htmlFor="s-height" className="text-[10px] uppercase font-bold text-slate-400">Stiffener Height</Label>
                              <NumericInputWithControls id="s-height" min={1} value={stiffenerHeight} onChange={setStiffenerHeight} />
                            </div>
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="s-thick" className="text-[10px] uppercase font-bold text-slate-400">Stiffener Thickness</Label>
                            <NumericInputWithControls id="s-thick" min={0.5} max={10} step={0.1} value={stiffenerThickness} onChange={setStiffenerThickness} />
                          </div>
                          <div className="p-2 bg-rose-50 border border-rose-100 rounded-md">
                            <p className="text-[9px] text-rose-700 leading-tight">
                              <strong>Note:</strong> Stiffeners are assumed to span vertically (parallel to panel height). Tributary width is calculated as Panel Width / (N+1).
                            </p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}
          
          {/* Material Properties */}
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardHeader className="p-3 sm:p-4 border-b bg-slate-50/50">
              <div className="flex items-center gap-2 text-blue-600 mb-0.5">
                <Info className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t.materialProps}</span>
              </div>
              <CardTitle className="text-sm sm:text-base">{MATERIALS[material].name}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Tooltip>
                    <TooltipTrigger className="text-[9px] uppercase font-bold text-slate-400 cursor-help hover:text-blue-600 transition-colors flex items-center gap-1 bg-transparent border-none p-0 inline-flex">
                        Young's Modulus (E) <HelpCircle className="w-2.5 h-2.5" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px] text-[10px]">
                      <p><strong>Elastic Modulus (E)</strong>: A measure of material stiffness. It defines the relationship between stress and strain. Higher E means a stiffer material.</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="text-xs font-semibold bg-slate-50 p-1.5 rounded border border-slate-100">
                    {toDisplay(MATERIALS[material].e, 'stress').toLocaleString()} {u.stress}
                  </div>
                </div>
                <div className="space-y-1">
                  <Tooltip>
                    <TooltipTrigger className="text-[9px] uppercase font-bold text-slate-400 cursor-help hover:text-blue-600 transition-colors flex items-center gap-1 bg-transparent border-none p-0 inline-flex">
                        Yield Strength (σy) <HelpCircle className="w-2.5 h-2.5" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px] text-[10px]">
                      <p><strong>Yield Strength</strong>: The stress level at which a material begins to deform plastically. Beyond this point, deformation is permanent.</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="text-xs font-semibold bg-slate-50 p-1.5 rounded border border-slate-100">
                    {toDisplay(MATERIALS[material].yield, 'stress').toLocaleString()} {u.stress}
                  </div>
                </div>
                <div className="space-y-1">
                  <Tooltip>
                    <TooltipTrigger className="text-[9px] uppercase font-bold text-slate-400 cursor-help hover:text-blue-600 transition-colors flex items-center gap-1 bg-transparent border-none p-0 inline-flex">
                        Poisson's Ratio (ν) <HelpCircle className="w-2.5 h-2.5" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px] text-[10px]">
                      <p><strong>Poisson's Ratio</strong>: The ratio of transverse strain to axial strain. For most metals, it is around 0.3.</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="text-xs font-semibold bg-slate-50 p-1.5 rounded border border-slate-100">
                    {MATERIALS[material].poisson.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seismic Analysis */}
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardHeader className="p-3 sm:p-4 border-b bg-slate-50/50">
              <div className="flex items-center gap-2 text-rose-600 mb-0.5">
                <Activity className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t.seismic}</span>
              </div>
              <CardTitle className="text-sm sm:text-base">{t.seismic}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-3">
              <div className="grid gap-1.5">
                <Label className="text-[10px] uppercase font-bold text-slate-400">{t.seismicRegion}</Label>
                <Select 
                  value={seismicRegion} 
                  onValueChange={(v: any) => {
                    setSeismicRegion(v);
                    setSeismicCoeff(SEISMIC_REGIONS[v as keyof typeof SEISMIC_REGIONS].coeff);
                  }}
                >
                  <SelectTrigger className="bg-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SEISMIC_REGIONS).map(([key, region]) => (
                      <SelectItem key={key} value={key} className="text-xs">{region.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[9px] text-slate-400 italic leading-tight">
                  {SEISMIC_REGIONS[seismicRegion].desc}
                </p>
              </div>

              <div className="grid gap-1.5">
                <Label className="text-[10px] uppercase font-bold text-slate-400">{t.seismicCoeff}</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <NumericInputWithControls 
                      min={0}
                      max={10}
                      step={0.01}
                      precision={2}
                      value={seismicCoeff} 
                      onChange={(val) => setSeismicCoeff(val)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-blue-600 shrink-0"
                      onClick={() => setSeismicCoeff(SEISMIC_REGIONS[seismicRegion].coeff)}
                      title="Reset to region default"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2 h-8 border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-bold uppercase tracking-wider"
                    onClick={applySeismicLoad}
                  >
                    <PlusCircle className="w-3 h-3" />
                    {t.applySeismic}
                  </Button>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-medium px-1">
                  <span>Total Dead Load:</span>
                  <span>{unitSystem === 'metric' ? (totalDeadMagnitude / 1000).toFixed(2) + ' kN' : (toDisplay(totalDeadMagnitude, 'force') / 1000).toFixed(2) + ' kip'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

                {/* Loads */}
                <Card className="shadow-sm border-slate-200 overflow-hidden">
                  <CardHeader className="p-3 sm:p-4 border-b bg-slate-50/50 flex flex-row items-center justify-between space-y-0">
                    <div>
                      <div className="flex items-center gap-2 text-blue-600 mb-0.5">
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t.loading}</span>
                      </div>
                      <CardTitle className="text-sm sm:text-base">{t.loading}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="outline" onClick={() => addLoad('point')} className="h-7 w-7" title="Add Point Load">
                        <div className="w-0.5 h-2.5 bg-rose-500 rounded-full" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => addLoad('udl')} className="h-7 w-7" title="Add UDL">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => addLoad('trapezoidal')} className="h-7 w-7" title="Add Trapezoidal Load">
                        <Layout className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-3 space-y-2">
                    {loads.map((load, idx) => (
                <div key={load.id} className="relative overflow-hidden rounded-lg border bg-white group hover:border-blue-200 transition-colors">
                  {/* Swipe Action Background */}
                  <div className="absolute inset-0 bg-rose-500 flex items-center justify-end pr-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-white hover:bg-rose-600 font-bold gap-2 px-4 h-full rounded-none"
                      onClick={() => removeLoad(load.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Confirm
                    </Button>
                  </div>

                    <motion.div 
                      drag="x"
                      dragConstraints={{ left: -100, right: 0 }}
                      dragElastic={0.1}
                      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                      className="p-2 bg-white space-y-2 relative z-10"
                    >
                      <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => {
                            const newLoad = { ...load, id: Math.random().toString(36).substr(2, 9) };
                            setLoads([...loads, newLoad]);
                          }}
                          title="Duplicate Load"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 flex-1">
                          <span className="text-[9px] font-bold bg-slate-100 px-1 py-0.5 rounded text-slate-500">#{idx + 1}</span>
                          <Select 
                            value={load.type} 
                            onValueChange={(v: any) => updateLoad(load.id, { 
                              type: v,
                              value2: v === 'trapezoidal' ? load.value : undefined,
                              start: v === 'trapezoidal' ? 0 : undefined,
                              end: v === 'trapezoidal' ? length : undefined
                            })}
                          >
                            <SelectTrigger className="h-6 text-[10px] border-slate-200 bg-slate-50/50 px-1.5 w-[90px] focus:ring-1 focus:ring-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="udl" className="text-[10px]">UDL ({u.udl})</SelectItem>
                              <SelectItem value="point" className="text-[10px]">Point ({u.force})</SelectItem>
                              <SelectItem value="trapezoidal" className="text-[10px]">Trapezoidal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                    
                        <Select 
                          value={load.category} 
                          onValueChange={(v: any) => updateLoad(load.id, { category: v })}
                        >
                          <SelectTrigger className={cn(
                            "h-6 text-[9px] font-bold px-2 rounded-full border-none focus:ring-0 w-fit shadow-sm",
                            LOAD_CATEGORIES[load.category].bg,
                            LOAD_CATEGORIES[load.category].color
                          )}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(LOAD_CATEGORIES).map(([key, cat]) => (
                              <SelectItem key={key} value={key} className="text-[10px]">{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex-1" />

                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          onClick={() => removeLoad(load.id)}
                          title="Remove Load"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>

                  <div className="bg-slate-50/50 p-1.5 rounded-md border border-slate-100 flex-1 flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-0.5">
                        <Label className="text-[8px] uppercase font-bold text-slate-400">
                          {load.type === 'trapezoidal' ? `w1 (${u.udl})` : `Value (${load.type === 'point' ? u.force : u.udl})`}
                        </Label>
                        <NumericInputWithControls 
                          min={-1000000}
                          max={1000000}
                          step={load.type === 'point' ? (unitSystem === 'metric' ? 100 : 10) : (unitSystem === 'metric' ? 0.5 : 0.05)}
                          precision={unitSystem === 'metric' ? 2 : 4}
                          value={toDisplay(load.value ?? 0, load.type === 'point' ? 'force' : 'udl')} 
                          onChange={(val) => updateLoad(load.id, { value: fromDisplay(val, load.type === 'point' ? 'force' : 'udl') })}
                        />
                      </div>
                      {load.type === 'point' && (
                        <div className="space-y-0.5">
                          <Label className="text-[8px] uppercase font-bold text-slate-400">Pos ({u.length})</Label>
                          <NumericInputWithControls 
                            min={0}
                            max={toDisplay(length, 'length')}
                            step={unitSystem === 'metric' ? 100 : 1}
                            precision={unitSystem === 'metric' ? 0 : 2}
                            value={toDisplay(load.position ?? 0, 'length')} 
                            onChange={(val) => updateLoad(load.id, { position: fromDisplay(val, 'length') })}
                          />
                        </div>
                      )}
                      {load.type === 'trapezoidal' && (
                        <div className="space-y-0.5">
                          <Label className="text-[8px] uppercase font-bold text-slate-400">w2 ({u.udl})</Label>
                          <NumericInputWithControls 
                            min={-1000000}
                            max={1000000}
                            step={unitSystem === 'metric' ? 0.5 : 0.05}
                            precision={unitSystem === 'metric' ? 2 : 4}
                            value={toDisplay(load.value2 ?? load.value, 'udl')} 
                            onChange={(val) => updateLoad(load.id, { value2: fromDisplay(val, 'udl') })}
                          />
                        </div>
                      )}
                    </div>

                    {load.type === 'trapezoidal' && (
                      <div className="grid grid-cols-2 gap-2 mt-1.5">
                        <div className="space-y-0.5">
                          <Label className="text-[8px] uppercase font-bold text-slate-400">Start ({u.length})</Label>
                          <NumericInputWithControls 
                            min={0}
                            max={toDisplay(length, 'length')}
                            step={unitSystem === 'metric' ? 100 : 1}
                            precision={unitSystem === 'metric' ? 0 : 2}
                            value={toDisplay(load.start ?? 0, 'length')} 
                            onChange={(val) => updateLoad(load.id, { start: fromDisplay(val, 'length') })}
                          />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-[8px] uppercase font-bold text-slate-400">End ({u.length})</Label>
                          <NumericInputWithControls 
                            min={0}
                            max={toDisplay(length, 'length')}
                            step={unitSystem === 'metric' ? 100 : 1}
                            precision={unitSystem === 'metric' ? 0 : 2}
                            value={toDisplay(load.end ?? length, 'length')} 
                            onChange={(val) => updateLoad(load.id, { end: fromDisplay(val, 'length') })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
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
      </div>
    </div>

                {/* Right Column: Results & Visuals */}
                <div className={cn(
                  "h-full overflow-y-auto p-3 sm:p-4 space-y-4 no-scrollbar print:block",
                  isBiViewMode ? "lg:col-span-12" : "lg:col-span-8 xl:col-span-9"
                )}>
                  {/* Print Only Header */}
                  <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-3xl font-bold text-slate-900">{projectTitle || t.title}</h1>
                        <p className="text-slate-500 font-medium">{projectLocation || t.subtitle}</p>
                        <div className="mt-6 grid grid-cols-2 gap-x-16 gap-y-3 text-sm">
                          <div className="flex gap-2"><span className="font-bold text-slate-700">Date:</span> <span>{projectDate} {projectTime}</span></div>
                          <div className="flex gap-2"><span className="font-bold text-slate-700">Description:</span> <span className="truncate max-w-[200px]">{projectDescription || 'N/A'}</span></div>
                          <div className="flex gap-2"><span className="font-bold text-slate-700">Design Code:</span> <span className="text-blue-700 font-bold">{selectedCodeId}</span></div>
                          <div className="flex gap-2"><span className="font-bold text-slate-700">Combination:</span> <span>{activeCombination.name}</span></div>
                          <div className="flex gap-2"><span className="font-bold text-slate-700">Material:</span> <span>{MATERIALS[material].name}</span></div>
                          <div className="flex gap-2"><span className="font-bold text-slate-700">Span:</span> <span>{toDisplay(length ?? 0, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)} {u.length}</span></div>
                          <div className="flex gap-2"><span className="font-bold text-slate-700">Section:</span> <span>{sectionType === 'hollow' ? `${toDisplay(width ?? 0, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)}x${toDisplay(height ?? 0, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)}x${toDisplay(thickness ?? 0, 'length').toFixed(unitSystem === 'metric' ? 1 : 3)}${u.length}` : `${toDisplay(width ?? 0, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)}x${toDisplay(height ?? 0, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)}${u.length}`}</span></div>
                        </div>
                        {projectNotes && (
                          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Structural Notes</p>
                            <p className="text-xs text-slate-600 italic whitespace-pre-wrap">{projectNotes}</p>
                          </div>
                        )}
                      </div>
                      <div className={cn(
                        "px-6 py-4 rounded-xl border-4 font-black text-2xl tracking-tighter",
                        results.summary.status === 'pass' ? "border-green-500 text-green-600 bg-green-50" : "border-red-500 text-red-600 bg-red-50"
                      )}>
                        {results.summary.status === 'pass' ? "PASS" : "FAIL"}
                      </div>
                    </div>
                  </div>
          {isBiViewMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-lg font-bold text-slate-900">Primary Project</h2>
                  <div className="px-2 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">Active</div>
                </div>
                <ProjectResultsView 
                  project={{ ...getCurrentState(), id: activeProjectId }}
                  results={results}
                  panelResults={panelResults}
                  calculationMode={calculationMode}
                  unitSystem={unitSystem}
                  t={t}
                  u={u}
                  toDisplay={toDisplay}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  isChartExpanded={isChartExpanded}
                  setIsChartExpanded={setIsChartExpanded}
                  criticalPoints={criticalPoints}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-lg font-bold text-slate-900">Comparison Project</h2>
                  <Select 
                    value={comparisonProjectId || ''} 
                    onValueChange={setComparisonProjectId}
                  >
                    <SelectTrigger className="w-[200px] h-8 text-xs">
                      <SelectValue placeholder="Select project..." />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.filter(p => p.id !== activeProjectId).map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.projectTitle}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {comparisonProjectId ? (
                  <ProjectResultsView 
                    project={projects.find(p => p.id === comparisonProjectId)!}
                    results={getProjectResults(projects.find(p => p.id === comparisonProjectId)!)}
                    calculationMode={projects.find(p => p.id === comparisonProjectId)!.calculationMode || 'beam'}
                    unitSystem={unitSystem}
                    t={t}
                    u={u}
                    toDisplay={toDisplay}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isChartExpanded={isChartExpanded}
                    setIsChartExpanded={setIsChartExpanded}
                    criticalPoints={getCriticalPoints(getProjectResults(projects.find(p => p.id === comparisonProjectId)!), unitSystem, u, toDisplay)}
                  />
                ) : (
                  <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-slate-50 text-slate-400">
                    <Layout className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-medium">Select a project to compare</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ProjectResultsView 
              project={{ ...getCurrentState(), id: activeProjectId }}
              results={results}
              panelResults={panelResults}
              calculationMode={calculationMode}
              unitSystem={unitSystem}
              t={t}
              u={u}
              toDisplay={toDisplay}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isChartExpanded={isChartExpanded}
              setIsChartExpanded={setIsChartExpanded}
              criticalPoints={criticalPoints}
            />
          )}
          
          {/* Structural Visualization */}
          {calculationMode === 'beam' ? (
            <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-tight text-slate-900">{t.structuralModel}</CardTitle>
                <CardDescription className="text-[10px]">Physical model with real-time integration</CardDescription>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded shadow-sm border border-slate-100">
                  <span className="text-[9px] font-bold text-blue-600 uppercase">Deflection</span>
                  <Switch 
                    className="scale-75"
                    checked={visualAnalysisOptions.deflection} 
                    onCheckedChange={(v) => setVisualAnalysisOptions(prev => ({ ...prev, deflection: v }))} 
                  />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded shadow-sm border border-slate-100">
                  <span className="text-[9px] font-bold text-amber-600 uppercase">Stress</span>
                  <Switch 
                    className="scale-75"
                    checked={visualAnalysisOptions.stress} 
                    onCheckedChange={(v) => setVisualAnalysisOptions(prev => ({ ...prev, stress: v }))} 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-72 relative flex items-center justify-center bg-slate-50 px-4 sm:px-8 overflow-hidden">
              <svg 
                className="w-full h-full overflow-visible" 
                viewBox="0 0 1000 300" 
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Definitions for gradients and patterns */}
                <defs>
                  <linearGradient id="beamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                  
                  <linearGradient id="stressHeatmapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    {(() => {
                      const points = results.points;
                      if (!points || points.length === 0) return <stop offset="0%" stopColor="#94a3b8" />;
                      
                      const samples = 10;
                      const maxPossibleStress = beamProps.yieldStrength / safetyFactor || 1;
                      const stops = [];
                      
                      for (let i = 0; i <= samples; i++) {
                        const idx = Math.min(Math.floor((i / samples) * (points.length - 1)), points.length - 1);
                        const p = points[idx];
                        const utilization = p.stress / maxPossibleStress;
                        
                        // Stress coloring: Blue (low) -> Green (ok) -> Yellow (warning) -> Red (fail)
                        let color = "#3b82f6"; // Default blue
                        if (utilization > 0.9) color = "#ef4444"; // Red
                        else if (utilization > 0.7) color = "#f59e0b"; // Amber
                        else if (utilization > 0.4) color = "#10b981"; // Emerald
                        else color = "#60a5fa"; // Soft blue
                        
                        stops.push(<stop key={i} offset={`${(i / samples) * 100}%`} stopColor={color} />);
                      }
                      return stops;
                    })()}
                  </linearGradient>

                  <pattern id="seismicPattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="2" opacity="0.3" />
                  </pattern>
                </defs>

                {/* Ground Line */}
                <line x1="0" y1="240" x2="1000" y2="240" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />

                {/* Deflection Curve (Plot) */}
                {visualAnalysisOptions.deflection && results.points.length > 0 && (
                  <path
                    d={`M ${results.points.map(p => {
                      const x = 50 + (p.x / length) * 900;
                      // Exaggerate deflection for visibility: max 60px
                      const maxD = results.summary.maxDeflection || 1;
                      const scale = 80 / maxD;
                      const y = 140 + (p.deflection * scale);
                      return `${x} ${y}`;
                    }).join(' L ')}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    opacity="0.6"
                    className="animate-pulse"
                  />
                )}

                {/* Beam Body */}
                <rect 
                  x="50" 
                  y={visualAnalysisOptions.deflection && results.summary.maxDeflection > 0 ? 134 : 134} 
                  width="900" 
                  height="12" 
                  fill={visualAnalysisOptions.stress ? "url(#stressHeatmapGradient)" : "url(#beamGradient)"} 
                  rx="2"
                  className={cn(
                    "stroke-slate-400 stroke-1 transition-all duration-500",
                    visualAnalysisOptions.stress ? "opacity-90" : "opacity-100"
                  )}
                />
                
                {/* Elastic Curve Overlay (Deflection Shape) */}
                {visualAnalysisOptions.deflection && results.points.length > 0 && (
                  <path
                    d={`M ${results.points.map(p => {
                      const x = 50 + (p.x / length) * 900;
                      const maxD = results.summary.maxDeflection || 1;
                      const scale = 80 / maxD;
                      const y = 140 + (p.deflection * scale);
                      return `${x} ${y}`;
                    }).join(' L ')}`}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    className="drop-shadow-sm"
                  />
                )}

                {/* Supports */}
                {/* Left Support */}
                <g transform="translate(50, 140)">
                  {supportCondition === 'simply_supported' || supportCondition === 'fixed_pinned' ? (
                    <g transform="translate(0, 6)">
                      <path d="M 0,0 L -15,25 L 15,25 Z" fill="#475569" />
                      <rect x="-20" y="25" width="40" height="4" fill="#1e293b" rx="1" />
                    </g>
                  ) : (supportCondition === 'cantilever' || supportCondition === 'fixed_fixed') ? (
                    <rect x="-15" y="-40" width="15" height="80" fill="#1e293b" rx="2" />
                  ) : null}
                </g>

                {/* Right Support */}
                <g transform="translate(950, 140)">
                  {supportCondition === 'simply_supported' ? (
                    <g transform="translate(0, 6)">
                      <path d="M 0,0 L -15,25 L 15,25 Z" fill="#475569" />
                      <circle cx="-8" cy="28" r="3" fill="#1e293b" />
                      <circle cx="8" cy="28" r="3" fill="#1e293b" />
                      <rect x="-20" y="31" width="40" height="4" fill="#1e293b" rx="1" />
                    </g>
                  ) : supportCondition === 'fixed_pinned' ? (
                    <g transform="translate(0, 6)">
                      <path d="M 0,0 L -15,25 L 15,25 Z" fill="#475569" />
                      <rect x="-20" y="25" width="40" height="4" fill="#1e293b" rx="1" />
                    </g>
                  ) : supportCondition === 'fixed_fixed' ? (
                    <rect x="0" y="-40" width="15" height="80" fill="#1e293b" rx="2" />
                  ) : null}
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
                          <line x1={x} y1={140 - h - 10} x2={x} y2={145} stroke="transparent" strokeWidth="20" />
                          
                          <line x1={x} y1={140 - h} x2={x} y2={135} stroke={color} strokeWidth="3" strokeLinecap="round" className="transition-all group-hover:stroke-blue-400" />
                          <path d={`M ${x-5},${135} L ${x},140 L ${x+5},${135}`} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" className="transition-all group-hover:stroke-blue-400" />
                          <circle cx={x} cy={140-h} r="4" fill={color} className="transition-all group-hover:r-6 group-hover:fill-blue-400" />
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
                          <rect x="50" y={140 - h} width="900" height={h} fill={fillColor} stroke={color} strokeWidth="1.5" strokeDasharray={isSeismic ? "4 2" : "none"} className="transition-all group-hover:fill-blue-400/20 group-hover:stroke-blue-400" />
                          {/* Arrows for UDL */}
                          {[...Array(11)].map((_, i) => {
                            const ax = 50 + (i * 90);
                            return (
                              <path key={i} d={`M ${ax-3},${135} L ${ax},140 L ${ax+3},${135}`} fill="none" stroke={color} strokeWidth="1.5" className="transition-all group-hover:stroke-blue-400" />
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
                            d={`M ${x1},140 L ${x1},${140-h1} L ${x2},${140-h2} L ${x2},140 Z`} 
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
                    L = {toDisplay(length ?? 0, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)} {u.length}
                  </text>
                </g>
              </svg>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t py-2 px-6 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Low Stress</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> safe</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Warning</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Critical</div>
              </div>
              <div className="text-[10px] font-mono text-slate-500 italic">
                {visualAnalysisOptions.deflection ? "Elastic Curve Visualization active (Scale: ~20x)" : "Show deflection for elastic curve"}
              </div>
            </CardFooter>
          </Card>
          ) : (
            <Card className="shadow-sm border-slate-200 overflow-hidden">
               <CardHeader className="py-3">
                 <CardTitle className="text-sm font-bold uppercase tracking-tight text-slate-900">Panel Geometry Visualization</CardTitle>
                 <CardDescription className="text-[10px]">Plan view of selected panel and stiffeners</CardDescription>
               </CardHeader>
               <CardContent className="h-72 relative flex items-center justify-center bg-slate-50 px-8 overflow-hidden">
                 <div className="relative border-4 border-slate-300 bg-blue-100/20 shadow-xl" style={{ 
                    width: '200px', 
                    height: `${Math.min(240, (length/width)*200)}px`,
                    maxHeight: '240px' 
                 }}>
                   {/* Stiffeners */}
                   {[...Array(stiffenerCount)].map((_, i) => (
                     <div 
                       key={i} 
                       className="absolute bg-rose-500/40 border-x border-rose-600/50" 
                       style={{ 
                         width: '8px', 
                         height: '100%', 
                         left: `${(i + 1) * (100 / (stiffenerCount + 1))}%`,
                         transform: 'translateX(-50%)'
                       }} 
                     />
                   ))}
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-[10px] font-bold text-slate-400 bg-white/80 px-2 py-1 rounded">
                        {toDisplay(width, 'length').toFixed(0)}x{toDisplay(length, 'length').toFixed(0)}
                      </div>
                   </div>
                 </div>
                 <div className="absolute bottom-4 right-4 flex flex-col gap-1 text-[9px] text-slate-500 font-mono">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-200 border border-slate-400" /> Skin</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-rose-400" /> Stiffeners</div>
                 </div>
               </CardContent>
            </Card>
          )}
          {/* Calculation Notes */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="p-3 sm:p-4 border-b bg-slate-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t.notes}</CardTitle>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Show Calculus Steps</span>
                <Switch checked={showCalculusSteps} onCheckedChange={setShowCalculusSteps} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                    {t.assumptions}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                    <li>Euler-Bernoulli beam theory applied.</li>
                    <li>Simply supported boundary conditions.</li>
                    <li>Linear elastic material behavior.</li>
                    <li>Small deflection theory (y &lt;&lt; L).</li>
                    <li>Shear deformation is neglected.</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                    {t.limits}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                    <li>Deflection limit: L/175 (Facade).</li>
                    <li>Stress limit: fy / Safety Factor (γ).</li>
                    <li>Supported Loads: D, L, W, S, E.</li>
                    <li>Seismic: Cs × Total Dead Load.</li>
                    <li>Self-weight: Add manually as UDL.</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                    {t.materialProps}
                  </h4>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Elastic Modulus (E)</span>
                      <span className="text-[10px] font-mono font-bold text-blue-600">{toDisplay(MATERIALS[material].e, 'stress').toLocaleString()} {u.stress}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Yield Strength (fy)</span>
                      <span className="text-[10px] font-mono font-bold text-blue-600">{toDisplay(MATERIALS[material].yield, 'stress').toFixed(0)} {u.stress}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Poisson's Ratio (ν)</span>
                      <span className="text-[10px] font-mono font-bold text-blue-600">{MATERIALS[material].poisson.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                      <span className="text-[10px] text-slate-500">Allowable Stress</span>
                      <span className="text-[10px] font-mono font-bold text-green-600">
                        {toDisplay(MATERIALS[material].yield / safetyFactor, 'stress').toFixed(unitSystem === 'metric' ? 1 : 0)} {u.stress}
                      </span>
                    </div>
                  </div>
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

          {showCalculusSteps && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <CalculusStepsCard 
                options={calcStepOptions}
                setOptions={setCalcStepOptions}
                sectionProps={sectionProps}
                factoredLoads={factoredLoads}
                beamProps={beamProps}
                results={results}
                u={u}
                unitSystem={unitSystem}
                sectionType={sectionType}
                beamType={beamType}
                width={width}
                height={height}
                thickness={thickness}
                thickness2={thickness2}
                material={material}
                safetyFactor={safetyFactor}
                activeCombination={activeCombination}
                t={t}
                criticalPoints={criticalPoints}
                toDisplay={toDisplay}
                seismicRegion={seismicRegion}
                seismicCoeff={seismicCoeff}
                loads={loads}
              />
            </motion.div>
          )}
        </div>
            </motion.div>
          )}

          {view === 'docs' && (
            <motion.div
              key="docs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-5xl mx-auto px-4 py-16"
            >
              <div className="space-y-12">
                <div className="space-y-4 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-2">
                    <BookOpen className="w-3 h-3" />
                    Engineering Documentation
                  </div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900">{t.navDocs}</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">
                    Technical specifications, engineering assumptions, and calculation methodologies used in the FacadeCalc structural engine.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Methodology */}
                    <section className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                          <Activity className="w-5 h-5" />
                        </div>
                        Calculation Methodology
                      </h3>
                      <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                        <p>
                          FacadeCalc utilizes the <strong>Euler-Bernoulli Beam Theory</strong> for calculating the structural response of facade members. This model assumes that "plane sections remain plane" and is highly accurate for members where the span-to-depth ratio is greater than 10.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4 pt-2">
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Bending Analysis</h4>
                            <p className="text-xs">Internal moments (M) and shear forces (V) are calculated using static equilibrium equations based on the support conditions and applied loads.</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Deflection Integration</h4>
                            <p className="text-xs">Deflections are derived by double-integrating the curvature equation: <code className="bg-white px-1 rounded">d²v/dx² = -M(x) / EI</code>.</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Design Criteria */}
                    <section className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900">
                        <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                          <Scale className="w-5 h-5" />
                        </div>
                        Design Criteria & Limits
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Serviceability (SLS)</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                              <span className="text-sm text-slate-600">Standard Limit</span>
                              <span className="text-sm font-bold text-slate-900">L / 175</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                              <span className="text-sm text-slate-600">Absolute Max</span>
                              <span className="text-sm font-bold text-slate-900">20 mm</span>
                            </div>
                            <p className="text-[10px] text-slate-400 italic">Commonly used for glass support members to prevent visual discomfort and seal failure.</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Strength (ULS)</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                              <span className="text-sm text-slate-600">Safety Factor (γ)</span>
                              <span className="text-sm font-bold text-slate-900">1.5 - 2.0</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                              <span className="text-sm text-slate-600">Allowable Stress</span>
                              <span className="text-sm font-bold text-slate-900">fy / γ</span>
                            </div>
                            <p className="text-[10px] text-slate-400 italic">Ensures the material remains within the linear-elastic range with an appropriate margin of safety.</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Calculus Criteria */}
                    <section className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900">
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                          <Calculator className="w-5 h-5" />
                        </div>
                        Calculus & Engineering Constants
                      </h3>
                      <div className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-900">Moment of Inertia (I)</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              The <strong>Second Moment of Area</strong>. It represents the geometric stiffness of the section—how the material is distributed relative to the neutral axis. 
                              In calculus, it is the integral of the square of the distance from the axis:
                              <code className="block mt-1 p-2 bg-slate-50 rounded border border-slate-100 font-mono text-[10px]">I = ∫ y² dA</code>
                              For a rectangular section: <code className="inline-block px-1 bg-slate-100 rounded">I = (b × h³) / 12</code>.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-900">Section Modulus (W)</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              A geometric property that represents the <strong>strength</strong> of the section. It is the ratio of the Moment of Inertia to the distance to the extreme fiber (y_max).
                              It is used to calculate the maximum bending stress: 
                              <code className="block mt-1 p-2 bg-slate-50 rounded border border-slate-100 font-mono text-[10px]">W = I / y_max  →  σ = M / W</code>
                              A higher W-value allows the beam to carry more moment without exceeding the yield strength.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-900">Bending Moment (M)</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              The internal torque that causes bending. Calculated by integrating the shear force:
                              <code className="block mt-1 p-2 bg-slate-50 rounded border border-slate-100 font-mono text-[10px]">M(x) = ∫ V(x) dx</code>
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-900">Shear Force (V)</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              The internal force acting perpendicular to the beam axis. Calculated by integrating the load:
                              <code className="block mt-1 p-2 bg-slate-50 rounded border border-slate-100 font-mono text-[10px]">V(x) = ∫ q(x) dx</code>
                            </p>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Load Integration Logic</h4>
                          <p className="text-xs text-slate-500">
                            The engine performs numerical integration across the beam length. For complex loads like trapezoidal distributions, the engine calculates the equivalent point load and centroid to maintain static equilibrium.
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-8">
                    {/* Supported Standards */}
                    <section className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
                      <h3 className="text-lg font-bold flex items-center gap-3">
                        <Globe className="w-5 h-5 text-blue-400" />
                        Supported Standards
                      </h3>
                      <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                        {Array.from(new Set(CODES_OF_PRACTICE.map(c => c.region))).map(region => (
                          <div key={region} className="space-y-3">
                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                              <span className="h-px flex-1 bg-blue-900/50"></span>
                              {region}
                            </h4>
                            <div className="space-y-2">
                              {CODES_OF_PRACTICE.filter(c => c.region === region).map(item => (
                                <div key={item.country} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                  <div className="text-xs font-bold mb-1">{item.country}</div>
                                  <div className="flex flex-wrap gap-1">
                                    {item.codes.map((code, idx) => (
                                      <span key={idx} className="text-[8px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                                        {code.split(' (')[0]}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Assumptions */}
                    <section className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        Key Assumptions
                      </h3>
                      <ul className="space-y-2 text-[11px] text-slate-500 list-disc pl-4">
                        <li>Linear elastic material behavior.</li>
                        <li>Small deflection theory (Δ &lt;&lt; L).</li>
                        <li>No axial-flexural interaction (P-Delta).</li>
                        <li>Member is laterally restrained against buckling.</li>
                        <li>Connections are idealized as pins or fixed.</li>
                      </ul>
                    </section>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8 sm:py-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div className="sm:col-span-2 space-y-4 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-bold text-xl tracking-tight">{t.title}</h2>
              </div>
              <p className="text-slate-500 text-sm max-w-sm mx-auto sm:mx-0">
                Professional structural analysis for facade engineering. Built for precision, speed, and reliability.
              </p>
            </div>
            <div className="space-y-4 text-center sm:text-left">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-900">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><button onClick={() => setView('calculator')} className="hover:text-blue-600 transition-colors">Calculator</button></li>
                <li><button onClick={() => setView('docs')} className="hover:text-blue-600 transition-colors">Documentation</button></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Release Notes</a></li>
              </ul>
            </div>
            <div className="space-y-4 text-center sm:text-left">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-900">Support</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs text-slate-400 font-medium text-center sm:text-left">
            <div>© {new Date().getFullYear()} {t.title}. {t.footerRights}</div>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
              <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>

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
                          <span>{((hoveredLoad as any).factoredValue2 ?? 0).toFixed(2)}</span>
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
    </TooltipProvider>
  );
}

export default function Root() {
  return <App />;
}

function SummaryCard({ label, value, subValue, icon, status, onClick, active, progress, tooltip }: { 
  label: string; 
  value: string; 
  subValue?: string; 
  icon: React.ReactNode;
  status?: 'pass' | 'fail';
  onClick?: () => void;
  active?: boolean;
  progress?: number;
  tooltip?: string;
}) {
  const CardContentWrapper = (
    <Card 
      className={cn(
        "shadow-sm border-slate-200 overflow-hidden cursor-pointer transition-all duration-200 group relative",
        active ? "ring-2 ring-blue-500 border-transparent" : "hover:border-blue-300 hover:shadow-md"
      )}
      onClick={onClick}
    >
      <CardContent className="p-2 sm:p-3">
        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
          <span className={cn(
            "text-[7px] sm:text-[9px] font-bold uppercase tracking-wider truncate mr-1 transition-colors",
            active ? "text-blue-600" : "text-slate-500 group-hover:text-blue-500"
          )}>{label}</span>
          <div className={cn(
            "shrink-0 transition-transform duration-300 scale-75 sm:scale-100",
            active ? "scale-90 sm:scale-110" : "group-hover:scale-90 sm:group-hover:scale-110"
          )}>{icon}</div>
        </div>
        <div className="text-[10px] sm:text-base font-bold tracking-tight truncate">{value}</div>
        {subValue && (
          <div className={cn(
            "text-[7px] sm:text-[9px] font-medium mt-0.5 truncate",
            status === 'fail' ? "text-red-600" : status === 'pass' ? "text-green-600" : "text-slate-400"
          )}>
            {subValue}
          </div>
        )}
        {progress !== undefined && !isNaN(progress) && (
          <div className="mt-1.5 sm:mt-2 h-0.5 sm:h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (progress || 0) * 100)}%` }}
              className={cn(
                "h-full transition-colors duration-500",
                progress > 1 ? "bg-red-500" : progress > 0.8 ? "bg-amber-500" : "bg-blue-500"
              )}
            />
          </div>
        )}
      </CardContent>
      {status && (
        <div className={cn(
          "absolute top-0 right-0 w-1 h-full",
          status === 'pass' ? "bg-green-500" : "bg-red-500"
        )} />
      )}
    </Card>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger>
          {CardContentWrapper}
        </TooltipTrigger>
        <TooltipContent className="max-w-[200px] text-[10px] p-2">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }

  return CardContentWrapper;
}

function ChartContainer({ 
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

function NumericInputWithControls({ 
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

  React.useEffect(() => {
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
    <div className={cn("flex items-center gap-1", className)}>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-7 w-7 shrink-0" 
        onClick={decrement}
        disabled={disabled || value <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input 
        id={id}
        type="number" 
        value={localValue} 
        onChange={handleInputChange}
        disabled={disabled}
        className="h-7 flex-1 text-center bg-white text-xs px-1"
        step="any"
      />
      <Button 
        variant="outline" 
        size="icon" 
        className="h-7 w-7 shrink-0" 
        onClick={increment}
        disabled={disabled || value >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
