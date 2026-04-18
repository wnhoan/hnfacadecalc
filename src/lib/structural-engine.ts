/**
 * Structural Engineering Engine for Beam Calculations
 * Supports Simply Supported Beams with UDL and Point Loads
 */

export interface BeamProperties {
  length: number; // mm
  elasticModulus: number; // N/mm2 (MPa)
  momentOfInertia: number; // mm4
  yieldStrength: number; // MPa
  sectionModulus: number; // mm3
  safetyFactor: number;
  supportCondition?: 'simply_supported' | 'cantilever' | 'propped_cantilever' | 'fixed_fixed' | 'fixed_pinned' | 'continuous';
  beamType?: 'mullion' | 'transom';
  intermediateSupports?: number[]; // positions of pinned supports
}

export interface Load {
  id: string;
  type: 'udl' | 'point' | 'trapezoidal';
  category: 'dead' | 'live' | 'wind' | 'snow' | 'seismic';
  value: number; // N/mm for UDL, N for point, w1 for trapezoidal
  value2?: number; // w2 for trapezoidal
  position?: number; // mm from left support (for point load)
  start?: number; // mm from left support (for trapezoidal)
  end?: number; // mm from left support (for trapezoidal)
  factoredValue?: number; // UI only
  factoredValue2?: number; // UI only
}

export interface CalculationResult {
  x: number;
  deflection: number;
  moment: number;
  shear: number;
  stress: number;
  utilizationStress: number;
  utilizationDeflection: number;
}

export interface SummaryResults {
  maxDeflection: number;
  maxMoment: number;
  maxShear: number;
  maxStress: number;
  deflectionRatio: string; // e.g. L/200
  status: 'pass' | 'fail';
}

export function calculateBeam(
  props: BeamProperties,
  loads: Load[],
  steps: number = 200
): { points: CalculationResult[]; summary: SummaryResults } {
  const { length, elasticModulus, momentOfInertia, sectionModulus, yieldStrength, supportCondition = 'simply_supported' } = props;
  
  // Robustness check: avoid division by zero
  if (length <= 0 || momentOfInertia <= 0 || elasticModulus <= 0) {
    return {
      points: Array.from({ length: steps + 1 }, (_, i) => ({
        x: (length * i) / steps,
        deflection: 0,
        moment: 0,
        shear: 0,
        stress: 0,
        utilizationStress: 0,
        utilizationDeflection: 0
      })),
      summary: {
        maxDeflection: 0,
        maxMoment: 0,
        maxShear: 0,
        maxStress: 0,
        deflectionRatio: 'N/A',
        status: 'fail'
      }
    };
  }

  const EI = elasticModulus * momentOfInertia;
  const dx = length / steps;
  const points: CalculationResult[] = [];

  // Function to calculate internal forces given reactions at x=0
  const getInternalForces = (R0: number, M0: number) => {
    const results: { x: number; moment: number; shear: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const x = (length * i) / steps;
      let moment = M0 + R0 * x;
      let shear = R0;

      loads.forEach((load) => {
        if (load.type === 'udl') {
          if (x > 0) {
            shear -= load.value * x;
            moment -= (load.value * x * x) / 2;
          }
        } else if (load.type === 'point') {
          const a = load.position ?? length / 2;
          if (x > a) {
            shear -= load.value;
            moment -= load.value * (x - a);
          }
        } else if (load.type === 'trapezoidal') {
          const w1 = load.value;
          const w2 = load.value2 ?? load.value;
          const x1 = load.start ?? 0;
          const x2 = load.end ?? length;
          const L_total = x2 - x1;
          
          if (x > x1 && L_total > 0) {
            const curr_x = Math.min(x, x2);
            const L_seg = curr_x - x1;
            const w_at_x = w1 + (w2 - w1) * (L_seg / L_total);
            const W_seg = 0.5 * (w1 + w_at_x) * L_seg;
            const x_c_seg_rel = (w1 + w_at_x) !== 0
              ? (L_seg / 3) * ((w1 + 2 * w_at_x) / (w1 + w_at_x))
              : L_seg / 2;
            
            shear -= W_seg;
            moment -= W_seg * (x - (x1 + x_c_seg_rel));
          }
        }
      });
      results.push({ x, moment, shear });
    }
    return results;
  };

  // Function to calculate deflection given internal forces and initial slope/deflection
  const getDeflection = (internalForces: { x: number; moment: number }[], v0: number, theta0: number) => {
    let slope = theta0;
    let deflection = v0;
    const deflections: number[] = [v0];

    for (let i = 0; i < steps; i++) {
      const M_avg = (internalForces[i].moment + internalForces[i+1].moment) / 2;
      slope += (-M_avg / EI) * dx;
      deflection += slope * dx;
      deflections.push(deflection);
    }
    return deflections;
  };

  let R0 = 0;
  let M0 = 0;
  let v0 = 0;
  let theta0 = 0;

  // Linear system solver (Gaussian elimination)
  const solveLinearSystem = (A: number[][], b: number[]) => {
    const n = b.length;
    for (let i = 0; i < n; i++) {
      let max = i;
      for (let j = i + 1; j < n; j++) if (Math.abs(A[j][i]) > Math.abs(A[max][i])) max = j;
      [A[i], A[max]] = [A[max], A[i]];
      [b[i], b[max]] = [b[max], b[i]];
      for (let j = i + 1; j < n; j++) {
        const factor = A[j][i] / A[i][i];
        b[j] -= factor * b[i];
        for (let k = i; k < n; k++) A[j][k] -= factor * A[i][k];
      }
    }
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) sum += A[i][j] * x[j];
      x[i] = (b[i] - sum) / A[i][i];
    }
    return x;
  };

  const getBoundaryErrors = (R0_test: number, M0_test: number, theta0_test: number) => {
    const forces = getInternalForces(R0_test, M0_test);
    const defls = getDeflection(forces, 0, theta0_test);
    let finalSlope = theta0_test;
    for (let i = 0; i < steps; i++) {
      finalSlope += (-(forces[i].moment + forces[i + 1].moment) / (2 * EI)) * dx;
    }
    return { forces, defls, finalSlope };
  };

  // Define support points and constraints
  const supportPoints: { x: number, type: 'pinned' | 'fixed' }[] = [];
  if (supportCondition === 'simply_supported') {
    supportPoints.push({ x: 0, type: 'pinned' }, { x: length, type: 'pinned' });
  } else if (supportCondition === 'cantilever') {
    supportPoints.push({ x: 0, type: 'fixed' });
  } else if (supportCondition === 'fixed_fixed') {
    supportPoints.push({ x: 0, type: 'fixed' }, { x: length, type: 'fixed' });
  } else if (supportCondition === 'fixed_pinned' || supportCondition === 'propped_cantilever') {
    supportPoints.push({ x: 0, type: 'fixed' }, { x: length, type: 'pinned' });
  } else if (supportCondition === 'continuous') {
    supportPoints.push({ x: 0, type: 'pinned' }, { x: length, type: 'pinned' });
    (props.intermediateSupports || []).forEach(pos => {
      if (pos > 0 && pos < length) supportPoints.push({ x: pos, type: 'pinned' });
    });
  }

  // General approach: Unknowns R0, M0, theta0. Compatibility v(x_i) = 0, theta(x_i) = 0.
  // v(x) = v_base(x, R0=0, M0=0, v0=0, theta0=0) + R0*f1(x) + M0*f2(x) + theta0*x
  // We have 3 primary unknowns (R0, M0, theta0). v0 is always 0 for all our cases (start is supported).
  
  const getCompatibilityAt = (R: number, M: number, T: number) => {
    const { defls, finalSlope, forces } = getBoundaryErrors(R, M, T);
    const errors: number[] = [];
    supportPoints.forEach(sp => {
      const idx = Math.round((sp.x / length) * steps);
      errors.push(defls[idx]);
      if (sp.type === 'fixed') {
        // Find slope at x
        let slope = T;
        for (let i = 0; i < idx; i++) {
          slope += (-(forces[i].moment + forces[i + 1].moment) / (2 * EI)) * dx;
        }
        errors.push(slope);
      }
    });

    // Also need to satisfy boundary conditions at L if they are not at 0
    const endSupport = supportPoints.find(sp => Math.abs(sp.x - length) < 1e-3);
    if (!endSupport) {
      // It's a cantilever free end? Actually cantilever is fixed at 0.
      // If it's cantilever, only fixed at 0 is in supportPoints.
    }
    
    return errors;
  };

  const b_vec = getCompatibilityAt(0, 0, 0).map(v => -v);
  const n = b_vec.length;
  
  // We need to match number of unknowns to number of compatibility constraints.
  // Actually, for statically indeterminate beams, we have R0, M0, theta0.
  // We can solve this as a $n \times n$ system if $n=3$, or similar.
  // Wait, if $n < 3$, some of R0, M0 might be 0.
  
  if (n === 1) {
    // Single constraint (pinned at 0, free everywhere else? unusual)
    // For cantilever, n=2 (v0=0, theta0=0). But v0 is fixed 0.
    // Let's refine.
  }

  // Fallback to original logic if system is complex, but let's try to improve.
  // Simply supported: 2 supports (x=0, x=L). Compatibility v(L)=0. 1 unknown theta0. M0=0.
  // Global equilibrium for simply supported: R0 is solved statically.
  
  if (supportCondition === 'simply_supported') {
    let totalLoad = 0;
    let totalMomentAbout0 = 0;
    loads.forEach(l => {
      if (l.type === 'udl') { totalLoad += l.value * length; totalMomentAbout0 += l.value * length * (length / 2); }
      else if (l.type === 'point') { totalLoad += l.value; totalMomentAbout0 += l.value * (l.position ?? length / 2); }
      else if (l.type === 'trapezoidal') {
        const L_load = Math.max(0, (l.end ?? length) - (l.start ?? 0));
        const W = 0.5 * (l.value + (l.value2 ?? l.value)) * L_load;
        const x_c_rel = (l.value + (l.value2 ?? l.value)) !== 0 ? (L_load / 3) * ((l.value + 2 * (l.value2 ?? l.value)) / (l.value + (l.value2 ?? l.value))) : L_load / 2;
        totalLoad += W; totalMomentAbout0 += W * ((l.start ?? 0) + x_c_rel);
      }
    });
    const R_L = totalMomentAbout0 / length;
    R0 = totalLoad - R_L;
    M0 = 0;
    const v_base = getDeflection(getInternalForces(R0, M0), 0, 0);
    theta0 = -v_base[steps] / length;
  } else if (supportCondition === 'cantilever') {
    let sumP = 0, sumPa = 0;
    loads.forEach(l => {
      if (l.type === 'udl') { sumP += l.value * length; sumPa += l.value * length * (length / 2); }
      else if (l.type === 'point') { sumP += l.value; sumPa += l.value * (l.position ?? length / 2); }
      else if (l.type === 'trapezoidal') {
        const L_load = Math.max(0, (l.end ?? length) - (l.start ?? 0));
        const W = 0.5 * (l.value + (l.value2 ?? l.value)) * L_load;
        const x_c_rel = (l.value + (l.value2 ?? l.value)) !== 0 ? (L_load / 3) * ((l.value + 2 * (l.value2 ?? l.value)) / (l.value + (l.value2 ?? l.value))) : L_load / 2;
        sumP += W; sumPa += W * ((l.start ?? 0) + x_c_rel);
      }
    });
    R0 = sumP; M0 = -sumPa; theta0 = 0; v0 = 0;
  } else {
    // General indeterminate case using influence coefficients
    // Unknowns: reactions at secondary supports, M0, R0, theta0.
    // For propped cantilever: Fixed at 0, Pinned at L.
    // DOF: theta0=0, v0=0 (fixed at 0). Reaction R0, M0 at 0. Redundant RL at L.
    
    // For simplicity, let's just implement the requested cases squarely using compatibility.
    if (supportCondition === 'fixed_fixed') {
      let sumP = 0, sumPa = 0;
      loads.forEach(l => {
        if (l.type === 'udl') { sumP += l.value * length; sumPa += l.value * length * (length / 2); }
        else if (l.type === 'point') { sumP += l.value; sumPa += l.value * (l.position ?? length / 2); }
        else if (l.type === 'trapezoidal') {
          const L_load = Math.max(0, (l.end ?? length) - (l.start ?? 0));
          const W = 0.5 * (l.value + (l.value2 ?? l.value)) * L_load;
          const x_c_rel = (l.value + (l.value2 ?? l.value)) !== 0 ? (L_load / 3) * ((l.value + 2 * (l.value2 ?? l.value)) / (l.value + (l.value2 ?? l.value))) : L_load / 2;
          sumP += W; sumPa += W * ((l.start ?? 0) + x_c_rel);
        }
      });
      const errors = getBoundaryErrors(0, 0, 0);
      const A = [[length*length/2/EI, length/EI], [length*length*length/6/EI, length*length/2/EI]];
      const b = [-errors.finalSlope, -errors.defls[steps]];
      const reactions = solveLinearSystem(A, b); // [R_L, M_L]
      const R_L = reactions[0], M_L = reactions[1];
      R0 = sumP - R_L;
      M0 = sumPa - R_L * length - M_L;
      theta0 = 0;
    } else if (supportCondition === 'fixed_pinned' || supportCondition === 'propped_cantilever') {
      // Fixed at 0, Pinned at L
      let sumP = 0, sumPa = 0;
      loads.forEach(l => {
        if (l.type === 'udl') { sumP += l.value * length; sumPa += l.value * length * (length / 2); }
        else if (l.type === 'point') { sumP += l.value; sumPa += l.value * (l.position ?? length / 2); }
        else if (l.type === 'trapezoidal') {
          const L_load = Math.max(0, (l.end ?? length) - (l.start ?? 0));
          const W = 0.5 * (l.value + (l.value2 ?? l.value)) * L_load;
          const x_c_rel = (l.value + (l.value2 ?? l.value)) !== 0 ? (L_load / 3) * ((l.value + 2 * (l.value2 ?? l.value)) / (l.value + (l.value2 ?? l.value))) : L_load / 2;
          sumP += W; sumPa += W * ((l.start ?? 0) + x_c_rel);
        }
      });
      const errors = getBoundaryErrors(0, 0, 0);
      const RL = errors.defls[steps] / (length * length * length / (3 * EI));
      R0 = sumP - RL;
      M0 = sumPa - RL * length;
      theta0 = 0;
    } else if (supportCondition === 'continuous') {
      // Multi-span case. Pinned at 0, L, and mid points.
      // Unknowns: theta0, and reactions R_i at intermediate and end supports.
      // System size: 1 (theta0) + intermediate_supports.length + 1 (RL).
      const secondarySupports = (props.intermediateSupports || []).filter(x => x > 0 && x < length).concat([length]);
      const nUnk = secondarySupports.length + 1; // +1 for theta0
      
      const sumP = loads.reduce((s, l) => {
         if (l.type === 'udl') return s + l.value * length;
         if (l.type === 'point') return s + l.value;
         if (l.type === 'trapezoidal') return s + 0.5 * (l.value + (l.value2 ?? l.value)) * Math.max(0, (l.end ?? length) - (l.start ?? 0));
         return s;
      }, 0);

      // We need to find theta0 and reactions R_i at x_i such that v(x_i) = 0.
      // For pinned at 0, we can solve R0 from global moment equilibrium about L? No, let's use influence matrix.
      // v(x) = v_loads(x, R0 solved statically for simply supported beam [0, L]) + sum Ri_actual * v_unit_i(x) + theta0_actual * x
      
      // Easier: Static R0 from simple span [0, L]
      // v_total(x) = v_simple(x) + sum( R_internal_i * f_i(x) )
      // where f_i(x) is deflection at x due to unit load at x_i on simply supported beam [0,L].
      const intSupports = (props.intermediateSupports || []).filter(x => x > 0 && x < length);
      if (intSupports.length === 0) {
        // Fallback to simply supported
        return calculateBeam({ ...props, supportCondition: 'simply_supported' }, loads, steps);
      }
      
      const getDeflectionSimple = (x_load: number, x_query: number) => {
        const a = Math.min(x_load, length - x_load); // dist to closer support
        const L = length;
        const b = L - x_load;
        const P = 1;
        if (x_query <= x_load) return (P * b * x_query / (6 * L * EI)) * (L * L - b * b - x_query * x_query);
        else return (P * x_load * (L - x_query) / (6 * L * EI)) * (2 * L * x_query - x_query * x_query - x_load * x_load);
      };

      const resSimple = calculateBeam({ ...props, supportCondition: 'simply_supported' }, loads, steps);
      const A_mat = intSupports.map(xi => intSupports.map(xj => getDeflectionSimple(xj, xi)));
      const b_col = intSupports.map(xi => {
        const idx = Math.round((xi / length) * steps);
        return -resSimple.points[idx].deflection;
      });
      
      const R_internals = solveLinearSystem(A_mat, b_col);
      
      // Final results
      const finalRes = resSimple;
      for (let i = 0; i <= steps; i++) {
        const x = (length * i) / steps;
        let dR = 0, dM = 0, dV = 0;
        R_internals.forEach((Ri, j) => {
          const xi = intSupports[j];
          dR += Ri * getDeflectionSimple(xi, x);
          // Moment and Shear from unit load at xi on simple beam
          // R0_unit = (L-xi)/L, RL_unit = xi/L
          const R0_unit = (length - xi) / length;
          if (x <= xi) {
            dM += Ri * (R0_unit * x);
            dV += Ri * R0_unit;
          } else {
            dM += Ri * (R0_unit * x - 1 * (x - xi));
            dV += Ri * (R0_unit - 1);
          }
        });
        finalRes.points[i].deflection += dR;
        finalRes.points[i].moment += dM;
        finalRes.points[i].shear += dV;
        finalRes.points[i].stress = sectionModulus > 0 ? Math.abs(finalRes.points[i].moment) / sectionModulus : 0;
      }
      
      // Recalculate summary
      const maxDef = Math.max(...finalRes.points.map(p => Math.abs(p.deflection)));
      const maxMom = Math.max(...finalRes.points.map(p => Math.abs(p.moment)));
      const maxShe = Math.max(...finalRes.points.map(p => Math.abs(p.shear)));
      const maxStr = Math.max(...finalRes.points.map(p => p.stress));
      finalRes.summary.maxDeflection = maxDef;
      finalRes.summary.maxMoment = maxMom;
      finalRes.summary.maxShear = maxShe;
      finalRes.summary.maxStress = maxStr;
      finalRes.summary.deflectionRatio = maxDef > 0.0001 ? `L/${Math.round(length/maxDef)}` : 'N/A';
      const allowableStress = yieldStrength / Math.max(0.1, props.safetyFactor);
      const deflectionLimitRatio = props.beamType === 'transom' ? 240 : 175;
      finalRes.summary.status = (maxStr <= allowableStress && (length/maxDef) >= deflectionLimitRatio) ? 'pass' : 'fail';
      
      return finalRes;
    }
  }

  const finalForces = getInternalForces(R0, M0);
  const finalDeflections = getDeflection(finalForces, v0, theta0);

  const allowableStress = yieldStrength / Math.max(0.1, props.safetyFactor);
  const deflectionLimitRatio = props.beamType === 'transom' ? 240 : 175;
  const deflectionLimit = length / deflectionLimitRatio;

  for (let i = 0; i <= steps; i++) {
    const x = finalForces[i].x;
    const stress = sectionModulus > 0 ? Math.abs(finalForces[i].moment) / sectionModulus : 0;

    points.push({
      x,
      deflection: finalDeflections[i],
      moment: finalForces[i].moment,
      shear: finalForces[i].shear,
      stress,
      utilizationStress: allowableStress > 0 ? stress / allowableStress : 0,
      utilizationDeflection: deflectionLimit > 0 ? Math.abs(finalDeflections[i]) / deflectionLimit : 0,
    });
  }

  const maxDeflection = Math.max(...points.map((p) => Math.abs(p.deflection)));
  const maxMoment = Math.max(...points.map((p) => Math.abs(p.moment)));
  const maxShear = Math.max(...points.map((p) => Math.abs(p.shear)));
  const maxStress = Math.max(...points.map((p) => p.stress));

  const deflectionRatioValue = maxDeflection > 0.0001 ? length / maxDeflection : Infinity;
  const deflectionRatio = deflectionRatioValue < 100000 ? `L/${Math.round(deflectionRatioValue)}` : 'N/A';

  const status = maxStress <= allowableStress && deflectionRatioValue >= deflectionLimitRatio ? 'pass' : 'fail';

  return {
    points,
    summary: {
      maxDeflection,
      maxMoment,
      maxShear,
      maxStress,
      deflectionRatio,
      status,
    },
  };
}

export function calculateRectangularProperties(width: number, height: number) {
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  const area = w * h;
  const momentOfInertia = (w * Math.pow(h, 3)) / 12;
  const sectionModulus = h > 0 ? momentOfInertia / (h / 2) : 0;
  return { area, momentOfInertia, sectionModulus };
}

export function calculateHollowRectangularProperties(width: number, height: number, thicknessX: number, thicknessY: number) {
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  const tx = Math.max(0, thicknessX);
  const ty = Math.max(0, thicknessY);
  
  const innerWidth = w - 2 * tx;
  const innerHeight = h - 2 * ty;
  
  if (innerWidth <= 0 || innerHeight <= 0 || tx <= 0 || ty <= 0) {
    return calculateRectangularProperties(w, h);
  }

  const area = (w * h) - (innerWidth * innerHeight);
  const momentOfInertia = ((w * Math.pow(h, 3)) - (innerWidth * Math.pow(innerHeight, 3))) / 12;
  const sectionModulus = h > 0 ? momentOfInertia / (h / 2) : 0;
  return { area, momentOfInertia, sectionModulus };
}

export function calculateChannelProperties(width: number, height: number, thicknessWeb: number, thicknessFlange: number) {
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  const tw = Math.max(0, thicknessWeb); // Thickness of the vertical web
  const tf = Math.max(0, thicknessFlange); // Thickness of the horizontal flanges

  if (tw <= 0 || tf <= 0 || w <= tw || h <= 2 * tf) {
    return calculateRectangularProperties(w, h);
  }

  // Channel area: 2 flanges + 1 web
  // Area = 2 * (w * tf) + (h - 2tf) * tw
  const area = 2 * w * tf + (h - 2 * tf) * tw;

  // Moment of Inertia (Ix) - assuming bending about major axis (horizontal)
  // I = (w * h^3)/12 - ((w - tw) * (h - 2tf)^3)/12
  const momentOfInertia = (w * Math.pow(h, 3)) / 12 - ((w - tw) * Math.pow(h - 2 * tf, 3)) / 12;
  const sectionModulus = h > 0 ? momentOfInertia / (h / 2) : 0;

  return { area, momentOfInertia, sectionModulus };
}

export function calculateLPlateProperties(width: number, height: number, thicknessHorizontal: number, thicknessVertical: number) {
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  const th = Math.max(0, thicknessHorizontal); // Thickness of the horizontal leg
  const tv = Math.max(0, thicknessVertical);   // Thickness of the vertical leg

  if (th <= 0 || tv <= 0 || w <= tv || h <= th) {
    // Fallback if thicknesses are too large or zero
    return calculateRectangularProperties(w, h);
  }

  // L-plate area: horizontal leg + vertical leg
  // Area = w*th + (h-th)*tv
  const area = w * th + (h - th) * tv;

  // Centroid y_c from bottom (base of horizontal leg)
  // A1 (horizontal): w * th, y1 = th / 2
  // A2 (vertical): tv * (h-th), y2 = th + (h-th) / 2 = (h + th) / 2
  const a1 = w * th;
  const y1 = th / 2;
  const a2 = (h - th) * tv;
  const y2 = (h + th) / 2;
  const yc = (a1 * y1 + a2 * y2) / area;

  // Moment of Inertia (Ix) about centroid
  // I1 = w*th^3/12 + a1*(yc-y1)^2
  // I2 = tv*(h-th)^3/12 + a2*(yc-y2)^2
  const i1 = (w * Math.pow(th, 3)) / 12 + a1 * Math.pow(yc - y1, 2);
  const i2 = (tv * Math.pow(h - th, 3)) / 12 + a2 * Math.pow(yc - y2, 2);
  const momentOfInertia = i1 + i2;

  // Section Modulus (Wx)
  const y_max = Math.max(yc, h - yc);
  const sectionModulus = y_max > 0 ? momentOfInertia / y_max : 0;

  return { area, momentOfInertia, sectionModulus };
}
