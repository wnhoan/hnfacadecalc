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
  HelpCircle,
  Scale,
  FileCode,
  ArrowDown,
  Undo2,
  Redo2,
  Image as ImageIcon,
  Paperclip
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
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { BeamVisualizer3D } from './components/BeamVisualizer3D';
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
  aluminum_6063_t6: { name: 'Aluminum 6063-T6 (Extrusion)', e: 70000, yield: 160, poisson: 0.33, category: 'Aluminum' },
  aluminum_6063_t66: { name: 'Aluminum 6063-T66 (High Strength Extrusion)', e: 70000, yield: 200, poisson: 0.33, category: 'Aluminum' },
  aluminum_6063_t5: { name: 'Aluminum 6063-T5', e: 70000, yield: 110, poisson: 0.33, category: 'Aluminum' },
  aluminum_6061_t6: { name: 'Aluminum 6061-T6 (Structural)', e: 70000, yield: 240, poisson: 0.33, category: 'Aluminum' },
  aluminum_6082_t6: { name: 'Aluminum 6082-T6 (Structural)', e: 70000, yield: 250, poisson: 0.33, category: 'Aluminum' },
  aluminum_3003_h14: { name: 'Aluminum 3003-H14 (Cladding)', e: 70000, yield: 145, poisson: 0.33, category: 'Aluminum' },
  aluminum_5005_h34: { name: 'Aluminum 5005-H34 (Anodized)', e: 70000, yield: 135, poisson: 0.33, category: 'Aluminum' },
  aluminum_5754_h22: { name: 'Aluminum 5754-H22 (High Strength)', e: 70000, yield: 190, poisson: 0.33, category: 'Aluminum' },
  steel_s235: { name: 'Steel S235', e: 210000, yield: 235, poisson: 0.30, category: 'Steel' },
  steel_s275: { name: 'Steel S275', e: 210000, yield: 275, poisson: 0.30, category: 'Steel' },
  steel_s355: { name: 'Steel S355', e: 210000, yield: 355, poisson: 0.30, category: 'Steel' },
  steel_s420: { name: 'Steel S420', e: 210000, yield: 420, poisson: 0.30, category: 'Steel' },
  steel_s460: { name: 'Steel S460', e: 210000, yield: 460, poisson: 0.30, category: 'Steel' },
  stainless_304: { name: 'Stainless Steel 304', e: 193000, yield: 205, poisson: 0.30, category: 'Stainless Steel' },
  stainless_316: { name: 'Stainless Steel 316', e: 200000, yield: 215, poisson: 0.30, category: 'Stainless Steel' },
  stainless_2205: { name: 'Stainless Steel 2205 (Duplex)', e: 200000, yield: 450, poisson: 0.30, category: 'Stainless Steel' },
  concrete_c25: { name: 'Concrete C25/30', e: 31000, yield: 25, poisson: 0.20, category: 'Concrete' },
  concrete_c30: { name: 'Concrete C30/37', e: 33000, yield: 30, poisson: 0.20, category: 'Concrete' },
  concrete_c40: { name: 'Concrete C40/50', e: 35000, yield: 40, poisson: 0.20, category: 'Concrete' },
  timber_softwood: { name: 'Timber (Softwood C24)', e: 11000, yield: 24, poisson: 0.30, category: 'Timber' },
  timber_hardwood: { name: 'Timber (Hardwood D40)', e: 14000, yield: 40, poisson: 0.30, category: 'Timber' },
  timber_glulam: { name: 'Timber (Glulam GL24h)', e: 11500, yield: 24, poisson: 0.30, category: 'Timber' },
  timber_clt: { name: 'Timber (CLT)', e: 11000, yield: 24, poisson: 0.30, category: 'Timber' },
  glass_annealed: { name: 'Glass (Annealed Soda-Lime)', e: 70000, yield: 45, poisson: 0.22, category: 'Glass' },
  glass_tempered: { name: 'Glass (Fully Tempered Soda-Lime)', e: 70000, yield: 120, poisson: 0.22, category: 'Glass' },
  glass_hs: { name: 'Glass (Heat Strengthened Soda-Lime)', e: 70000, yield: 70, poisson: 0.22, category: 'Glass' },
  glass_low_iron_annealed: { name: 'Glass (Low Iron Annealed)', e: 70000, yield: 45, poisson: 0.22, category: 'Glass' },
  glass_low_iron_tempered: { name: 'Glass (Low Iron Tempered)', e: 70000, yield: 120, poisson: 0.22, category: 'Glass' },
  glass_laminated_pvb: { name: 'Glass (Laminated PVB - Effective)', e: 70000, yield: 45, poisson: 0.22, category: 'Glass' },
  glass_laminated_sgp: { name: 'Glass (Laminated SentryGlas - Effective)', e: 70000, yield: 120, poisson: 0.22, category: 'Glass' },
  glass_borosilicate_annealed: { name: 'Glass (Borosilicate Annealed)', e: 64000, yield: 50, poisson: 0.20, category: 'Glass' },
  glass_borosilicate_tempered: { name: 'Glass (Borosilicate Tempered)', e: 64000, yield: 150, poisson: 0.20, category: 'Glass' },
  glass_ceramic: { name: 'Glass (Ceramic / Fire Rated)', e: 92000, yield: 180, poisson: 0.24, category: 'Glass' },
  glass_wired: { name: 'Glass (Wired / Safety)', e: 70000, yield: 30, poisson: 0.22, category: 'Glass' },
  glass_patterned: { name: 'Glass (Patterned / Textured)', e: 70000, yield: 35, poisson: 0.22, category: 'Glass' },
  stone_granite: { name: 'Stone (Granite)', e: 60000, yield: 10, poisson: 0.25, category: 'Stone' },
  stone_marble: { name: 'Stone (Marble)', e: 50000, yield: 8, poisson: 0.25, category: 'Stone' },
  stone_limestone: { name: 'Stone (Limestone)', e: 40000, yield: 5, poisson: 0.25, category: 'Stone' },
  stone_sandstone: { name: 'Stone (Sandstone)', e: 20000, yield: 3, poisson: 0.25, category: 'Stone' },
  plastic_polycarb: { name: 'Polycarbonate', e: 2300, yield: 60, poisson: 0.37, category: 'Plastics' },
  plastic_acrylic: { name: 'Acrylic (PMMA)', e: 3200, yield: 70, poisson: 0.35, category: 'Plastics' },
  plastic_pvc: { name: 'PVC (Rigid)', e: 3000, yield: 50, poisson: 0.38, category: 'Plastics' },
  composite_acm: { name: 'ACM (Aluminum Composite)', e: 70000, yield: 100, poisson: 0.33, category: 'Composites' },
  composite_hpl: { name: 'HPL (High Pressure Laminate)', e: 9000, yield: 80, poisson: 0.30, category: 'Composites' },
  metal_copper: { name: 'Copper', e: 117000, yield: 70, poisson: 0.34, category: 'Other Metals' },
  metal_zinc: { name: 'Zinc', e: 90000, yield: 100, poisson: 0.25, category: 'Other Metals' },
  metal_brass: { name: 'Brass', e: 105000, yield: 200, poisson: 0.34, category: 'Other Metals' },
  grc: { name: 'GRC Panel', e: 15000, yield: 8, poisson: 0.24, category: 'Other' },
  terracotta: { name: 'Terracotta', e: 30000, yield: 15, poisson: 0.20, category: 'Other' },
  custom: { name: 'Custom', e: 200000, yield: 200, poisson: 0.30, category: 'Other' },
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
  }
};

const CODES_OF_PRACTICE = [
  { region: 'Europe', country: 'Eurocodes (EU)', codes: ['EN 1990 (Basis)', 'EN 1991 (Actions)', 'EN 1993 (Steel)', 'EN 1999 (Aluminum)', 'EN 1998 (Seismic)'] },
  { region: 'Europe', country: 'United Kingdom', codes: ['BS EN 1991 (Actions)', 'BS EN 1993 (Steel)', 'BS EN 1999 (Aluminum)', 'BS EN 1998 (Seismic)'] },
  { region: 'Asia', country: 'China (National)', codes: ['GB 50009 (Loads)', 'JGJ 102 (Curtain Wall)', 'GB 50011 (Seismic)', 'GB 50017 (Steel)'] },
  { region: 'Asia', country: 'Hong Kong', codes: ['CoP for Glass 2018', 'CoP on Wind 2019', 'CoP for Seismic Design 2024'] },
  { region: 'Asia', country: 'Shanghai', codes: ['DGJ08-56 (Curtain Wall)', 'DGJ08-11 (Loads)', 'DGJ08-9 (Steel)'] },
  { region: 'Asia', country: 'Shenzhen', codes: ['SZJG 48 (Glass)', 'SZJG 54 (Metal/Stone)', 'SJG 15 (Wind)'] },
  { region: 'Asia', country: 'Guangzhou', codes: ['DBJ/T 15-30 (Curtain Wall)', 'DBJ 15-101 (Wind)', 'GZJG (Guidelines)'] },
  { region: 'Asia', country: 'Thailand', codes: ['EIT 1011-46 (Steel)', 'DPT 1311-50 (Wind)', 'DPT 1301/1302 (Seismic)'] },
  { region: 'Asia', country: 'Malaysia', codes: ['MS 1553 (Wind)', 'MS EN 1991 (EC1)', 'MS EN 1998 (Seismic)'] },
  { region: 'Asia', country: 'Singapore', codes: ['SS EN 1991 (Actions)', 'SS EN 1993 (Steel)', 'SS EN 1999 (Aluminum)'] },
  { region: 'North America', country: 'United States', codes: ['ASCE 7-22 (Loads)', 'AISC 360-22 (Steel)', 'ADM 2020 (Aluminum)', 'ASTM E1300 (Glass)'] },
  { region: 'North America', country: 'Canada', codes: ['NBCC 2020 (Loads)', 'CSA S16 (Steel)', 'CSA S157 (Aluminum)', 'CAN/CGSB 12.20 (Glass)'] },
  { region: 'Oceania', country: 'Australia', codes: ['AS/NZS 1170 (Loads)', 'AS 4100 (Steel)', 'AS/NZS 1664 (Aluminum)', 'AS 1288 (Glass)'] },
  { region: 'Oceania', country: 'New Zealand', codes: ['AS/NZS 1170 (Loads)', 'NZS 3404 (Steel)', 'AS/NZS 1664 (Aluminum)', 'NZS 4223 (Glass)'] },
  { region: 'Middle East', country: 'UAE / Dubai', codes: ['DBC (Loads)', 'ASCE 7 (Wind)', 'AISC 360 (Steel)', 'ADM (Aluminum)'] },
  { region: 'Middle East', country: 'Saudi Arabia', codes: ['SBC 301 (Loads)', 'SBC 304 (Steel)', 'SBC 306 (Aluminum)'] },
  { region: 'Africa', country: 'South Africa', codes: ['SANS 10160 (Loads)', 'SANS 10162 (Steel)', 'SANS 10137 (Glass)'] },
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
  factors: Record<keyof typeof LOAD_CATEGORIES, number>;
}

const DEFAULT_COMBINATIONS: Combination[] = [
  { id: 'c1', name: 'Serviceability (D+L)', factors: { dead: 1.0, live: 1.0, wind: 0, snow: 0, seismic: 0 } },
  { id: 'c2', name: 'Ultimate (1.2D + 1.6L)', factors: { dead: 1.2, live: 1.6, wind: 0, snow: 0, seismic: 0 } },
  { id: 'c3', name: 'Wind Dominant (D + W)', factors: { dead: 1.0, live: 0, wind: 1.0, snow: 0, seismic: 0 } },
  { id: 'c4', name: 'Seismic Dominant (D + E)', factors: { dead: 1.0, live: 0.5, wind: 0, snow: 0, seismic: 1.0 } },
];

// Helper for robust number parsing with clamping
const safeParseNumber = (val: string | number, fallback: number = 0, min: number = -Infinity, max: number = Infinity): number => {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return fallback;
  return Math.min(Math.max(num, min), max);
};

interface HistoryState {
  projectTitle: string;
  projectLocation: string;
  projectDescription: string;
  projectDate: string;
  projectTime: string;
  projectAttachment?: string;
  length: number;
  material: keyof typeof MATERIALS;
  sectionType: 'solid' | 'hollow';
  width: number;
  height: number;
  thickness: number;
  supportCondition: 'simply_supported' | 'cantilever' | 'fixed_fixed' | 'fixed_pinned';
  safetyFactor: number;
  selectedCodeId: string;
  loads: Load[];
  combinations: Combination[];
  activeCombinationId: string;
  seismicRegion: keyof typeof SEISMIC_REGIONS;
  seismicCoeff: number;
  unitSystem: 'metric' | 'imperial';
}

interface Project extends HistoryState {
  id: string;
}

const createNewProject = (id: string, title: string): Project => ({
  id,
  projectTitle: title,
  projectLocation: '',
  projectDescription: '',
  projectDate: new Date().toISOString().split('T')[0],
  projectTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
  projectAttachment: '',
  length: 3500,
  material: 'aluminum_6061_t6',
  sectionType: 'hollow',
  width: 65,
  height: 150,
  thickness: 3.5,
  supportCondition: 'simply_supported',
  safetyFactor: 1.5,
  selectedCodeId: 'China (National)',
  loads: [{ id: '1', type: 'udl', category: 'dead', value: 0.5 }],
  combinations: DEFAULT_COMBINATIONS,
  activeCombinationId: 'c1',
  seismicRegion: 'china',
  seismicCoeff: SEISMIC_REGIONS.china.coeff,
  unitSystem: 'metric'
});

const getProjectResults = (project: Project) => {
  const sectionProps = project.sectionType === 'solid' 
    ? calculateRectangularProperties(project.width, project.height)
    : calculateHollowRectangularProperties(project.width, project.height, project.thickness);

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

const ProjectResultsView = ({ 
  project, 
  results, 
  unitSystem, 
  t, 
  u, 
  toDisplay, 
  activeTab, 
  setActiveTab,
  isChartExpanded,
  setIsChartExpanded
}: { 
  project: Project; 
  results: any; 
  unitSystem: string; 
  t: any; 
  u: any; 
  toDisplay: any;
  activeTab: string;
  setActiveTab: (v: string) => void;
  isChartExpanded: boolean;
  setIsChartExpanded: (v: boolean) => void;
}) => {
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
          value={`${toDisplay(results.summary.maxDeflection, 'length').toFixed(unitSystem === 'metric' ? 2 : 4)} ${u.length}`} 
          subValue={results.summary.deflectionRatio}
          icon={<Maximize2 className="w-4 h-4 text-blue-500" />}
          status={results.summary.utilizationDeflection > 1 ? 'fail' : 'pass'}
          progress={results.summary.utilizationDeflection}
          tooltip="Maximum vertical displacement of the beam under applied loads."
        />
        <SummaryCard 
          label={t.maxStress} 
          value={`${toDisplay(results.summary.maxStress, 'stress').toFixed(unitSystem === 'metric' ? 2 : 4)} ${u.stress}`} 
          icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
          status={results.summary.utilizationStress > 1 ? 'fail' : 'pass'}
          progress={results.summary.utilizationStress}
          tooltip="Maximum internal stress in the material. Must be less than the allowable yield strength."
        />
        <SummaryCard 
          label={t.maxMoment} 
          value={unitSystem === 'metric' 
            ? `${(results.summary.maxMoment / 1000000).toFixed(2)} kNm` 
            : `${(toDisplay(results.summary.maxMoment, 'moment') * CONVERSION.lbin_to_lbft).toFixed(1)} lb-ft`} 
          icon={<Layout className="w-4 h-4 text-purple-500" />}
          tooltip="Maximum bending moment occurring along the beam span."
        />
        <SummaryCard 
          label={t.maxShear} 
          value={unitSystem === 'metric'
            ? `${(results.summary.maxShear / 1000).toFixed(2)} kN`
            : `${(toDisplay(results.summary.maxShear, 'force') / 1000).toFixed(2)} kip`} 
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
                sectionType={project.sectionType} 
                supportCondition={project.supportCondition}
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
    dimensions: { width: 50, height: 150, thickness: 3 }
  },
  {
    id: 'transom-50-80',
    name: 'Transom T80 (50x80)',
    extruder: 'Standard Extrusions Ltd',
    url: 'https://picsum.photos/seed/transom1/400/300',
    dimensions: { width: 50, height: 80, thickness: 2.5 }
  },
  {
    id: 'heavy-mullion-60-200',
    name: 'Heavy Mullion H200 (60x200)',
    extruder: 'Industrial Profiles Corp',
    url: 'https://picsum.photos/seed/heavy1/400/300',
    dimensions: { width: 60, height: 200, thickness: 4 }
  },
  {
    id: 'slim-mullion-40-120',
    name: 'Slim Mullion S120 (40x120)',
    extruder: 'Architectural Systems',
    url: 'https://picsum.photos/seed/slim1/400/300',
    dimensions: { width: 40, height: 120, thickness: 2.5 }
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
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
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
  width,
  height,
  thickness,
  material,
  safetyFactor,
  t
}: {
  options: { section: boolean; loads: boolean; analysis: boolean; stress: boolean };
  setOptions: (v: any) => void;
  sectionProps: any;
  factoredLoads: any[];
  beamProps: any;
  results: any;
  u: any;
  unitSystem: string;
  sectionType: string;
  width: number;
  height: number;
  thickness: number;
  material: string;
  safetyFactor: number;
  t: any;
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
                  ) : (
                    <>
                      <div className="bg-white p-2 rounded border border-slate-200">A = (w × h) - (w_i × h_i)</div>
                      <div className="bg-white p-2 rounded border border-slate-200">I = ((w × h³) - (w_i × h_i³)) / 12</div>
                      <div className="bg-white p-2 rounded border border-slate-200">W = I / (h / 2)</div>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-slate-500 italic">Calculations:</p>
                <div className="font-mono text-[11px] space-y-1.5">
                  <div className="bg-white p-2 rounded border border-slate-200">A = {sectionProps.area.toFixed(2)} mm²</div>
                  <div className="bg-white p-2 rounded border border-slate-200">I = {sectionProps.momentOfInertia.toExponential(4)} mm⁴</div>
                  <div className="bg-white p-2 rounded border border-slate-200">W = {sectionProps.sectionModulus.toExponential(4)} mm³</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {options.loads && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Scale className="w-3 h-3" />
              Step 2: Load Factoring
            </h4>
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
                      <TableCell className="py-2 text-[10px] font-mono text-right">{load.value.toFixed(2)}</TableCell>
                      <TableCell className="py-2 text-[10px] font-mono text-center text-blue-600 font-bold">×</TableCell>
                      <TableCell className="py-2 text-[10px] font-mono text-right font-bold text-slate-900">{load.value.toFixed(2)}</TableCell>
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
                    <span className="font-bold text-blue-600">{(results.summary.maxMoment / 1000000).toFixed(3)} kNm</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200 flex justify-between">
                    <span>Max Shear (V_max):</span>
                    <span className="font-bold text-blue-600">{(results.summary.maxShear / 1000).toFixed(3)} kN</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200 flex justify-between">
                    <span>Max Deflection (Δ_max):</span>
                    <span className="font-bold text-blue-600">{results.summary.maxDeflection.toFixed(3)} mm</span>
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
                    <span>Limit (L/175):</span>
                    <span className="font-bold text-slate-900">{(beamProps.length / 175).toFixed(2)} mm</span>
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
                    <p>σ = {(results.summary.maxMoment).toFixed(0)} / {sectionProps.sectionModulus.toFixed(0)}</p>
                    <p className="text-blue-600 font-bold">σ = {results.summary.maxStress.toFixed(2)} MPa</p>
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
                results.summary.maxStress <= (beamProps.yieldStrength / safetyFactor) 
                  ? "bg-green-50 border-green-200 text-green-700" 
                  : "bg-red-50 border-red-200 text-red-700"
              )}>
                <div className="flex items-center gap-2">
                  {results.summary.maxStress <= (beamProps.yieldStrength / safetyFactor) ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span className="text-xs font-bold uppercase tracking-tight">
                    {results.summary.maxStress <= (beamProps.yieldStrength / safetyFactor) ? "Stress Check Passed" : "Stress Check Failed"}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold">
                  {(results.summary.maxStress / (beamProps.yieldStrength / safetyFactor) * 100).toFixed(1)}% Utilization
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

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
  const [sectionType, setSectionType] = useState<'solid' | 'hollow'>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.sectionType ?? 'hollow';
      } catch (e) { return 'hollow'; }
    }
    return 'hollow';
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
  const [supportCondition, setSupportCondition] = useState<'simply_supported' | 'cantilever' | 'fixed_fixed' | 'fixed_pinned'>(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.supportCondition ?? 'simply_supported';
      } catch (e) { return 'simply_supported'; }
    }
    return 'simply_supported';
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
        return data.selectedCodeId ?? 'China (National)';
      } catch (e) { return 'China (National)'; }
    }
    return 'China (National)';
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
  const [showAllCodes, setShowAllCodes] = useState(false);
  const [showCalculusSteps, setShowCalculusSteps] = useState(false);
  const [calcStepOptions, setCalcStepOptions] = useState({
    section: true,
    loads: true,
    analysis: true,
    stress: true
  });
  const [activeTab, setActiveTab] = useState('deflection');
  const [isChartExpanded, setIsChartExpanded] = useState(false);
  const [lang, setLang] = useState<keyof typeof TRANSLATIONS>('en');
  const [view, setView] = useState<'home' | 'calculator' | 'docs'>('home');
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
  const [projectTitle, setProjectTitle] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.projectTitle ?? 'Untitled Project';
      } catch (e) { return 'Untitled Project'; }
    }
    return 'Untitled Project';
  });
  const [projectLocation, setProjectLocation] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.projectLocation ?? '';
      } catch (e) { return ''; }
    }
    return '';
  });
  const [projectDescription, setProjectDescription] = useState(() => {
    const saved = localStorage.getItem('facadecalc_project');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.projectDescription ?? '';
      } catch (e) { return ''; }
    }
    return '';
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
  
  // Auto-switch design code based on location
  React.useEffect(() => {
    if (!projectLocation) return;
    
    const loc = projectLocation.toLowerCase();
    
    // Hong Kong
    if (loc.includes('hong kong') || loc.includes('hk') || loc.includes('kowloon') || loc.includes('lantau') || loc.includes('香港') || loc.includes('九龙') || loc.includes('大屿山')) {
      setSelectedCodeId('Hong Kong');
    } 
    // Shanghai
    else if (loc.includes('shanghai') || loc.includes('pudong') || loc.includes('puxi') || loc.includes('上海') || loc.includes('浦东') || loc.includes('浦西')) {
      setSelectedCodeId('Shanghai');
    } 
    // Shenzhen
    else if (loc.includes('shenzhen') || loc.includes('futian') || loc.includes('nanshan') || loc.includes('baoan') || loc.includes('深圳') || loc.includes('福田') || loc.includes('南山') || loc.includes('宝安')) {
      setSelectedCodeId('Shenzhen');
    } 
    // Guangzhou
    else if (loc.includes('guangzhou') || loc.includes('tianhe') || loc.includes('yuexiu') || loc.includes('haizhu') || loc.includes('广州') || loc.includes('天河') || loc.includes('越秀') || loc.includes('海珠')) {
      setSelectedCodeId('Guangzhou');
    } 
    // Thailand
    else if (loc.includes('thailand') || loc.includes('bangkok') || loc.includes('phuket') || loc.includes('chiang mai') || loc.includes('pattaya') || loc.includes('泰国') || loc.includes('曼谷') || loc.includes('普吉') || loc.includes('清迈') || loc.includes('芭提雅')) {
      setSelectedCodeId('Thailand');
    } 
    // Malaysia
    else if (loc.includes('malaysia') || loc.includes('kuala lumpur') || loc.includes('kl') || loc.includes('penang') || loc.includes('johor') || loc.includes('马来西亚') || loc.includes('吉隆坡') || loc.includes('槟城') || loc.includes('柔佛')) {
      setSelectedCodeId('Malaysia');
    } 
    // England / UK
    else if (loc.includes('england') || loc.includes('uk') || loc.includes('london') || loc.includes('manchester') || loc.includes('birmingham') || loc.includes('united kingdom') || loc.includes('英国') || loc.includes('伦敦') || loc.includes('曼彻斯特') || loc.includes('伯明翰')) {
      setSelectedCodeId('United Kingdom');
    } 
    // US / Canada
    else if (loc.includes('usa') || loc.includes('us ') || loc.includes('america') || loc.includes('united states') || loc.includes('new york') || loc.includes('美国')) {
      setSelectedCodeId('United States');
    }
    else if (loc.includes('canada') || loc.includes('toronto') || loc.includes('vancouver') || loc.includes('加拿大')) {
      setSelectedCodeId('Canada');
    }
    // Oceania
    else if (loc.includes('australia') || loc.includes('sydney') || loc.includes('melbourne') || loc.includes('au ') || loc.includes('澳大利亚')) {
      setSelectedCodeId('Australia');
    }
    else if (loc.includes('new zealand') || loc.includes('auckland') || loc.includes('nz') || loc.includes('新西兰')) {
      setSelectedCodeId('New Zealand');
    }
    // Middle East
    else if (loc.includes('uae') || loc.includes('dubai') || loc.includes('abu dhabi') || loc.includes('阿联酋')) {
      setSelectedCodeId('UAE / Dubai');
    }
    else if (loc.includes('saudi') || loc.includes('riyadh') || loc.includes('ksa') || loc.includes('沙特')) {
      setSelectedCodeId('Saudi Arabia');
    }
    // Africa
    else if (loc.includes('south africa') || loc.includes('cape town') || loc.includes('joburg') || loc.includes('南非')) {
      setSelectedCodeId('South Africa');
    }
    // Europe / Eurocodes
    else if (
      loc.includes('europe') || loc.includes('eu') || loc.includes('germany') || loc.includes('france') || 
      loc.includes('italy') || loc.includes('spain') || loc.includes('netherlands') || loc.includes('belgium') ||
      loc.includes('berlin') || loc.includes('paris') || loc.includes('rome') || loc.includes('madrid') || loc.includes('amsterdam') ||
      loc.includes('欧洲') || loc.includes('德国') || loc.includes('法国') || loc.includes('意大利') || loc.includes('西班牙') || loc.includes('荷兰') || loc.includes('比利时')
    ) {
      setSelectedCodeId('Eurocodes (EU)');
    } 
    // China (National)
    else if (loc.includes('china') || loc.includes('beijing') || loc.includes('chengdu') || loc.includes('hangzhou') || loc.includes('nanjing') || loc.includes('wuhan') || loc.includes('prc') || loc.includes('中国') || loc.includes('北京') || loc.includes('成都') || loc.includes('杭州') || loc.includes('南京') || loc.includes('武汉')) {
      setSelectedCodeId('China (National)');
    }
  }, [projectLocation]);

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
    length,
    material,
    sectionType,
    width,
    height,
    thickness,
    supportCondition,
    safetyFactor,
    selectedCodeId,
    loads,
    combinations,
    activeCombinationId,
    seismicRegion,
    seismicCoeff,
    unitSystem
  });

  const applyState = (state: HistoryState) => {
    isHistoryAction.current = true;
    setProjectTitle(state.projectTitle);
    setProjectLocation(state.projectLocation);
    setProjectDescription(state.projectDescription);
    setProjectDate(state.projectDate);
    setProjectTime(state.projectTime ?? new Date().toTimeString().split(' ')[0].slice(0, 5));
    setProjectAttachment(state.projectAttachment ?? '');
    setLength(state.length);
    setMaterial(state.material);
    setSectionType(state.sectionType);
    setWidth(state.width);
    setHeight(state.height);
    setThickness(state.thickness);
    setSupportCondition(state.supportCondition);
    setSafetyFactor(state.safetyFactor);
    setSelectedCodeId(state.selectedCodeId);
    setLoads(state.loads);
    setCombinations(state.combinations);
    setActiveCombinationId(state.activeCombinationId);
    setSeismicRegion(state.seismicRegion);
    setSeismicCoeff(state.seismicCoeff);
    setUnitSystem(state.unitSystem ?? 'metric');
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
    seismicRegion, seismicCoeff
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
  }, [past, future, projectTitle, projectLocation, projectDescription, projectDate, length, material, sectionType, width, height, thickness, supportCondition, safetyFactor, selectedCodeId, loads, combinations, activeCombinationId, seismicRegion, seismicCoeff]);

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
    seismicRegion, seismicCoeff
  ]);

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
      value2: type === 'trapezoidal' ? 1.5 : undefined,
      start: type === 'trapezoidal' ? length * 0.25 : undefined,
      end: type === 'trapezoidal' ? length * 0.75 : undefined,
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
    const headers = [
      `Distance (${u.length})`, 
      `Deflection (${u.length})`, 
      `Moment (${u.moment})`, 
      `Shear (${u.force})`, 
      `Stress (${u.stress})`
    ];
    const rows = results.points.map(p => [
      toDisplay(p.x, 'length').toFixed(2),
      toDisplay(p.deflection, 'length').toFixed(4),
      toDisplay(p.moment, 'moment').toFixed(2),
      toDisplay(p.shear, 'force').toFixed(2),
      toDisplay(p.stress, 'stress').toFixed(4)
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
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
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
                onClick={() => setView('home')}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  view === 'home' ? "text-blue-600" : "text-slate-500"
                )}
              >
                {t.navIntro}
              </button>
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
                  <DropdownMenuTrigger render={
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden lg:inline">{t.print}</span>
                    </Button>
                  } />
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
                        sectionType="hollow"
                        supportCondition="simply_supported"
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
                <div className="lg:col-span-4 h-full overflow-y-auto p-3 sm:p-4 border-r border-slate-200 bg-slate-50/30 no-scrollbar print:hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
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
                      <Label htmlFor="proj-loc" className="text-[10px] uppercase font-bold text-slate-400">Location</Label>
                      <Input 
                        id="proj-loc"
                        value={projectLocation}
                        onChange={(e) => setProjectLocation(e.target.value)}
                        placeholder="City, Country..."
                        className="bg-white h-8 text-sm"
                      />
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
                    setSectionType('hollow');
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
                                    <TableHead className="w-[250px]">Name</TableHead>
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
                                      <TableCell>
                                        <Input 
                                          value={comb.name} 
                                          onChange={(e) => updateCombinationName(comb.id, e.target.value)}
                                          className="h-8 font-medium"
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
                      <div key={comb.id} className={cn(
                        "p-2 border rounded-lg transition-all group relative",
                        activeCombinationId === comb.id 
                          ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/30 shadow-sm" 
                          : "bg-white hover:border-slate-300 hover:bg-slate-50/30"
                      )}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex-1 min-w-0 mr-1.5">
                            <Input 
                              value={comb.name ?? ''} 
                              onChange={(e) => updateCombinationName(comb.id, e.target.value)}
                              className="h-5 text-[10px] font-bold border-none bg-transparent p-0 focus-visible:ring-0 truncate text-slate-700 placeholder:text-slate-300"
                              placeholder="Combination Name"
                            />
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 text-slate-400 hover:text-blue-600 hover:bg-blue-100/50"
                              onClick={() => duplicateCombination(comb.id)}
                              title="Duplicate"
                            >
                              <Copy className="h-2.5 w-2.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 text-slate-400 hover:text-rose-500 hover:bg-rose-100/50"
                              onClick={() => removeCombination(comb.id)}
                              disabled={combinations.length <= 1}
                              title="Delete"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </Button>
                            <div className="ml-1">
                              <Button 
                                variant={activeCombinationId === comb.id ? "default" : "outline"} 
                                size="sm" 
                                className={cn(
                                  "h-5 text-[8px] px-1.5 font-black uppercase tracking-tighter",
                                  activeCombinationId === comb.id ? "bg-blue-600 hover:bg-blue-700" : "text-slate-400 border-slate-200"
                                )}
                                onClick={() => setActiveCombinationId(comb.id)}
                              >
                                {activeCombinationId === comb.id ? "Active" : "Select"}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-5 gap-0.5 bg-slate-100/80 rounded-sm p-0.5 sm:p-1">
                          {Object.entries(LOAD_CATEGORIES).map(([key, cat]) => (
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
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t.properties}</span>
                    </div>
                    <CardTitle className="text-sm sm:text-base">{t.properties}</CardTitle>
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
                      <Label htmlFor="length" className="text-[10px] uppercase font-bold text-slate-400">{t.span} ({u.length})</Label>
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
                    
                    <div className="grid gap-1.5">
                      <Label className="text-[10px] uppercase font-bold text-slate-400">{t.material}</Label>
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

                      <div className="grid gap-1.5">
                        <Label className="text-[10px] uppercase font-bold text-slate-400">{t.supportCondition}</Label>
                        <Select value={supportCondition} onValueChange={(v: any) => setSupportCondition(v)}>
                          <SelectTrigger className="bg-white h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simply_supported" className="text-xs">{t.simplySupported}</SelectItem>
                            <SelectItem value="cantilever" className="text-xs">{t.cantilever}</SelectItem>
                            <SelectItem value="fixed_fixed" className="text-xs">{t.fixedFixed}</SelectItem>
                            <SelectItem value="fixed_pinned" className="text-xs">{t.fixedPinned}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator className="my-1" />

                    <div className="grid gap-1.5">
                      <Label className="text-[10px] uppercase font-bold text-slate-400">{t.sectionType}</Label>
                      <Tabs value={sectionType} onValueChange={(v: any) => setSectionType(v)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-8">
                          <TabsTrigger value="solid" className="text-[10px]">{t.solid}</TabsTrigger>
                          <TabsTrigger value="hollow" className="text-[10px]">{t.hollow}</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="width" className="text-[10px] uppercase font-bold text-slate-400">{t.width} ({u.length})</Label>
                        <NumericInputWithControls 
                          id="width" 
                          min={toDisplay(1, 'length')}
                          max={toDisplay(5000, 'length')}
                          step={unitSystem === 'metric' ? 10 : 0.5}
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
                          max={toDisplay(5000, 'length')}
                          step={unitSystem === 'metric' ? 10 : 0.5}
                          precision={unitSystem === 'metric' ? 0 : 2}
                          value={toDisplay(height ?? 0, 'length')} 
                          onChange={(val) => setHeight(fromDisplay(val, 'length'))}
                        />
                      </div>
                    </div>

                    {sectionType === 'hollow' && (
                      <div className="grid gap-1.5">
                        <Label htmlFor="thickness" className="text-[10px] uppercase font-bold text-slate-400">{t.thickness} ({u.length})</Label>
                        <NumericInputWithControls 
                          id="thickness" 
                          min={toDisplay(0.1, 'length')}
                          max={toDisplay(Math.min(width, height) / 2.1, 'length')}
                          step={unitSystem === 'metric' ? 1 : 0.05}
                          precision={unitSystem === 'metric' ? 1 : 3}
                          value={toDisplay(thickness ?? 0, 'length')} 
                          onChange={(val) => setThickness(fromDisplay(val, 'length'))}
                        />
                      </div>
                    )}
                  </CardContent>
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
                </Card>
          
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
                    <TooltipTrigger>
                      <Label className="text-[9px] uppercase font-bold text-slate-400 cursor-help hover:text-blue-600 transition-colors flex items-center gap-1">
                        Young's Modulus (E) <HelpCircle className="w-2.5 h-2.5" />
                      </Label>
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
                    <TooltipTrigger>
                      <Label className="text-[9px] uppercase font-bold text-slate-400 cursor-help hover:text-blue-600 transition-colors flex items-center gap-1">
                        Yield Strength (σy) <HelpCircle className="w-2.5 h-2.5" />
                      </Label>
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
                    <TooltipTrigger>
                      <Label className="text-[9px] uppercase font-bold text-slate-400 cursor-help hover:text-blue-600 transition-colors flex items-center gap-1">
                        Poisson's Ratio (ν) <HelpCircle className="w-2.5 h-2.5" />
                      </Label>
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
                  isBiViewMode ? "lg:col-span-12" : "lg:col-span-8"
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
                          <div className="flex gap-2"><span className="font-bold text-slate-700">Span:</span> <span>{toDisplay(length, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)} {u.length}</span></div>
                          <div className="flex gap-2"><span className="font-bold text-slate-700">Section:</span> <span>{sectionType === 'hollow' ? `${toDisplay(width, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)}x${toDisplay(height, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)}x${toDisplay(thickness, 'length').toFixed(unitSystem === 'metric' ? 1 : 3)}${u.length}` : `${toDisplay(width, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)}x${toDisplay(height, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)}${u.length}`}</span></div>
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
                  unitSystem={unitSystem}
                  t={t}
                  u={u}
                  toDisplay={toDisplay}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  isChartExpanded={isChartExpanded}
                  setIsChartExpanded={setIsChartExpanded}
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
                    unitSystem={unitSystem}
                    t={t}
                    u={u}
                    toDisplay={toDisplay}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isChartExpanded={isChartExpanded}
                    setIsChartExpanded={setIsChartExpanded}
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
              unitSystem={unitSystem}
              t={t}
              u={u}
              toDisplay={toDisplay}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isChartExpanded={isChartExpanded}
              setIsChartExpanded={setIsChartExpanded}
            />
          )}
          
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
                {/* Left Support */}
                <g transform="translate(50, 120)">
                  {supportCondition === 'simply_supported' || supportCondition === 'fixed_pinned' ? (
                    <g transform="translate(0, 12)">
                      <path d="M 0,0 L -15,25 L 15,25 Z" fill="#475569" />
                      <rect x="-20" y="25" width="40" height="4" fill="#1e293b" rx="1" />
                    </g>
                  ) : (supportCondition === 'cantilever' || supportCondition === 'fixed_fixed') ? (
                    <rect x="-15" y="-40" width="15" height="80" fill="#1e293b" rx="2" />
                  ) : null}
                </g>

                {/* Right Support */}
                <g transform="translate(950, 120)">
                  {supportCondition === 'simply_supported' ? (
                    <g transform="translate(0, 12)">
                      <path d="M 0,0 L -15,25 L 15,25 Z" fill="#475569" />
                      <circle cx="-8" cy="28" r="3" fill="#1e293b" />
                      <circle cx="8" cy="28" r="3" fill="#1e293b" />
                      <rect x="-20" y="31" width="40" height="4" fill="#1e293b" rx="1" />
                    </g>
                  ) : supportCondition === 'fixed_pinned' ? (
                    <g transform="translate(0, 12)">
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
                    L = {toDisplay(length, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)} {u.length}
                  </text>
                </g>
              </svg>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t px-6 py-4">
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.adjustSpan}</Label>
                  <div className="flex items-center gap-2">
                    <NumericInputWithControls 
                      min={toDisplay(100, 'length')}
                      max={toDisplay(50000, 'length')}
                      step={unitSystem === 'metric' ? 100 : 1}
                      precision={unitSystem === 'metric' ? 0 : 2}
                      value={toDisplay(length ?? 0, 'length')} 
                      onChange={(val) => setLength(fromDisplay(val, 'length'))}
                      className="w-32"
                    />
                    <span className="text-xs font-bold text-slate-400">{u.length}</span>
                  </div>
                </div>
                <Slider 
                  value={[length ?? 3000]} 
                  onValueChange={(vals) => setLength(vals[0] ?? 3000)} 
                  min={100} 
                  max={50000} 
                  step={1}
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                  <span>{toDisplay(100, 'length').toFixed(unitSystem === 'metric' ? 0 : 1)} {u.length}</span>
                  <span>{toDisplay(50000, 'length').toFixed(unitSystem === 'metric' ? 0 : 1)} {u.length}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
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
                width={width}
                height={height}
                thickness={thickness}
                material={material}
                safetyFactor={safetyFactor}
                t={t}
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
              className="max-w-4xl mx-auto px-4 py-16"
            >
              <div className="space-y-12">
                <div className="space-y-4 text-center">
                  <h2 className="text-4xl font-black tracking-tight text-slate-900">{t.navDocs}</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">
                    Technical documentation and engineering assumptions used in FacadeCalc structural engine.
                  </p>
                </div>

                <div className="grid gap-8">
                  <section className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      {t.assumptions}
                    </h3>
                    <ul className="space-y-3 text-slate-600 text-sm list-disc pl-5">
                      <li>Simply supported beam model (pin-pin connection).</li>
                      <li>Euler-Bernoulli beam theory for small deflections.</li>
                      <li>Linear elastic material behavior within yield limits.</li>
                      <li>Shear deformation is neglected (valid for high span-to-depth ratios).</li>
                      <li>Self-weight is automatically included based on material density.</li>
                    </ul>
                  </section>

                  <section className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-amber-600" />
                      {t.limits}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-slate-400 uppercase">Deflection Limit</div>
                        <div className="text-sm font-medium text-slate-700">L/175 or 20mm (whichever is less)</div>
                        <p className="text-xs text-slate-500">Standard industry limit for glass support members.</p>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-slate-400 uppercase">Stress Limit</div>
                        <div className="text-sm font-medium text-slate-700">Yield Strength / Safety Factor</div>
                        <p className="text-xs text-slate-500">Allowable stress design (ASD) approach.</p>
                      </div>
                    </div>
                  </section>

                  <section className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-green-600" />
                      {t.codes}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-sm font-bold">China (National)</span>
                        <span className="text-xs text-slate-500">GB 50009, GB/T 5237</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-sm font-bold">Eurocode</span>
                        <span className="text-xs text-slate-500">EN 1991, EN 1999</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-sm font-bold">ASCE / AA</span>
                        <span className="text-xs text-slate-500">ASCE 7-22, ADM 2020</span>
                      </div>
                    </div>
                  </section>
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

function ChartContainer({ data, dataKey, color, unit, label, invert = false, formatter, unitSystem, u }: { 
  data: any[]; 
  dataKey: string; 
  color: string; 
  unit: string;
  label: string;
  invert?: boolean;
  formatter?: (v: number) => string;
  unitSystem: 'metric' | 'imperial';
  u: any;
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
          labelFormatter={(v) => `Pos: ${v.toFixed(unitSystem === 'metric' ? 0 : 2)} ${u.length}`}
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

function NumericInputWithControls({ 
  value, 
  onChange, 
  min = -Infinity, 
  max = Infinity, 
  step = 1, 
  precision = 2,
  className,
  id
}: { 
  value: number; 
  onChange: (val: number) => void; 
  min?: number; 
  max?: number; 
  step?: number; 
  precision?: number;
  className?: string;
  id?: string;
}) {
  const [localValue, setLocalValue] = useState(value.toFixed(precision));

  React.useEffect(() => {
    setLocalValue(value.toFixed(precision));
  }, [value, precision]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    if (val === '') return;
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onChange(Math.min(max, Math.max(min, num)));
    }
  };

  const increment = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const decrement = () => {
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
        disabled={value <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input 
        id={id}
        type="number" 
        value={localValue} 
        onChange={handleInputChange}
        className="h-7 flex-1 text-center bg-white text-xs px-1"
        step="any"
      />
      <Button 
        variant="outline" 
        size="icon" 
        className="h-7 w-7 shrink-0" 
        onClick={increment}
        disabled={value >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
