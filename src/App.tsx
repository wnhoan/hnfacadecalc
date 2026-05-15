/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Calculator, 
  Plus, 
  Minus,
  Trash2, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ArrowLeft,
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
  Minimize2,
  ShieldCheck,
  Image as ImageIcon,
  Paperclip,
  Square,
  Link,
  Droplet,
  Anchor,
  AlertTriangle,
  Eye
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
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  ReferenceLine,
  Label as RechartsLabel
} from 'recharts';

// Custom Components
import { BeamVisualizer3D } from './components/BeamVisualizer3D';
import { BeamDiagrams } from './components/BeamDiagrams';
import { SummaryCard } from './components/SummaryCard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ReportViewer } from './components/ReportViewer';
import { KeyMapDialog } from './components/LocationMap';
import { CalculusStepsCard } from './components/CalculusSteps';
import { ProjectResultsView, ReferenceAttachmentCard } from './components/ProjectResultsView';
import { NumericInputWithControls } from './components/NumericInputWithControls';
import { 
  SealantResultsView, 
  BracketResultsView, 
  CastInResultsView, 
  PanelResultsView, 
  BeamAnalysisChart, 
  UtilizationCards 
} from './components/ResultViews';

// Constants and Logic
import {
  MATERIALS,
  LOAD_CATEGORIES,
  SEISMIC_REGIONS,
  LOCATION_SEISMIC_MAPPING,
  PANEL_MATERIALS,
  SEALANT_MATERIALS,
  BRACKET_TYPES,
  TRANSLATIONS,
  LOCATION_CODE_MAPPING,
  CODES_OF_PRACTICE,
  UNITS,
  CONVERSION,
  DEFAULT_COMBINATIONS,
  PRESET_PROFILES,
  REGIONS_DISPLAY
} from './constants';

import { 
  getProjectResults, 
  calculatePanelResults, 
  calculateSealantResults, 
  calculateBracketResults, 
  calculateCastInEmbedResults,
  safeParseNumber,
  createNewProject,
  getCriticalPoints,
  calculateBeam, 
  calculateRectangularProperties, 
  calculateHollowRectangularProperties,
  calculateChannelProperties,
  calculateLPlateProperties,
  calculateIBeamProperties,
  calculateTSectionProperties,
  calculateCastInEmbed
} from './lib/structural-logic';

import type { 
  Project, 
  ProjectState, 
  HistoryState as FullHistoryState, 
  Combination, 
  BeamProperties,
  Load 
} from './lib/structural-logic';

// Main App Component

function App() {
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
  const [sectionType, setSectionType] = useState<'solid' | 'hollow' | 'channel' | 'l-plate' | 'i-beam' | 't-section'>(() => {
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

// Mapping for automatic design code selection based on location input in multiple languages
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

  const [hoveredLoad, setHoveredLoad] = useState<Load | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mobileTab, setMobileTab] = useState<'inputs' | 'results'>('inputs');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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

  const [calculationMode, setCalculationMode] = useState<'beam' | 'panel' | 'sealant' | 'bracket' | 'cast-in-embed'>(() => {
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
  const [stiffenerCountV, setStiffenerCountV] = useState(0);
  const [stiffenerCountH, setStiffenerCountH] = useState(0);
  const [stiffenerWidth, setStiffenerWidth] = useState(40);
  const [stiffenerHeight, setStiffenerHeight] = useState(40);
  const [stiffenerThickness, setStiffenerThickness] = useState(2.0);

  const [sealantMaterialId, setSealantMaterialId] = useState<keyof typeof SEALANT_MATERIALS>('silicone_structural');
  const [bracketTypeId, setBracketTypeId] = useState<keyof typeof BRACKET_TYPES>('combined');
  const [glassWidth, setGlassWidth] = useState(1500);
  const [glassHeight, setGlassHeight] = useState(3000);
  const [windPressureInput, setWindPressureInput] = useState(1.5);
  const [deadLoadInput, setDeadLoadInput] = useState(0.5);
  const [tributaryArea, setTributaryArea] = useState(4.5);
  const [bracketWidth, setBracketWidth] = useState(100);
  const [bracketHeight, setBracketHeight] = useState(150);
  const [bracketThickness, setBracketThickness] = useState(10);
  const [boltDiameter, setBoltDiameter] = useState(12);
  const [boltCount, setBoltCount] = useState(2);
  const [embedDepth, setEmbedDepth] = useState(120);
  const [edgeDistance, setEdgeDistance] = useState(150);
  const [concreteGrade, setConcreteGrade] = useState(30);

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

  const [past, setPast] = useState<ProjectState[]>([]);
  const [future, setFuture] = useState<ProjectState[]>([]);
  const isHistoryAction = React.useRef(false);

  const t = TRANSLATIONS[lang];
  const u = UNITS[unitSystem];

  const toDisplay = (val: number, type: keyof typeof UNITS.metric): number => {
    if (unitSystem === 'metric') {
      if (type === 'momentDisplay') return val / 1000000;
      if (type === 'forceDisplay') return val / 1000;
      return val;
    }
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

  const getCurrentState = (): ProjectState => ({
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
    sealantMaterialId,
    bracketTypeId,
    sectionType,
    beamType,
    width,
    height,
    thickness,
    thickness2,
    supportCondition,
    intermediateSupports,
    safetyFactor,
    stiffenerCountV,
    stiffenerCountH,
    stiffenerWidth,
    stiffenerHeight,
    stiffenerThickness,
    glassWidth,
    glassHeight,
    windPressureInput,
    deadLoadInput,
    tributaryArea,
    bracketWidth,
    bracketHeight,
    bracketThickness,
    boltDiameter,
    boltCount,
    embedDepth,
    edgeDistance,
    concreteGrade,
    selectedCodeId,
    loads,
    combinations,
    activeCombinationId,
    seismicRegion,
    seismicCoeff,
    unitSystem,
    projectNotes
  });

  const applyState = (state: ProjectState) => {
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
    setSealantMaterialId(state.sealantMaterialId ?? 'silicone_structural');
    setBracketTypeId(state.bracketTypeId as any);
    setSectionType(state.sectionType);
    setWidth(state.width);
    setHeight(state.height);
    setThickness(state.thickness);
    setThickness2(state.thickness2 ?? state.thickness);
    setSupportCondition(state.supportCondition);
    setIntermediateSupports(state.intermediateSupports ?? []);
    setSafetyFactor(state.safetyFactor);
    setStiffenerCountV(state.stiffenerCountV ?? 0);
    setStiffenerCountH(state.stiffenerCountH ?? 0);
    setStiffenerWidth(state.stiffenerWidth ?? 40);
    setStiffenerHeight(state.stiffenerHeight ?? 40);
    setStiffenerThickness(state.stiffenerThickness ?? 2);
    setGlassWidth(state.glassWidth ?? 1500);
    setGlassHeight(state.glassHeight ?? 3000);
    setWindPressureInput(state.windPressureInput ?? 1.5);
    setDeadLoadInput(state.deadLoadInput ?? 0.5);
    setTributaryArea(state.tributaryArea ?? 4.5);
    setBracketWidth(state.bracketWidth ?? 100);
    setBracketHeight(state.bracketHeight ?? 150);
    setBracketThickness(state.bracketThickness ?? 10);
    setBoltDiameter(state.boltDiameter ?? 12);
    setBoltCount(state.boltCount ?? 2);
    setEmbedDepth(state.embedDepth ?? 120);
    setEdgeDistance(state.edgeDistance ?? 150);
    setConcreteGrade(state.concreteGrade ?? 30);
    setBeamType(state.beamType ?? 'mullion');
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
  const lastStateRef = React.useRef<ProjectState | null>(null);
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
    } else if (sectionType === 'i-beam') {
      return calculateIBeamProperties(width, height, thickness, thickness2);
    } else if (sectionType === 't-section') {
      return calculateTSectionProperties(width, height, thickness, thickness2);
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
    elasticModulus: MATERIALS[material]?.e ?? 70000,
    momentOfInertia: sectionProps.momentOfInertia,
    sectionModulus: sectionProps.sectionModulus,
    yieldStrength: MATERIALS[material]?.yield ?? 160,
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
          utilizationDeflection: 0,
          allowableStress: 0
        }
      };
    }
  }, [beamProps, factoredLoads, length, activeCombination]);

  const criticalPoints = useMemo(() => 
    getCriticalPoints(results, unitSystem, u, toDisplay)
  , [results, unitSystem, u, toDisplay]);

  const panelResults = useMemo(() => {
    return calculatePanelResults({ ...getCurrentState(), id: activeProjectId });
  }, [calculationMode, panelMaterialId, width, length, loads, activeCombinationId, combinations, stiffenerCountV, stiffenerCountH, stiffenerWidth, stiffenerHeight, stiffenerThickness, safetyFactor]);

  const sealantResults = useMemo(() => {
    return calculateSealantResults({ ...getCurrentState(), id: activeProjectId });
  }, [calculationMode, sealantMaterialId, glassWidth, glassHeight, windPressureInput, deadLoadInput, width, thickness]);

  const bracketResults = useMemo(() => {
    return calculateBracketResults({ ...getCurrentState(), id: activeProjectId });
  }, [calculationMode, material, tributaryArea, windPressureInput, boltDiameter, boltCount, bracketWidth, bracketThickness, safetyFactor]);

  const castInResults = useMemo(() => {
    return calculateCastInEmbedResults({ ...getCurrentState(), id: activeProjectId });
  }, [calculationMode, embedDepth, edgeDistance, concreteGrade, boltDiameter, boltCount, windPressureInput, deadLoadInput, tributaryArea, safetyFactor]);

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
    const mat = MATERIALS[material as keyof typeof MATERIALS] as any;
    const densityKgM3 = mat?.density ?? 2700;
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
        <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-8 overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0" onClick={() => setView('calculator')}>
              <div className="bg-blue-600 p-1 sm:p-1.5 rounded-lg">
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="font-bold text-sm sm:text-lg md:text-xl tracking-tight truncate max-w-[100px] sm:max-w-none">{t.title}</h1>
              {view === 'calculator' && (
                <div className={cn(
                  "hidden xs:flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm transition-all duration-500",
                  results.summary.status === 'pass' 
                    ? "bg-green-500 text-white" 
                    : "bg-red-500 text-white"
                )}>
                  {results.summary.status === 'pass' ? 'PASS' : 'FAIL'}
                </div>
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

          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1 rounded-lg border">
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

            <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1 rounded-lg border">
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
              <Button size="sm" onClick={() => setView('calculator')} className="bg-blue-600 hover:bg-blue-700 h-8 sm:h-9 text-xs sm:text-sm">
                {t.getStarted}
              </Button>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="hidden sm:flex items-center bg-slate-100 rounded-md p-0.5 mr-1 sm:mr-2">
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

                <div className="flex items-center gap-1">
                  <Button 
                    variant={isBiViewMode ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setIsBiViewMode(!isBiViewMode)}
                    className={cn("h-8 text-[10px] sm:text-xs gap-1.5 px-2 sm:px-3", isBiViewMode && "bg-blue-600")}
                  >
                    <Layout className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden lg:inline">Bi-View</span>
                  </Button>

                  <Button variant="outline" size="sm" onClick={saveProject} className="h-8 text-[10px] sm:text-xs gap-1.5 px-2 sm:px-3">
                    <Save className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden lg:inline">{t.saveProject}</span>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 text-[10px] sm:text-xs gap-1.5 px-2 sm:px-3 py-1 bg-transparent border border-input hover:bg-accent hover:text-accent-foreground cursor-pointer">
                      <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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

                  <DropdownMenu>
                    <DropdownMenuTrigger className="lg:hidden inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-8 w-8 bg-transparent border border-input hover:bg-accent cursor-pointer">
                      <Menu className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                       <DropdownMenuGroup>
                         <DropdownMenuLabel>Settings & View</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem onClick={() => setView('calculator')}>Calculator</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setView('docs')}>Documentation</DropdownMenuItem>
                       </DropdownMenuGroup>
                       <DropdownMenuSeparator />
                       <div className="p-2 space-y-2">
                         <div className="flex items-center justify-between">
                            <span className="text-xs">Language</span>
                            <Select value={lang} onValueChange={(v: any) => setLang(v)}>
                              <SelectTrigger className="h-7 w-[60px] text-[10px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">EN</SelectItem>
                                <SelectItem value="zh">ZH</SelectItem>
                              </SelectContent>
                            </Select>
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="text-xs">Units</span>
                            <Select value={unitSystem} onValueChange={(v: any) => setUnitSystem(v)}>
                              <SelectTrigger className="h-7 w-[80px] text-[10px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="metric">Metric</SelectItem>
                                <SelectItem value="imperial">Imperial</SelectItem>
                              </SelectContent>
                            </Select>
                         </div>
                       </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
              {/* Mobile View Toggle */}
              <div className="lg:hidden border-b bg-white px-4 py-2 flex items-center justify-center print:hidden">
                <Tabs value={mobileTab} onValueChange={(v: any) => setMobileTab(v)} className="w-[200px]">
                  <TabsList className="grid w-full grid-cols-2 h-8">
                    <TabsTrigger value="inputs" className="text-[10px] font-bold">CONFIG</TabsTrigger>
                    <TabsTrigger value="results" className="text-[10px] font-bold text-center flex items-center gap-1.5 justify-center">
                      RESULT
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        results.summary.status === 'pass' ? "bg-green-500" : "bg-red-500 animate-pulse"
                      )} />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-0 print:block overflow-hidden bg-white">
                {/* Left Column: Inputs */}
                <div className={cn(
                  "lg:col-span-4 xl:col-span-3 h-full overflow-y-auto p-4 sm:p-5 border-r border-slate-200 bg-slate-50/20 no-scrollbar print:hidden shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.03)]",
                  mobileTab !== 'inputs' && "hidden lg:block"
                )}>
                  <div className="flex flex-col gap-5">
                    {/* Analysis Mode Switch */}
                    <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Tabs value={calculationMode} onValueChange={(v: any) => {
                        setCalculationMode(v);
                      }} className="w-full">
                        <TabsList className="grid w-full grid-cols-5 h-10 p-1 bg-slate-100/50 rounded-xl border-none">
                          <TabsTrigger 
                            value="beam" 
                            className={cn(
                              "text-[9px] font-black uppercase tracking-tight data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 px-2",
                              results?.summary?.status === 'fail' && "text-red-500 data-[state=active]:text-red-500"
                            )}
                          >
                            <Box className="w-3.5 h-3.5" />
                            <span>Beam</span>
                          </TabsTrigger>
                          <TabsTrigger 
                            value="panel" 
                            className={cn(
                              "text-[9px] font-black uppercase tracking-tight data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 px-2",
                              panelResults?.summary?.status === 'fail' && "text-red-500 data-[state=active]:text-red-500"
                            )}
                          >
                            <Square className="w-3.5 h-3.5" />
                            <span>Panel</span>
                          </TabsTrigger>
                          <TabsTrigger 
                            value="sealant" 
                            className={cn(
                              "text-[9px] font-black uppercase tracking-tight data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 px-2",
                              sealantResults?.status === 'fail' && "text-red-500 data-[state=active]:text-red-500"
                            )}
                          >
                            <Droplet className="w-3.5 h-3.5" />
                            <span>Seal</span>
                          </TabsTrigger>
                          <TabsTrigger 
                            value="bracket" 
                            className={cn(
                              "text-[9px] font-black uppercase tracking-tight data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 px-2",
                              bracketResults?.status === 'fail' && "text-red-500 data-[state=active]:text-red-500"
                            )}
                          >
                            <Link className="w-3.5 h-3.5" />
                            <span>Brkt</span>
                          </TabsTrigger>
                          <TabsTrigger 
                            value="cast-in-embed" 
                            className={cn(
                              "text-[9px] font-black uppercase tracking-tight data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 px-2",
                              castInResults?.status === 'fail' && "text-red-500 data-[state=active]:text-red-500"
                            )}
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Embed</span>
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
                                        <div className="flex items-center justify-center gap-1">
                                           <div className="text-[10px] uppercase text-slate-400">{key}</div>
                                           <TooltipProvider>
                                             <Tooltip>
                                               <TooltipTrigger>
                                                 <Info className="h-3 w-3 text-slate-400" />
                                               </TooltipTrigger>
                                               <TooltipContent className="text-xs">
                                                 {cat.name}
                                               </TooltipContent>
                                             </Tooltip>
                                           </TooltipProvider>
                                        </div>
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
                                            className={cn("h-8 w-8", activeCombinationId === comb.id ? "text-blue-600" : "text-slate-300 hover:text-blue-400")}
                                            onClick={() => setActiveCombinationId(comb.id)}
                                            title="Set as Active"
                                          >
                                            <CheckCircle2 className="h-4 w-4" />
                                          </Button>
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
                      <Label htmlFor="length" className="text-[10px] uppercase font-bold text-slate-400">{(calculationMode as string) === 'beam' ? t.span : 'Panel Height'} ({u.length})</Label>
                      <NumericInputWithControls 
                        id="length"
                        min={toDisplay(100, 'length')}
                        max={toDisplay(12000, 'length')}
                        step={unitSystem === 'metric' ? 10 : 0.5}
                        precision={unitSystem === 'metric' ? 0 : 2}
                        value={toDisplay(length ?? 0, 'length')} 
                        onChange={(val) => setLength(fromDisplay(val, 'length'))}
                      />
                    </div>

                    {(calculationMode as string) === 'panel' && (
                      <div className="grid gap-1.5">
                        <Label htmlFor="width" className="text-[10px] uppercase font-bold text-slate-400">Panel Width ({u.length})</Label>
                        <NumericInputWithControls 
                          id="width" 
                          min={toDisplay(100, 'length')}
                          max={toDisplay(12000, 'length')}
                          step={unitSystem === 'metric' ? 10 : 0.5}
                          precision={unitSystem === 'metric' ? 0 : 2}
                          value={toDisplay(width ?? 0, 'length')} 
                          onChange={(val) => setWidth(fromDisplay(val, 'length'))}
                        />
                      </div>
                    )}
                    
                    {/* Sealant specific */}
                    {(calculationMode as string) === 'sealant' && (
                      <div className="space-y-3 p-3 bg-blue-50/30 rounded-xl border border-blue-100">
                        <div className="grid gap-1.5">
                          <Label className="text-[10px] uppercase font-bold text-blue-600">Sealant Material</Label>
                          <Select value={sealantMaterialId} onValueChange={(v: any) => setSealantMaterialId(v)}>
                            <SelectTrigger className="bg-white h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(SEALANT_MATERIALS).map(([key, m]) => (
                                <SelectItem key={key} value={key} className="text-xs">{m.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-1.5">
                            <Label className="text-[10px] uppercase font-bold text-slate-400">Glass Width ({u.length})</Label>
                            <NumericInputWithControls 
                              min={toDisplay(100, 'length')}
                              max={toDisplay(6000, 'length')}
                              step={unitSystem === 'metric' ? 10 : 0.5}
                              precision={unitSystem === 'metric' ? 0 : 2}
                              value={toDisplay(glassWidth, 'length')} 
                              onChange={(v) => setGlassWidth(fromDisplay(v, 'length'))} 
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label className="text-[10px] uppercase font-bold text-slate-400">Glass Height ({u.length})</Label>
                            <NumericInputWithControls 
                              min={toDisplay(100, 'length')}
                              max={toDisplay(6000, 'length')}
                              step={unitSystem === 'metric' ? 10 : 0.5}
                              precision={unitSystem === 'metric' ? 0 : 2}
                              value={toDisplay(glassHeight, 'length')} 
                              onChange={(v) => setGlassHeight(fromDisplay(v, 'length'))} 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-1.5">
                            <Label className="text-[10px] uppercase font-bold text-slate-400">Wind Pressure (kPa)</Label>
                            <NumericInputWithControls 
                              value={windPressureInput} 
                              min={0.1}
                              max={15}
                              step={0.05} 
                              precision={2}
                              onChange={setWindPressureInput} 
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label className="text-[10px] uppercase font-bold text-slate-400">Actual Bite ({u.length})</Label>
                            <NumericInputWithControls 
                              min={toDisplay(4, 'length')}
                              max={toDisplay(100, 'length')}
                              step={unitSystem === 'metric' ? 1 : 0.01}
                              precision={unitSystem === 'metric' ? 0 : 3}
                              value={toDisplay(width, 'length')} 
                              onChange={(v) => setWidth(fromDisplay(v, 'length'))} 
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bracket specific */}
                    {(calculationMode as string) === 'bracket' && (
                      <div className="space-y-3 p-3 bg-rose-50/30 rounded-xl border border-rose-100">
                        <div className="grid gap-1.5">
                          <Label className="text-[10px] uppercase font-bold text-rose-600">Bracket Type</Label>
                          <Select value={bracketTypeId} onValueChange={(v: any) => setBracketTypeId(v)}>
                            <SelectTrigger className="bg-white h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(BRACKET_TYPES).map(([key, m]) => (
                                <SelectItem key={key} value={key} className="text-xs">{m.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-1.5">
                            <Label className="text-[10px] uppercase font-bold text-slate-400">Tributary Area (m²)</Label>
                            <NumericInputWithControls 
                              value={tributaryArea} 
                              min={0.1}
                              max={100}
                              step={0.1} 
                              precision={1}
                              onChange={setTributaryArea} 
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label className="text-[10px] uppercase font-bold text-slate-400">Wind Pressure (kPa)</Label>
                            <NumericInputWithControls 
                              value={windPressureInput} 
                              min={0.1}
                              max={15}
                              step={0.05} 
                              precision={2}
                              onChange={setWindPressureInput} 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="grid gap-1.5">
                            <Label className="text-[10px] uppercase font-bold text-slate-400">B (mm)</Label>
                            <NumericInputWithControls 
                              value={bracketWidth} 
                              min={20} 
                              max={1000}
                              step={5}
                              precision={0}
                              onChange={setBracketWidth} 
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label className="text-[10px] uppercase font-bold text-slate-400">T (mm)</Label>
                            <NumericInputWithControls 
                              value={bracketThickness} 
                              min={1} 
                              max={60}
                              step={1}
                              precision={0}
                              onChange={setBracketThickness} 
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label className="text-[10px] uppercase font-bold text-slate-400">Bolt Count</Label>
                            <NumericInputWithControls 
                              value={boltCount} 
                              min={1} 
                              max={20}
                              step={1} 
                              precision={0}
                              onChange={setBoltCount} 
                            />
                          </div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Bolt Diameter (mm)</Label>
                          <NumericInputWithControls 
                            value={boltDiameter} 
                            min={6} 
                            max={48}
                            step={2} 
                            precision={0}
                            onChange={setBoltDiameter} 
                          />
                        </div>
                      </div>
                    )}

                    {/* Cast-in Embed specific */}
                    {calculationMode === 'cast-in-embed' && (
                      <div className="space-y-3 p-3 bg-blue-50/30 rounded-xl border border-blue-100">
                        <div className="grid gap-1.5">
                          <Label className="text-[10px] uppercase font-bold text-blue-600">{t.boltProps}</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-1.5">
                              <Label className="text-[10px] uppercase font-bold text-slate-400">{t.boltDiameter} (mm)</Label>
                              <NumericInputWithControls value={boltDiameter} min={6} max={30} step={2} precision={0} onChange={setBoltDiameter} />
                            </div>
                            <div className="grid gap-1.5">
                              <Label className="text-[10px] uppercase font-bold text-slate-400">{t.boltCount}</Label>
                              <NumericInputWithControls value={boltCount} min={1} max={10} step={1} precision={0} onChange={setBoltCount} />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-1.5">
                            <Label className="text-[10px] uppercase font-bold text-slate-400">{t.embedDepth} (mm)</Label>
                            <NumericInputWithControls value={embedDepth} min={40} max={300} step={5} precision={0} onChange={setEmbedDepth} />
                          </div>
                          <div className="grid gap-1.5">
                            <Label className="text-[10px] uppercase font-bold text-slate-400">{t.edgeDistance} (mm)</Label>
                            <NumericInputWithControls value={edgeDistance} min={25} max={1000} step={5} precision={0} onChange={setEdgeDistance} />
                          </div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">{t.concreteGrade} (MPa)</Label>
                          <Select value={concreteGrade.toString()} onValueChange={(v) => setConcreteGrade(Number(v))}>
                            <SelectTrigger className="bg-white h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {[20, 25, 30, 35, 40, 50].map(c => (
                                <SelectItem key={c} value={c.toString()} className="text-xs">C{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid gap-1.5">
                      <Label className="text-[10px] uppercase font-bold text-slate-400">{calculationMode === 'beam' ? t.material : (calculationMode === 'panel' ? t.skinMaterial : 'Structure Material')}</Label>
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
                            <TabsList className="grid w-full grid-cols-6 h-8">
                              <TabsTrigger value="solid" className="text-[10px]">{t.solid}</TabsTrigger>
                              <TabsTrigger value="hollow" className="text-[10px]">{t.hollow}</TabsTrigger>
                              <TabsTrigger value="channel" className="text-[10px]">Channel</TabsTrigger>
                              <TabsTrigger value="l-plate" className="text-[10px]">L-Plate</TabsTrigger>
                              <TabsTrigger value="i-beam" className="text-[10px]">I-Beam</TabsTrigger>
                              <TabsTrigger value="t-section" className="text-[10px]">T-Section</TabsTrigger>
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
                                 sectionType === 'l-plate' ? 'Horiz. Thickness (th)' :
                                 'Web Thickness (tw)'} ({u.length})
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
                                 sectionType === 'l-plate' ? 'Vert. Thickness (tv)' :
                                 'Flange Thickness (tf)'} ({u.length})
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
                            min={1}
                            max={60}
                            step={0.5}
                            precision={1}
                            value={panelMaterialId.includes('acm') ? ((PANEL_MATERIALS[panelMaterialId] as any)?.totalThickness ?? 4) : (thickness || 3)}
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
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                          <Label htmlFor="stiffener-count-v" className="text-[10px] uppercase font-bold text-slate-400">{t.stiffenerCountV}</Label>
                          <NumericInputWithControls 
                            id="stiffener-count-v"
                            min={0}
                            max={20}
                            step={1}
                            precision={0}
                            value={stiffenerCountV}
                            onChange={(val) => setStiffenerCountV(val)}
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="stiffener-count-h" className="text-[10px] uppercase font-bold text-slate-400">{t.stiffenerCountH}</Label>
                          <NumericInputWithControls 
                            id="stiffener-count-h"
                            min={0}
                            max={20}
                            step={1}
                            precision={0}
                            value={stiffenerCountH}
                            onChange={(val) => setStiffenerCountH(val)}
                          />
                        </div>
                      </div>
                      
                      {(stiffenerCountV > 0 || stiffenerCountH > 0) && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-1.5">
                              <Label htmlFor="s-width" className="text-[10px] uppercase font-bold text-slate-400">Stiffener Width</Label>
                              <NumericInputWithControls 
                                id="s-width" 
                                min={10} 
                                max={400}
                                step={2}
                                precision={0}
                                value={stiffenerWidth} 
                                onChange={setStiffenerWidth} 
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <Label htmlFor="s-height" className="text-[10px] uppercase font-bold text-slate-400">Stiffener Height</Label>
                              <NumericInputWithControls 
                                id="s-height" 
                                min={10} 
                                max={400}
                                step={2}
                                precision={0}
                                value={stiffenerHeight} 
                                onChange={setStiffenerHeight} 
                              />
                            </div>
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="s-thick" className="text-[10px] uppercase font-bold text-slate-400">Stiffener Thickness</Label>
                            <NumericInputWithControls 
                              id="s-thick" 
                              min={0.5} 
                              max={30} 
                              step={0.1} 
                              precision={1}
                              value={stiffenerThickness} 
                              onChange={setStiffenerThickness} 
                            />
                          </div>
                          <div className="p-2 bg-rose-50 border border-slate-100 rounded-md">
                            <p className="text-[9px] text-slate-600 leading-tight">
                              <strong>Note:</strong> Stiffeners divide the panel into sub-panels. Vertical stiffeners span panel height, Horizontal stiffeners span panel width. Analysis uses Roark's formulas for individual sub-panels.
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
              <CardTitle className="text-sm sm:text-base">{(MATERIALS[material] as any)?.name ?? 'Unknown'}</CardTitle>
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
                    {toDisplay((MATERIALS[material] as any)?.e ?? 70000, 'stress').toLocaleString()} {u.stress}
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
                    {toDisplay((MATERIALS[material] as any)?.yield ?? 160, 'stress').toLocaleString()} {u.stress}
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
                    {(MATERIALS[material] as any)?.poisson?.toFixed(2) ?? '-'}
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
                      <div className="absolute top-1 right-1 flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => {
                            const newLoad = { ...load, id: Math.random().toString(36).substr(2, 9) };
                            setLoads([...loads, newLoad]);
                          }}
                          title="Duplicate Load"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors lg:hidden"
                          onClick={() => removeLoad(load.id)}
                          title="Remove Load"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 flex-1">
                          <span className="text-[9px] sm:text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">#{idx + 1}</span>
                          <Select 
                            value={load.type} 
                            onValueChange={(v: any) => updateLoad(load.id, { 
                              type: v,
                              value2: v === 'trapezoidal' ? load.value : undefined,
                              start: v === 'trapezoidal' ? 0 : undefined,
                              end: v === 'trapezoidal' ? length : undefined
                            })}
                          >
                            <SelectTrigger className="h-7 sm:h-6 text-[10px] sm:text-[10px] border-slate-200 bg-slate-50/50 px-2 w-[100px] sm:w-[90px] focus:ring-1 focus:ring-blue-500">
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
                            "h-7 sm:h-6 text-[10px] font-bold px-3 sm:px-2 rounded-full border-none focus:ring-0 w-fit shadow-xs",
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

                        <div className="hidden lg:block">
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
                      </div>

                      <div className="bg-slate-50/50 p-2 sm:p-1.5 rounded-md border border-slate-100 flex-1 flex flex-col justify-center">
                        <div className="grid grid-cols-2 gap-3 sm:gap-2">
                          <div className="space-y-1 sm:space-y-0.5">
                            <Label className="text-[10px] sm:text-[8px] uppercase font-bold text-slate-400">
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
                            <div className="space-y-1 sm:space-y-0.5">
                              <Label className="text-[10px] sm:text-[8px] uppercase font-bold text-slate-400">Pos ({u.length})</Label>
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
                            <div className="space-y-1 sm:space-y-0.5">
                              <Label className="text-[10px] sm:text-[8px] uppercase font-bold text-slate-400">w2 ({u.udl})</Label>
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
                          <div className="grid grid-cols-2 gap-3 sm:gap-2 mt-2 sm:mt-1.5">
                            <div className="space-y-1 sm:space-y-0.5">
                              <Label className="text-[10px] sm:text-[8px] uppercase font-bold text-slate-400">Start ({u.length})</Label>
                              <NumericInputWithControls 
                                min={0}
                                max={toDisplay(length, 'length')}
                                step={unitSystem === 'metric' ? 100 : 1}
                                precision={unitSystem === 'metric' ? 0 : 2}
                                value={toDisplay(load.start ?? 0, 'length')} 
                                onChange={(val) => updateLoad(load.id, { start: fromDisplay(val, 'length') })}
                              />
                            </div>
                            <div className="space-y-1 sm:space-y-0.5">
                              <Label className="text-[10px] sm:text-[8px] uppercase font-bold text-slate-400">End ({u.length})</Label>
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
                  "h-full overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 no-scrollbar print:block bg-slate-50/50",
                  isBiViewMode ? "lg:col-span-12" : "lg:col-span-8 xl:col-span-9",
                  mobileTab !== 'results' && "hidden lg:block"
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
                          <div className="flex gap-2"><span className="font-bold text-slate-700">Material:</span> <span>{(MATERIALS[material] as any)?.name ?? 'Unknown'}</span></div>
                          <div className="flex gap-2"><span className="font-bold text-slate-700">Span:</span> <span>{toDisplay(length ?? 0, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)} {u.length}</span></div>
                          <div className="flex gap-2"><span className="font-bold text-slate-700">Section:</span> <span>{(['hollow', 'channel', 'i-beam', 't-section'].includes(sectionType)) ? `${toDisplay(width ?? 0, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)}x${toDisplay(height ?? 0, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)}x${toDisplay(thickness ?? 0, 'length').toFixed(unitSystem === 'metric' ? 1 : 3)}${u.length}` : `${toDisplay(width ?? 0, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)}x${toDisplay(height ?? 0, 'length').toFixed(unitSystem === 'metric' ? 0 : 2)}${u.length}`}</span></div>
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
                  sealantResults={sealantResults}
                  bracketResults={bracketResults}
                  castInResults={castInResults}
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
                  setMobileTab={setMobileTab}
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
                    panelResults={calculatePanelResults(projects.find(p => p.id === comparisonProjectId)!)}
                    sealantResults={calculateSealantResults(projects.find(p => p.id === comparisonProjectId)!)}
                    bracketResults={calculateBracketResults(projects.find(p => p.id === comparisonProjectId)!)}
                    castInResults={calculateCastInEmbedResults(projects.find(p => p.id === comparisonProjectId)!)}
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
                    setMobileTab={setMobileTab}
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
              sealantResults={sealantResults}
              bracketResults={bracketResults}
              castInResults={castInResults}
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
              setMobileTab={setMobileTab}
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
                   {/* Vertical Stiffeners */}
                   {[...Array(stiffenerCountV)].map((_, i) => (
                     <div 
                       key={`v-${i}`} 
                       className="absolute bg-rose-500/40 border-x border-rose-600/50" 
                       style={{ 
                         width: '8px', 
                         height: '100%', 
                         left: `${(i + 1) * (100 / (stiffenerCountV + 1))}%`,
                         transform: 'translateX(-50%)'
                       }} 
                     />
                   ))}
                   {/* Horizontal Stiffeners */}
                   {[...Array(stiffenerCountH)].map((_, i) => (
                     <div 
                       key={`h-${i}`} 
                       className="absolute bg-amber-500/40 border-y border-amber-600/50" 
                       style={{ 
                         height: '8px', 
                         width: '100%', 
                         top: `${(i + 1) * (100 / (stiffenerCountH + 1))}%`,
                         transform: 'translateY(-50%)'
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
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-rose-400" /> V-Stiffeners</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-amber-400" /> H-Stiffeners</div>
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
                    {calculationMode === 'cast-in-embed' && (
                      <li className="text-blue-600 font-bold">CCD Method (ACI 318 Annex D)</li>
                    )}
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
                    {calculationMode === 'cast-in-embed' ? (
                      <>
                        <li>Concrete Breakout: f(hef, c1, fc').</li>
                        <li>Steel Cap: n * As * fy.</li>
                        <li>Interaction: (N/Nn)^1.5 + (V/Vn)^1.5 ≤ 1.0.</li>
                      </>
                    ) : (
                      <>
                        <li>Supported Loads: D, L, W, S, E.</li>
                        <li>Seismic: Cs × Total Dead Load.</li>
                        <li>Self-weight: Add manually as UDL.</li>
                      </>
                    )}
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
                      <span className="text-[10px] font-mono font-bold text-blue-600">{toDisplay((MATERIALS[material] as any)?.e ?? 70000, 'stress').toLocaleString()} {u.stress}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Yield Strength (fy)</span>
                      <span className="text-[10px] font-mono font-bold text-blue-600">{toDisplay((MATERIALS[material] as any)?.yield ?? 160, 'stress').toFixed(0)} {u.stress}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Poisson's Ratio (ν)</span>
                      <span className="text-[10px] font-mono font-bold text-blue-600">{(MATERIALS[material] as any)?.poisson?.toFixed(2) ?? '-'}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                      <span className="text-[10px] text-slate-500">Allowable Stress</span>
                      <span className="text-[10px] font-mono font-bold text-green-600">
                        {toDisplay(((MATERIALS[material] as any)?.yield ?? 160) / safetyFactor, 'stress').toFixed(unitSystem === 'metric' ? 1 : 0)} {u.stress}
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
                calculationMode={calculationMode}
                embedDepth={embedDepth}
                edgeDistance={edgeDistance}
                concreteGrade={concreteGrade}
                boltCount={boltCount}
                boltDiameter={boltDiameter}
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
                    <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
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
                    <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
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
                    <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
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
                           <div className="space-y-2 sm:col-span-2 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                             <h4 className="text-xs font-bold text-blue-900 flex items-center gap-2">
                               <Anchor className="w-4 h-4" />
                               Cast-in Embed Design (ACI 318 Annex D)
                             </h4>
                             <p className="text-xs text-slate-600 leading-relaxed mt-2">
                               Embeded anchors are analyzed for <strong>Concrete Breakout</strong> and <strong>Steel Pullout</strong>. 
                               The capacity is governed by the effective embedment depth (h_ef) and edge distance (c_1). 
                               Interaction between simultaneous tension and shear follows the power law: 
                               <code className="inline-block px-2 py-0.5 mt-1 bg-white rounded border border-blue-200 font-mono text-[10px]">(N/Nn)^1.5 + (V/Vn)^1.5 ≤ 1.0</code>.
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
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/10"
          >
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg ring-4 ring-blue-600/20">
              <Globe className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">System Notification</span>
              <p className="text-[11px] font-bold text-slate-100">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </TooltipProvider>
  );
}

function Root() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default Root;
