/**
 * Engineering Constants and Coefficients
 * Centralized location for magic numbers and configuration values
 */

export const CAST_IN_EMBED_DEFAULTS = {
  steelStrength: 400, // Typical M12 grade 8.8 or similar reduced yield (MPa)
  headSizeMultiplier: 1.8, // Bolt head size relative to diameter
  boltAreaEfficiency: 0.75, // Threaded area approx 75% of gross area
};

export const PANEL_ANALYSIS_DEFAULTS = {
  glassThicknessAssumed: 10, // mm (for dead load estimation)
  deflectionLimitRatio: 60, // L/60 for panels
};

export const BEAM_ANALYSIS_DEFAULTS = {
  transomDeflectionLimit: 240, // L/240
  mullionDeflectionLimit: 175, // L/175
};

export const BRACKET_ANALYSIS_DEFAULTS = {
  eccentricity: 50, // mm (distance from neutral axis)
  shearStressLimit: 210, // MPa (420 / 2 for bolts)
};

export const SOLVER_DEFAULTS = {
  singularityThreshold: 1e-10, // Tolerance for zero-division checks
  numericalSteps: 200, // Default integration steps for beam analysis
};

// Roark's formulas for panel deflection coefficients
export const PANEL_DEFLECTION_COEFFICIENTS = [
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

/**
 * ACI 318 Concrete breakout calculation
 * Simplified empirical coefficients for cast-in-embed anchors
 */
export const CAST_IN_EMBED_COEFFICIENTS = {
  concreteBreakoutTension: 10, // sqrt(fc') multiplier
  tensionPowerLaw: 1.5, // Interaction exponent
  shearPowerLaw: 1.5,
};
