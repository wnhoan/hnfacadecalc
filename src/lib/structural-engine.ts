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
}

export interface Load {
  id: string;
  type: 'udl' | 'point' | 'trapezoidal';
  category: 'dead' | 'live' | 'wind' | 'snow';
  value: number; // N/mm for UDL, N for point, w1 for trapezoidal
  value2?: number; // w2 for trapezoidal
  position?: number; // mm from left support (for point load)
  start?: number; // mm from left support (for trapezoidal)
  end?: number; // mm from left support (for trapezoidal)
}

export interface CalculationResult {
  x: number;
  deflection: number;
  moment: number;
  shear: number;
  stress: number;
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
  steps: number = 100
): { points: CalculationResult[]; summary: SummaryResults } {
  const { length, elasticModulus, momentOfInertia, sectionModulus, yieldStrength } = props;
  const EI = elasticModulus * momentOfInertia;
  const points: CalculationResult[] = [];

  // Calculate reactions using numerical integration for simplicity and flexibility
  let R1 = 0; 
  const dx_reaction = length / 1000;
  let totalLoadMagnitude = 0;
  let totalMomentAboutR1 = 0;

  loads.forEach((load) => {
    if (load.type === 'udl') {
      const w = load.value;
      const W = w * length;
      totalLoadMagnitude += W;
      totalMomentAboutR1 += W * (length / 2);
    } else if (load.type === 'point') {
      const P = load.value;
      const a = load.position ?? length / 2;
      totalLoadMagnitude += P;
      totalMomentAboutR1 += P * a;
    } else if (load.type === 'trapezoidal') {
      const w1 = load.value;
      const w2 = load.value2 ?? load.value;
      const x1 = load.start ?? 0;
      const x2 = load.end ?? length;
      const L_load = x2 - x1;
      
      // Area of trapezoid
      const W = 0.5 * (w1 + w2) * L_load;
      // Centroid of trapezoid relative to x1
      const x_c_rel = (L_load / 3) * ((w1 + 2 * w2) / (w1 + w2));
      const x_c = x1 + x_c_rel;
      
      totalLoadMagnitude += W;
      totalMomentAboutR1 += W * x_c;
    }
  });

  const R2 = totalMomentAboutR1 / length;
  R1 = totalLoadMagnitude - R2;

  // Calculate internal forces and deflection
  // We use numerical integration for deflection: EI * v'' = -M
  // v' = integral(-M/EI) + C1
  // v = integral(v') + C2
  // Boundary conditions: v(0) = 0, v(L) = 0
  
  const tempPoints: { x: number; moment: number; shear: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (length * i) / steps;
    let moment = R1 * x;
    let shear = R1;

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
        
        if (x > x1) {
          const curr_x = Math.min(x, x2);
          const L_seg = curr_x - x1;
          const w_at_x = w1 + (w2 - w1) * (L_seg / (x2 - x1));
          
          // Load of the segment from x1 to curr_x
          const W_seg = 0.5 * (w1 + w_at_x) * L_seg;
          // Centroid of the segment relative to x1
          const x_c_seg_rel = (L_seg / 3) * ((w1 + 2 * w_at_x) / (w1 + w_at_x));
          
          shear -= W_seg;
          moment -= W_seg * (x - (x1 + x_c_seg_rel));
        }
      }
    });

    tempPoints.push({ x, moment, shear });
  }

  // Numerical integration for deflection
  // v'' = -M/EI
  // Integrate twice
  let slope = 0; // Initial guess for v'(0)
  let deflection = 0;
  const dx = length / steps;

  // We need to find the correct initial slope C1 such that v(L) = 0
  // v(x) = integral_0^x (integral_0^xi (-M/EI) dtau + C1) dxi
  // v(x) = v_base(x) + C1*x
  // v(L) = v_base(L) + C1*L = 0  => C1 = -v_base(L) / L

  let v_base = 0;
  let v_prime_base = 0;
  const v_base_values: number[] = [0];

  for (let i = 0; i < steps; i++) {
    const M_avg = (tempPoints[i].moment + tempPoints[i+1].moment) / 2;
    v_prime_base += (-M_avg / EI) * dx;
    v_base += v_prime_base * dx;
    v_base_values.push(v_base);
  }

  const C1 = -v_base / length;

  for (let i = 0; i <= steps; i++) {
    const x = tempPoints[i].x;
    const defl = v_base_values[i] + C1 * x;
    const stress = sectionModulus > 0 ? Math.abs(tempPoints[i].moment) / sectionModulus : 0;

    points.push({
      x,
      deflection: defl,
      moment: tempPoints[i].moment,
      shear: tempPoints[i].shear,
      stress,
    });
  }

  const maxDeflection = Math.max(...points.map((p) => Math.abs(p.deflection)));
  const maxMoment = Math.max(...points.map((p) => Math.abs(p.moment)));
  const maxShear = Math.max(...points.map((p) => Math.abs(p.shear)));
  const maxStress = Math.max(...points.map((p) => p.stress));

  const deflectionRatioValue = maxDeflection > 0.001 ? length / maxDeflection : 9999;
  const deflectionRatio = maxDeflection > 0.001 ? `L/${Math.round(deflectionRatioValue)}` : 'N/A';

  const allowableStress = yieldStrength / props.safetyFactor;
  const status = maxStress < allowableStress && deflectionRatioValue > 175 ? 'pass' : 'fail';

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
  const area = width * height;
  const momentOfInertia = (width * Math.pow(height, 3)) / 12;
  const sectionModulus = momentOfInertia / (height / 2);
  return { area, momentOfInertia, sectionModulus };
}

export function calculateHollowRectangularProperties(width: number, height: number, thickness: number) {
  const innerWidth = width - 2 * thickness;
  const innerHeight = height - 2 * thickness;
  if (innerWidth <= 0 || innerHeight <= 0) return calculateRectangularProperties(width, height);

  const area = (width * height) - (innerWidth * innerHeight);
  const momentOfInertia = ((width * Math.pow(height, 3)) - (innerWidth * Math.pow(innerHeight, 3))) / 12;
  const sectionModulus = momentOfInertia / (height / 2);
  return { area, momentOfInertia, sectionModulus };
}
