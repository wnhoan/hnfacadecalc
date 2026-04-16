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
  supportCondition?: 'simply_supported' | 'cantilever' | 'fixed_fixed' | 'fixed_pinned';
  beamType?: 'mullion' | 'transom';
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

  // Solve for reactions based on support conditions
  if (supportCondition === 'simply_supported') {
    // Reactions at x=0: R0. M0 = 0.
    // Boundary conditions: v(0) = 0, v(L) = 0.
    // We need to find R0 such that M(L) = 0 (pinned at L).
    // Actually, for simply supported, R0 is statically determinate.
    let totalLoad = 0;
    let totalMomentAbout0 = 0;
    loads.forEach(l => {
      if (l.type === 'udl') {
        const W = l.value * length;
        totalLoad += W;
        totalMomentAbout0 += W * (length / 2);
      } else if (l.type === 'point') {
        totalLoad += l.value;
        totalMomentAbout0 += l.value * (l.position ?? length / 2);
      } else if (l.type === 'trapezoidal') {
        const L_load = Math.max(0, (l.end ?? length) - (l.start ?? 0));
        const W = 0.5 * (l.value + (l.value2 ?? l.value)) * L_load;
        const x_c_rel = (l.value + (l.value2 ?? l.value)) !== 0 
          ? (L_load / 3) * ((l.value + 2 * (l.value2 ?? l.value)) / (l.value + (l.value2 ?? l.value)))
          : L_load / 2;
        totalLoad += W;
        totalMomentAbout0 += W * ((l.start ?? 0) + x_c_rel);
      }
    });
    const R_L = totalMomentAbout0 / length;
    R0 = totalLoad - R_L;
    M0 = 0;
    v0 = 0;
    // Find theta0 such that v(L) = 0
    const forces = getInternalForces(R0, M0);
    const v_base = getDeflection(forces, 0, 0);
    theta0 = -v_base[steps] / length;
  } else if (supportCondition === 'cantilever') {
    // Fixed at x=0. Free at x=L.
    // Reactions at x=0: R0, M0.
    // Boundary conditions: v(0) = 0, v'(0) = 0.
    // R0 and M0 are statically determinate.
    let totalLoad = 0;
    let totalMomentAbout0 = 0;
    loads.forEach(l => {
      if (l.type === 'udl') {
        const W = l.value * length;
        totalLoad += W;
        totalMomentAbout0 += W * (length / 2);
      } else if (l.type === 'point') {
        totalLoad += l.value;
        totalMomentAbout0 += l.value * (l.position ?? length / 2);
      } else if (l.type === 'trapezoidal') {
        const L_load = Math.max(0, (l.end ?? length) - (l.start ?? 0));
        const W = 0.5 * (l.value + (l.value2 ?? l.value)) * L_load;
        const x_c_rel = (l.value + (l.value2 ?? l.value)) !== 0 
          ? (L_load / 3) * ((l.value + 2 * (l.value2 ?? l.value)) / (l.value + (l.value2 ?? l.value)))
          : L_load / 2;
        totalLoad += W;
        totalMomentAbout0 += W * ((l.start ?? 0) + x_c_rel);
      }
    });
    R0 = totalLoad;
    M0 = -totalMomentAbout0;
    v0 = 0;
    theta0 = 0;
  } else if (supportCondition === 'fixed_pinned') {
    // Fixed at x=0, Pinned at x=L.
    // v(0)=0, v'(0)=0, v(L)=0.
    // Unknowns: R0, M0.
    // We can use superposition or solve for redundant R_L.
    // Let's solve for R_L such that v(L) = 0.
    // M(x) = M_cantilever(x) + R_L * (L - x)
    // Wait, let's use the R0, M0 approach.
    // M1 + R2*L = Sum(P * (L - a)) => M0 + R_L*L = Sum(P*a)
    // R0 + R_L = Sum(P)
    // M0 = Sum(P*a) - R_L*L
    // R0 = Sum(P) - R_L
    
    let sumP = 0;
    let sumPa = 0;
    loads.forEach(l => {
      let P = 0, a = 0;
      if (l.type === 'udl') { P = l.value * length; a = length / 2; }
      else if (l.type === 'point') { P = l.value; a = l.position ?? length / 2; }
      else if (l.type === 'trapezoidal') {
        const L_load = Math.max(0, (l.end ?? length) - (l.start ?? 0));
        P = 0.5 * (l.value + (l.value2 ?? l.value)) * L_load;
        const x_c_rel = (l.value + (l.value2 ?? l.value)) !== 0 
          ? (L_load / 3) * ((l.value + 2 * (l.value2 ?? l.value)) / (l.value + (l.value2 ?? l.value)))
          : L_load / 2;
        a = (l.start ?? 0) + x_c_rel;
      }
      sumP += P;
      sumPa += P * a;
    });

    // Solve for R_L such that v(L) = 0
    // v(L) is linear in R_L. Let's use two points.
    const getVL = (RL_test: number) => {
      const R0_test = sumP - RL_test;
      const M0_test = sumPa - RL_test * length;
      const forces = getInternalForces(R0_test, M0_test);
      const defls = getDeflection(forces, 0, 0);
      return defls[steps];
    };

    const v1 = getVL(0);
    const v2 = getVL(sumP);
    
    if (Math.abs(v1 - v2) > 1e-20) {
      const RL = (v1 / (v1 - v2)) * sumP;
      R0 = sumP - RL;
      M0 = sumPa - RL * length;
    } else {
      // Fallback to simply supported if solver fails
      const R_L = sumPa / length;
      R0 = sumP - R_L;
      M0 = 0;
    }
    v0 = 0;
    theta0 = 0;
  } else if (supportCondition === 'fixed_fixed') {
    // Fixed at x=0, Fixed at x=L.
    // v(0)=0, v'(0)=0, v(L)=0, v'(L)=0.
    // Unknowns: R0, M0.
    let sumP = 0;
    let sumPa = 0;
    loads.forEach(l => {
      let P = 0, a = 0;
      if (l.type === 'udl') { P = l.value * length; a = length / 2; }
      else if (l.type === 'point') { P = l.value; a = l.position ?? length / 2; }
      else if (l.type === 'trapezoidal') {
        const L_load = Math.max(0, (l.end ?? length) - (l.start ?? 0));
        P = 0.5 * (l.value + (l.value2 ?? l.value)) * L_load;
        const x_c_rel = (l.value + (l.value2 ?? l.value)) !== 0 
          ? (L_load / 3) * ((l.value + 2 * (l.value2 ?? l.value)) / (l.value + (l.value2 ?? l.value)))
          : L_load / 2;
        a = (l.start ?? 0) + x_c_rel;
      }
      sumP += P;
      sumPa += P * a;
    });

    // We need to find R0 and M0 such that v(L)=0 and v'(L)=0.
    // This is a 2x2 system.
    // v(L) = v_base(L) + R0 * f1 + M0 * f2
    // v'(L) = v'_base(L) + R0 * g1 + M0 * g2
    // But we can just use the numerical engine to find the influence coefficients.
    
    const getBoundaryErrors = (R0_test: number, M0_test: number) => {
      const forces = getInternalForces(R0_test, M0_test);
      const defls = getDeflection(forces, 0, 0);
      // v'(L) = integral(-M/EI)
      let finalSlope = 0;
      for (let i = 0; i < steps; i++) {
        finalSlope += (-(forces[i].moment + forces[i+1].moment) / (2 * EI)) * dx;
      }
      return { vL: defls[steps], thetaL: finalSlope };
    };

    // Solve system:
    // f(R0, M0) = vL = 0
    // g(R0, M0) = thetaL = 0
    const base = getBoundaryErrors(0, 0);
    const dR = getBoundaryErrors(1000, 0);
    const dM = getBoundaryErrors(0, 1000000);

    const dvL_dR = (dR.vL - base.vL) / 1000;
    const dvL_dM = (dM.vL - base.vL) / 1000000;
    const dthetaL_dR = (dR.thetaL - base.thetaL) / 1000;
    const dthetaL_dM = (dM.thetaL - base.thetaL) / 1000000;

    // Matrix:
    // [ dvL_dR  dvL_dM ] [ R0 ] = [ -base.vL ]
    // [ dthetaL_dR dthetaL_dM ] [ M0 ] = [ -base.thetaL ]
    const det = dvL_dR * dthetaL_dM - dvL_dM * dthetaL_dR;
    if (Math.abs(det) > 1e-20) {
      R0 = ((-base.vL) * dthetaL_dM - (dvL_dM) * (-base.thetaL)) / det;
      M0 = (dvL_dR * (-base.thetaL) - (-base.vL) * dthetaL_dR) / det;
    }
    v0 = 0;
    theta0 = 0;
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

export function calculateHollowRectangularProperties(width: number, height: number, thickness: number) {
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  const t = Math.max(0, thickness);
  
  const innerWidth = w - 2 * t;
  const innerHeight = h - 2 * t;
  
  if (innerWidth <= 0 || innerHeight <= 0 || t <= 0) {
    return calculateRectangularProperties(w, h);
  }

  const area = (w * h) - (innerWidth * innerHeight);
  const momentOfInertia = ((w * Math.pow(h, 3)) - (innerWidth * Math.pow(innerHeight, 3))) / 12;
  const sectionModulus = h > 0 ? momentOfInertia / (h / 2) : 0;
  return { area, momentOfInertia, sectionModulus };
}

export function calculateChannelProperties(width: number, height: number, thickness: number) {
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  const t = Math.max(0, thickness);

  if (t <= 0 || w <= t || h <= 2 * t) {
    return calculateRectangularProperties(w, h);
  }

  // Channel area: 2 flanges + 1 web
  // Area = 2 * (w * t) + (h - 2t) * t
  const area = 2 * w * t + (h - 2 * t) * t;

  // Moment of Inertia (Ix) - assuming bending about major axis (horizontal)
  // I = (w * h^3)/12 - ((w - t) * (h - 2t)^3)/12
  const momentOfInertia = (w * Math.pow(h, 3)) / 12 - ((w - t) * Math.pow(h - 2 * t, 3)) / 12;
  const sectionModulus = h > 0 ? momentOfInertia / (h / 2) : 0;

  return { area, momentOfInertia, sectionModulus };
}

export function calculateLPlateProperties(width: number, height: number, thickness: number) {
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  const t = Math.max(0, thickness);

  if (t <= 0 || w <= t || h <= t) {
    return calculateRectangularProperties(w, h);
  }

  // L-plate area: horizontal leg + vertical leg
  // Area = w*t + (h-t)*t
  const area = w * t + (h - t) * t;

  // Centroid y_c from bottom
  // A1 = w*t, y1 = t/2
  // A2 = (h-t)*t, y2 = t + (h-t)/2 = (h+t)/2
  const a1 = w * t;
  const y1 = t / 2;
  const a2 = (h - t) * t;
  const y2 = (h + t) / 2;
  const yc = (a1 * y1 + a2 * y2) / area;

  // Moment of Inertia (Ix) about centroid
  // I1 = w*t^3/12 + a1*(yc-y1)^2
  // I2 = t*(h-t)^3/12 + a2*(yc-y2)^2
  const i1 = (w * Math.pow(t, 3)) / 12 + a1 * Math.pow(yc - y1, 2);
  const i2 = (t * Math.pow(h - t, 3)) / 12 + a2 * Math.pow(yc - y2, 2);
  const momentOfInertia = i1 + i2;

  // Section Modulus (Wx)
  const sectionModulus = Math.max(yc, h - yc) > 0 ? momentOfInertia / Math.max(yc, h - yc) : 0;

  return { area, momentOfInertia, sectionModulus };
}
