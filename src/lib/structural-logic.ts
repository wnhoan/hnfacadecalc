import { 
  calculateBeam, 
  calculateRectangularProperties, 
  calculateHollowRectangularProperties,
  calculateChannelProperties,
  calculateLPlateProperties,
  calculateIBeamProperties,
  calculateTSectionProperties,
  calculateCastInEmbed,
  BeamProperties,
  Load
} from './structural-engine';

export { 
  calculateBeam, 
  calculateRectangularProperties, 
  calculateHollowRectangularProperties,
  calculateChannelProperties,
  calculateLPlateProperties,
  calculateIBeamProperties,
  calculateTSectionProperties,
  calculateCastInEmbed,
};

export type { BeamProperties, Load };
import { MATERIALS, PANEL_MATERIALS, SEALANT_MATERIALS, DEFAULT_COMBINATIONS, SEISMIC_REGIONS } from '../constants';

export interface Combination {
  id: string;
  name: string;
  description: string;
  factors: Record<string, number>;
}

export interface ProjectState {
  projectTitle: string;
  projectLocation: string;
  projectDescription: string;
  projectDate: string;
  projectTime: string;
  projectAttachment?: string;
  calculationMode: 'beam' | 'panel' | 'bracket' | 'sealant' | 'cast-in-embed';
  length: number;
  material: keyof typeof MATERIALS;
  panelMaterialId: keyof typeof PANEL_MATERIALS;
  sealantMaterialId: keyof typeof SEALANT_MATERIALS;
  bracketTypeId: string;
  sectionType: 'solid' | 'hollow' | 'channel' | 'l-plate' | 'i-beam' | 't-section';
  beamType: 'mullion' | 'transom';
  width: number;
  height: number;
  thickness: number;
  thickness2: number;
  supportCondition: 'simply_supported' | 'cantilever' | 'propped_cantilever' | 'fixed_fixed' | 'fixed_pinned' | 'continuous';
  intermediateSupports: number[];
  safetyFactor: number;
  stiffenerCountV: number;
  stiffenerCountH: number;
  stiffenerWidth: number;
  stiffenerHeight: number;
  stiffenerThickness: number;
  glassWidth: number;
  glassHeight: number;
  windPressureInput: number;
  deadLoadInput: number;
  tributaryArea: number;
  bracketWidth: number;
  bracketHeight: number;
  bracketThickness: number;
  boltDiameter: number;
  boltCount: number;
  embedDepth: number;
  edgeDistance: number;
  concreteGrade: number;
  selectedCodeId: string;
  loads: Load[];
  combinations: Combination[];
  activeCombinationId: string;
  seismicRegion: keyof typeof SEISMIC_REGIONS;
  seismicCoeff: number;
  unitSystem: 'metric' | 'imperial';
  projectNotes: string;
}

export interface HistoryState {
  past: ProjectState[];
  present: ProjectState;
  future: ProjectState[];
}

export interface Project extends ProjectState {
  id: string;
}

export const safeParseNumber = (val: string | number, fallback: number = 0, min: number = -Infinity, max: number = Infinity): number => {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return fallback;
  return Math.min(Math.max(num, min), max);
};

export const getProjectResults = (project: Project) => {
  const sectionProps = project.sectionType === 'solid' 
    ? calculateRectangularProperties(project.width, project.height)
    : project.sectionType === 'channel'
    ? calculateChannelProperties(project.width, project.height, project.thickness, project.thickness2)
    : project.sectionType === 'l-plate'
    ? calculateLPlateProperties(project.width, project.height, project.thickness, project.thickness2)
    : project.sectionType === 'i-beam'
    ? calculateIBeamProperties(project.width, project.height, project.thickness, project.thickness2)
    : project.sectionType === 't-section'
    ? calculateTSectionProperties(project.width, project.height, project.thickness, project.thickness2)
    : calculateHollowRectangularProperties(project.width, project.height, project.thickness, project.thickness2);

  const activeCombination = project.combinations.find(c => c.id === project.activeCombinationId) || project.combinations[0] || { factors: {}, name: 'Default' };
  
  const factoredLoads = project.loads.map(load => ({
    ...load,
    value: load.value * ((activeCombination.factors as any)?.[load.category] ?? 0),
    value2: load.value2 !== undefined ? load.value2 * ((activeCombination.factors as any)?.[load.category] ?? 0) : undefined,
  }));

  const beamProps: BeamProperties = {
    length: project.length,
    elasticModulus: (MATERIALS[project.material] as any)?.e ?? 70000,
    momentOfInertia: sectionProps.momentOfInertia,
    sectionModulus: sectionProps.sectionModulus,
    yieldStrength: (MATERIALS[project.material] as any)?.yield ?? 160,
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
        utilizationDeflection: 0,
        allowableStress: 0
      }
    };
  }
};

export const calculatePanelResults = (project: Project) => {
  const mat = PANEL_MATERIALS[project.panelMaterialId];
  if (!mat) return null;
  const E = mat.e;
  const nu = mat.poisson;
  const t = (mat as any).totalThickness ?? project.thickness ?? 3.0;
  
  const activeCombination = project.combinations.find(c => c.id === project.activeCombinationId) || project.combinations[0];

  const q_wind_factored = project.loads
    .filter(l => l.category === 'wind')
    .reduce((sum, l) => sum + (safeParseNumber(l.value, 0) / 1000) * (activeCombination.factors.wind || 0), 0);

  const a_eff = project.length / (project.stiffenerCountH + 1);
  const b_eff = project.width / (project.stiffenerCountV + 1);
  
  const s_min = Math.min(a_eff, b_eff);
  const s_max = Math.max(a_eff, b_eff);
  const ratio = s_max / s_min;

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

  const stiffProps = calculateLPlateProperties(project.stiffenerWidth, project.stiffenerHeight, project.stiffenerThickness, project.stiffenerThickness);
  
  const stiffenerBeamPropsV = {
    length: project.length,
    elasticModulus: 70000,
    momentOfInertia: stiffProps.momentOfInertia,
    sectionModulus: stiffProps.sectionModulus,
    yieldStrength: 160,
    safetyFactor: project.safetyFactor,
    supportCondition: 'simply_supported' as any,
  };

  const tribWidthV = project.width / (project.stiffenerCountV + 1);
  const vStiffenerLoads = project.loads.map(l => ({
    ...l,
    value: safeParseNumber(l.value, 0) * (activeCombination.factors[l.category] || 0) * (l.type === 'udl' ? tribWidthV : 1),
    value2: l.value2 !== undefined ? safeParseNumber(l.value2, 0) * (activeCombination.factors[l.category] || 0) * (l.type === 'udl' ? tribWidthV : 1) : undefined,
  }));

  const stiffenerAnalysisV = project.stiffenerCountV > 0 
    ? calculateBeam(stiffenerBeamPropsV, vStiffenerLoads)
    : null;

  const tribWidthH = project.length / (project.stiffenerCountH + 1);
  const stiffenerBeamPropsH = {
    length: project.width,
    elasticModulus: 70000,
    momentOfInertia: stiffProps.momentOfInertia,
    sectionModulus: stiffProps.sectionModulus,
    yieldStrength: 160,
    safetyFactor: project.safetyFactor,
    supportCondition: 'simply_supported' as any,
  };

  const hStiffenerLoads = project.loads.map(l => ({
    ...l,
    value: safeParseNumber(l.value, 0) * (activeCombination.factors[l.category] || 0) * (l.type === 'udl' ? tribWidthH : 1),
    value2: l.value2 !== undefined ? safeParseNumber(l.value2, 0) * (activeCombination.factors[l.category] || 0) * (l.type === 'udl' ? tribWidthH : 1) : undefined,
  }));

  const stiffenerAnalysisH = project.stiffenerCountH > 0 
    ? calculateBeam(stiffenerBeamPropsH, hStiffenerLoads)
    : null;

  const vUtilStress = stiffenerAnalysisV ? stiffenerAnalysisV.summary.utilizationStress : 0;
  const hUtilStress = stiffenerAnalysisH ? stiffenerAnalysisH.summary.utilizationStress : 0;
  const vUtilDefl = stiffenerAnalysisV ? stiffenerAnalysisV.summary.utilizationDeflection : 0;
  const hUtilDefl = stiffenerAnalysisH ? stiffenerAnalysisH.summary.utilizationDeflection : 0;

  return {
    skin: {
      deflection: maxSkinDeflection,
      stress: maxSkinStress,
      allowableStress: mat.yield / project.safetyFactor,
      allowableDeflection: s_min / 60,
      utilizationStress: maxSkinStress / (mat.yield / project.safetyFactor),
      utilizationDeflection: maxSkinDeflection / (s_min / 60)
    },
    dimensions: { a: s_max, b: s_min },
    stiffenersV: stiffenerAnalysisV ? { ...stiffenerAnalysisV.summary, loadWidth: tribWidthV, count: project.stiffenerCountV } : null,
    stiffenersH: stiffenerAnalysisH ? { ...stiffenerAnalysisH.summary, loadWidth: tribWidthH, count: project.stiffenerCountH } : null,
    summary: {
       utilization: Math.max(
         maxSkinStress / (mat.yield / project.safetyFactor), 
         maxSkinDeflection / (s_min / 60), 
         vUtilStress, hUtilStress, vUtilDefl, hUtilDefl
       ),
       status: (
         maxSkinStress / (mat.yield / project.safetyFactor) <= 1 && 
         maxSkinDeflection / (s_min / 60) <= 1 && 
         (!stiffenerAnalysisV || stiffenerAnalysisV.summary.status === 'pass') &&
         (!stiffenerAnalysisH || stiffenerAnalysisH.summary.status === 'pass')
       ) ? 'pass' as const : 'fail' as const,
       weight: (mat.density * project.width * project.length * t * 1e-9)
    },
    totalWeight: (mat.density * project.width * project.length * t * 1e-9)
  };
};

export const calculateSealantResults = (project: Project) => {
  const mat = SEALANT_MATERIALS[project.sealantMaterialId];
  if (!mat) return null;
  const w = project.glassWidth;
  const h = project.glassHeight;
  const q_wind = project.windPressureInput;
  
  const biteDynamic = (q_wind * Math.min(w, h)) / (2 * mat.dynamicStress);
  const glassThicknessAssumed = 10;
  const weight = (w * h * glassThicknessAssumed * 2500 * 9.81 * 1e-9);
  const biteStatic = weight / ((2 * w + 2 * h) * mat.staticStress);

  const requiredBite = Math.max(0, biteDynamic, biteStatic, 6);
  
  return {
    biteDynamic,
    biteStatic,
    requiredBite,
    utilization: requiredBite / Math.max(1, project.width),
    status: requiredBite <= project.width ? 'pass' : 'fail'
  };
};

export const calculateBracketResults = (project: Project) => {
  const mat = MATERIALS[project.material];
  if (!mat) return null;
  const fy = mat.yield;
  const q_wind = project.windPressureInput;
  const totalForce = q_wind * project.tributaryArea * 1000;
  
  const boltArea = Math.PI * Math.pow(project.boltDiameter / 2, 2);
  const boltShearStress = totalForce / (project.boltCount * boltArea);
  const boltUtilization = boltShearStress / (420 / 2);
  
  const bearingStress = totalForce / (project.boltCount * project.boltDiameter * project.bracketThickness);
  const bearingUtilization = bearingStress / (fy / project.safetyFactor);
  
  const eccentricity = 50; 
  const moment = totalForce * eccentricity;
  const Z = (project.bracketWidth * Math.pow(project.bracketThickness, 2)) / 6;
  const bendingStress = moment / Z;
  const bendingUtilization = bendingStress / (fy / project.safetyFactor);

  const maxUtil = Math.max(boltUtilization, bearingUtilization, bendingUtilization);

  return {
    boltShearStress,
    bearingStress,
    bendingStress,
    boltUtilization,
    bearingUtilization,
    bendingUtilization,
    maxUtilization: maxUtil,
    status: maxUtil <= 1.0 ? 'pass' : 'fail'
  };
};

export const calculateCastInEmbedResults = (project: Project) => {
  const q_wind = project.windPressureInput ?? 1.5; 
  const q_dead = project.deadLoadInput ?? 0.5;
  const tribArea = project.tributaryArea ?? 4.5;
  const tensionLoad = q_wind * tribArea * 1000; 
  const shearLoad = q_dead * tribArea * 1000;

  return calculateCastInEmbed({
    embedDepth: project.embedDepth ?? 120,
    edgeDistance: project.edgeDistance ?? 150,
    concreteGrade: project.concreteGrade ?? 30,
    boltDiameter: project.boltDiameter ?? 12,
    boltCount: project.boltCount ?? 2,
    tensionLoad,
    shearLoad,
    safetyFactor: project.safetyFactor
  });
};

export const createNewProject = (id: string, title: string = 'New Project'): Project => ({
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
  sealantMaterialId: 'silicone_structural',
  bracketTypeId: 'combined',
  sectionType: 'hollow',
  beamType: 'mullion',
  width: 65,
  height: 150,
  thickness: 3.5,
  thickness2: 3.5,
  supportCondition: 'simply_supported',
  intermediateSupports: [],
  safetyFactor: 1.5,
  stiffenerCountV: 0,
  stiffenerCountH: 0,
  stiffenerWidth: 40,
  stiffenerHeight: 40,
  stiffenerThickness: 2,
  // Sealant defaults
  glassWidth: 1500,
  glassHeight: 3000,
  windPressureInput: 1.5,
  deadLoadInput: 0.5,
  // Bracket defaults
  tributaryArea: 4.5,
  bracketWidth: 100,
  bracketHeight: 150,
  bracketThickness: 10,
  boltDiameter: 12,
  boltCount: 2,
  embedDepth: 120,
  edgeDistance: 150,
  concreteGrade: 30,
  selectedCodeId: 'Shanghai',
  loads: [{ id: '1', type: 'udl', category: 'dead', value: 0.5 }],
  combinations: DEFAULT_COMBINATIONS,
  activeCombinationId: 'c1',
  seismicRegion: 'china',
  seismicCoeff: SEISMIC_REGIONS.china.coeff,
  unitSystem: 'metric',
  projectNotes: 'Initial structural calculation for project.'
});

export const getCriticalPoints = (results: any, unitSystem: string, u: any, toDisplay: any) => {
  if (!results || !results.points || results.points.length === 0) return null;
  
  const initialPoint = results.points[0];
  if (!initialPoint) return null;

  const maxDeflectionPoint = results.points.reduce((max: any, p: any) => Math.abs(p.deflection) > Math.abs(max.deflection) ? p : max, initialPoint);
  const maxMomentPoint = results.points.reduce((max: any, p: any) => Math.abs(p.moment) > Math.abs(max.moment) ? p : max, initialPoint);
  const maxShearPoint = results.points.reduce((max: any, p: any) => Math.abs(p.shear) > Math.abs(max.shear) ? p : max, initialPoint);
  const maxStressPoint = results.points.reduce((max: any, p: any) => (p.stress || 0) > (max.stress || 0) ? p : max, initialPoint);

  return {
    deflection: [{ 
      x: Number(toDisplay(maxDeflectionPoint.x, 'length').toFixed(2)), 
      y: Number(toDisplay(maxDeflectionPoint.deflection, 'length').toFixed(3)), 
      label: `Δ_max: ${toDisplay(maxDeflectionPoint.deflection, 'length').toFixed(2)} ${u.length}` 
    }],
    moment: [{ 
      x: Number(toDisplay(maxMomentPoint.x, 'length').toFixed(2)), 
      y: Number(toDisplay(maxMomentPoint.moment, 'moment').toFixed(2)), 
      label: `M_max: ${unitSystem === 'metric' ? (maxMomentPoint.moment / 1000000).toFixed(2) + ' kNm' : (toDisplay(maxMomentPoint.moment, 'moment') / 12).toFixed(1) + ' lb-ft'}` 
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
