/**
 * Global Constants for Structural Analysis App
 */

export const MATERIALS = {
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

export const LOAD_CATEGORIES = {
  dead: { name: 'Dead Load (D)', color: 'text-slate-500', bg: 'bg-slate-100' },
  live: { name: 'Live Load (L)', color: 'text-blue-500', bg: 'bg-blue-100' },
  wind: { name: 'Wind Load (W)', color: 'text-green-500', bg: 'bg-green-100' },
  snow: { name: 'Snow Load (S)', color: 'text-cyan-500', bg: 'bg-cyan-100' },
  seismic: { name: 'Seismic Load (E)', color: 'text-rose-500', bg: 'bg-rose-100' },
};

export const SEISMIC_REGIONS = {
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

export const LOCATION_SEISMIC_MAPPING: Record<string, keyof typeof SEISMIC_REGIONS> = {
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
  'athens': 'turkey', 
  'istanbul': 'turkey',
  'ankara': 'turkey',
  'vancouver': 'philippines', 
  'toronto': 'usa_east',
  'mexico city': 'philippines', 
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
  'taipei': 'japan', 
  'hanoi': 'thailand', 
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
  'dubai': 'singapore', 
  'abu dhabi': 'singapore',
  'riyadh': 'singapore',
  'doha': 'singapore',
  'muscat': 'singapore',
  'cairo': 'thailand', 
  'johannesburg': 'singapore',
  'cape town': 'singapore',
};

export const PANEL_MATERIALS = {
  aluminum_solid: { name: 'Solid Aluminum (3mm)', e: 70000, yield: 160, density: 2700, poisson: 0.33 },
  aluminum_solid_high: { name: 'Solid Aluminum (High Strength)', e: 70000, yield: 240, density: 2700, poisson: 0.33 },
  acm_4mm: { name: 'ACM / Composite (4mm)', e: 70000, yield: 120, density: 1500, poisson: 0.25, skinThickness: 0.5, totalThickness: 4.0 },
  acm_3mm: { name: 'ACM / Composite (3mm)', e: 70000, yield: 120, density: 1500, poisson: 0.25, skinThickness: 0.5, totalThickness: 3.0 },
};

export const SEALANT_MATERIALS = {
  silicone_structural: { name: 'Structural Silicone', dynamicStress: 0.14, staticStress: 0.011, eModulus: 1.5 },
  silicone_weather: { name: 'Weather Silicone', dynamicStress: 0.05, staticStress: 0.005, eModulus: 0.8 },
  pu_sealant: { name: 'PU Sealant', dynamicStress: 0.08, staticStress: 0.008, eModulus: 1.2 },
};

export const BRACKET_TYPES = {
  dead_load: { name: 'Dead Load Bracket', description: 'Supports vertical gravity loads' },
  wind_load: { name: 'Wind Load Bracket (Slotted)', description: 'Supports horizontal wind while allowing vertical movement' },
  combined: { name: 'Fixed Connection (Dead + Wind)', description: 'Supports all directions' },
};

export const TRANSLATIONS = {
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
    channel: 'Channel',
    lPlate: 'L-Plate',
    iBeam: 'I-Beam',
    tSection: 'T-Section',
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
    stiffenerCountV: 'Vertical Stiffeners',
    stiffenerCountH: 'Horizontal Stiffeners',
    maxSkinDeflection: 'Max Skin Deflection',
    maxSkinStress: 'Max Skin Stress',
    sealantMode: 'Structural Sealant',
    bracketMode: 'Fixing Bracket',
    castInMode: 'Cast-in Embed',
    sealantProps: 'Sealant Properties',
    bracketProps: 'Bracket Properties',
    embedProps: 'Embedment Properties',
    glassDims: 'Glass Dimensions',
    biteDept: 'Bite Depth',
    contactWidth: 'Contact Width',
    tributaryArea: 'Tributary Area',
    boltProps: 'Bolt Specification',
    boltDiameter: 'Bolt Diameter',
    boltCount: 'Bolt Count',
    embedDepth: 'Embedment Depth',
    edgeDistance: 'Edge Distance',
    concreteGrade: 'Concrete Grade',
    deadLoad: 'Dead Load',
    windPressure: 'Wind Pressure',
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
    channel: '工字钢/槽钢 (Channel)',
    lPlate: '角钢 (L-Plate)',
    iBeam: 'I字钢 (I-Beam)',
    tSection: 'T字钢 (T-Section)',
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
    stiffenerCountV: '垂直加强肋数量',
    stiffenerCountH: '水平加强肋数量',
    maxSkinDeflection: '最大面板挠度',
    maxSkinStress: '最大面板应力',
    sealantMode: '结构硅酮胶',
    bracketMode: '连接转接件',
    castInMode: '预埋件分析',
    sealantProps: '密封胶属性',
    bracketProps: '支座/转接件属性',
    embedProps: '埋件属性',
    glassDims: '玻璃尺寸',
    biteDept: '打胶深度 (Bite)',
    contactWidth: '接触宽度',
    tributaryArea: '受荷面积',
    boltProps: '螺栓规格',
    boltDiameter: '螺栓直径',
    boltCount: '螺栓数量',
    embedDepth: '埋设深度',
    edgeDistance: '边缘距离',
    concreteGrade: '混凝土等级',
    deadLoad: '恒载 (Dead Load)',
    windPressure: '风压 (Wind)',
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
    channel: 'Channel',
    lPlate: 'L-Plate',
    iBeam: 'I-Beam',
    tSection: 'T-Section',
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
    stiffenerCountV: 'Vertical Stiffeners',
    stiffenerCountH: 'Horizontal Stiffeners',
    maxSkinDeflection: 'การโก่งตัวสูงสุดของผิว',
    maxSkinStress: 'หน่วยแรงสูงสุดของผิว',
    sealantMode: 'Structural Sealant',
    bracketMode: 'Fixing Bracket',
    castInMode: 'Cast-in Embed',
    sealantProps: 'Sealant Properties',
    bracketProps: 'Bracket Properties',
    embedProps: 'Embedment Properties',
    glassDims: 'Glass Dimensions',
    biteDept: 'Bite Depth',
    contactWidth: 'Contact Width',
    tributaryArea: 'Tributary Area',
    boltProps: 'Bolt Specification',
    boltDiameter: 'Bolt Diameter',
    boltCount: 'Bolt Count',
    embedDepth: 'Embedment Depth',
    edgeDistance: 'Edge Distance',
    concreteGrade: 'Concrete Grade',
    deadLoad: 'Dead Load',
    windPressure: 'Wind Pressure',
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
    channel: 'Channel',
    lPlate: 'L-Plate',
    iBeam: 'I-Beam',
    tSection: 'T-Section',
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
    stiffenerCountV: 'Vertical Stiffeners',
    stiffenerCountH: 'Horizontal Stiffeners',
    maxSkinDeflection: 'Pesongan Kulit Maks',
    maxSkinStress: 'Tegangan Kulit Maks',
    sealantMode: 'Structural Sealant',
    bracketMode: 'Fixing Bracket',
    castInMode: 'Cast-in Embed',
    sealantProps: 'Sealant Properties',
    bracketProps: 'Bracket Properties',
    embedProps: 'Embedment Properties',
    glassDims: 'Glass Dimensions',
    biteDept: 'Bite Depth',
    contactWidth: 'Contact Width',
    tributaryArea: 'Tributary Area',
    boltProps: 'Bolt Specification',
    boltDiameter: 'Bolt Diameter',
    boltCount: 'Bolt Count',
    embedDepth: 'Embedment Depth',
    edgeDistance: 'Edge Distance',
    concreteGrade: 'Concrete Grade',
    deadLoad: 'Dead Load',
    windPressure: 'Wind Pressure',
  }
};

export const LOCATION_CODE_MAPPING: Record<string, { codes: string[], matches: string[] }> = {
  'China': {
    codes: ['China (National)'],
    matches: ['china', 'beijing', 'chengdu', 'chongqing', 'tianjin', 'wuhan', '中国', '中國', '北京', '成都', '重庆', '天津', '武汉']
  },
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
    codes: ['Taiwan'],
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
  'Philippines': {
    codes: ['Philippines'],
    matches: ['philippines', 'manila', 'quezon', 'cebu', 'davao', '菲律宾', '马尼拉']
  },
  'Indonesia': {
    codes: ['Indonesia'],
    matches: ['indonesia', 'jakarta', 'surabaya', 'bandung', 'medan', '印度尼西亚', '雅加达']
  },
  'Qatar': {
    codes: ['Qatar'],
    matches: ['qatar', 'doha', 'lusail', 'al rayyan', '卡塔尔', '多哈']
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
  'Netherlands': {
    codes: ['Eurocodes (EU-General)'],
    matches: ['netherlands', 'holland', 'amsterdam', 'rotterdam', 'utrecht', '荷兰', '荷蘭', '阿姆斯特丹']
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
    codes: ['Egypt'],
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

export const CODES_OF_PRACTICE = [
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

export const UNITS = {
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

export const CONVERSION = {
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

export const DEFAULT_COMBINATIONS = [
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

export const PRESET_PROFILES = [
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

export const REGIONS_DISPLAY = [
  { 
    id: 'asia-east', 
    name: 'East Asia', 
    cities: ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Hong Kong', 'Macau', 'Taipei', 'Tokyo', 'Osaka', 'Seoul', 'Busan'] 
  },
  { 
    id: 'asia-se', 
    name: 'Southeast & South Asia', 
    cities: ['Singapore', 'Kuala Lumpur', 'Bangkok', 'Jakarta', 'Manila', 'Ho Chi Minh', 'Mumbai', 'Delhi', 'Bangalore'] 
  },
  { 
    id: 'europe', 
    name: 'Europe & UK', 
    cities: ['London', 'Birmingham', 'Berlin', 'Munich', 'Paris', 'Lyon', 'Rome', 'Milan', 'Madrid', 'Barcelona', 'Amsterdam'] 
  },
  { 
    id: 'americas', 
    name: 'Americas', 
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Toronto', 'Vancouver', 'Mexico City', 'Sao Paulo', 'Rio de Janeiro'] 
  },
  { 
    id: 'mideast-africa', 
    name: 'Middle East & Africa', 
    cities: ['Dubai', 'Abu Dhabi', 'Riyadh', 'Jeddah', 'Doha', 'Muscat', 'Cape Town', 'Johannesburg', 'Cairo', 'Lagos'] 
  },
  { 
    id: 'oceania', 
    name: 'Oceania', 
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Auckland', 'Wellington', 'Christchurch'] 
  },
];
