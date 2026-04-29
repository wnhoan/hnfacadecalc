import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, Center, Text } from '@react-three/drei';
import * as THREE from 'three';

interface BeamVisualizer3DProps {
  length: number;
  width: number;
  height: number;
  thickness: number;
  thickness2: number;
  sectionType: 'solid' | 'hollow' | 'channel' | 'l-plate' | 'i-beam' | 't-section';
  supportCondition?: 'simply_supported' | 'cantilever' | 'propped_cantilever' | 'fixed_fixed' | 'fixed_pinned' | 'continuous';
  materialColor?: string;
  unitSystem?: 'metric' | 'imperial';
  intermediateSupports?: number[];
}

const SupportIndicator: React.FC<{ type: 'pin' | 'fixed', position: [number, number, number] }> = ({ type, position }) => {
  if (type === 'pin') {
    return (
      <mesh position={position}>
        <coneGeometry args={[20, 40, 4]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
    );
  }
  return (
    <mesh position={position}>
      <boxGeometry args={[20, 80, 80]} />
      <meshStandardMaterial color="#475569" />
    </mesh>
  );
};

const BeamModel: React.FC<BeamVisualizer3DProps> = ({ 
  length, 
  width, 
  height, 
  thickness: tx, 
  thickness2: ty,
  sectionType,
  supportCondition = 'simply_supported',
  materialColor = '#94a3b8',
  unitSystem = 'metric',
  intermediateSupports = []
}) => {
  const u = unitSystem === 'metric' ? 'mm' : 'in';
  
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const hw = width / 2;
    const hh = height / 2;

    if (sectionType === 'channel') {
      // Channel shape (C-shape)
      const tw = tx; // Web thickness
      const tf = ty; // Flange thickness
      // Start at bottom right of web
      shape.moveTo(-hw + tw, -hh);
      shape.lineTo(hw, -hh);
      shape.lineTo(hw, -hh + tf);
      shape.lineTo(-hw + tw, -hh + tf);
      shape.lineTo(-hw + tw, hh - tf);
      shape.lineTo(hw, hh - tf);
      shape.lineTo(hw, hh);
      shape.lineTo(-hw, hh);
      shape.lineTo(-hw, -hh);
      shape.closePath();
    } else if (sectionType === 'l-plate') {
      // L-plate shape (Angle)
      const th = tx; // Horizontal leg thickness
      const tv = ty; // Vertical leg thickness
      shape.moveTo(-hw, -hh);
      shape.lineTo(hw, -hh);
      shape.lineTo(hw, -hh + th);
      shape.lineTo(-hw + tv, -hh + th);
      shape.lineTo(-hw + tv, hh);
      shape.lineTo(-hw, hh);
      shape.lineTo(-hw, -hh);
      shape.closePath();
    } else if (sectionType === 'i-beam') {
      // I-Beam shape
      const tw = tx; // Web thickness
      const tf = ty; // Flange thickness
      // Start at web bottom-left
      shape.moveTo(-tw / 2, -hh + tf);
      shape.lineTo(tw / 2, -hh + tf);
      shape.lineTo(tw / 2, hh - tf);
      shape.lineTo(hw, hh - tf);
      shape.lineTo(hw, hh);
      shape.lineTo(-hw, hh);
      shape.lineTo(-hw, hh - tf);
      shape.lineTo(-tw / 2, hh - tf);
      shape.lineTo(-tw / 2, -hh + tf); // back to start of loop-ish? wait
      shape.closePath(); // Let's rebuild properly
      
      shape.currentPoint.set(0, 0); // reset
      shape.curves = [];
      
      // Bottom flange
      shape.moveTo(-hw, -hh);
      shape.lineTo(hw, -hh);
      shape.lineTo(hw, -hh + tf);
      // To web
      shape.lineTo(tw / 2, -hh + tf);
      shape.lineTo(tw / 2, hh - tf);
      // Top flange
      shape.lineTo(hw, hh - tf);
      shape.lineTo(hw, hh);
      shape.lineTo(-hw, hh);
      shape.lineTo(-hw, hh - tf);
      // To web left
      shape.lineTo(-tw / 2, hh - tf);
      shape.lineTo(-tw / 2, -hh + tf);
      shape.lineTo(-hw, -hh + tf);
      shape.lineTo(-hw, -hh);
      shape.closePath();
    } else if (sectionType === 't-section') {
      // T-Section shape
      const tw = tx; // Web thickness
      const tf = ty; // Flange thickness
      // Top flange
      shape.moveTo(-hw, hh);
      shape.lineTo(hw, hh);
      shape.lineTo(hw, hh - tf);
      shape.lineTo(tw/2, hh - tf);
      shape.lineTo(tw/2, -hh);
      shape.lineTo(-tw/2, -hh);
      shape.lineTo(-tw/2, hh - tf);
      shape.lineTo(-hw, hh - tf);
      shape.closePath();
    } else {
      // Outer rectangle for solid/hollow
      shape.moveTo(-hw, -hh);
      shape.lineTo(hw, -hh);
      shape.lineTo(hw, hh);
      shape.lineTo(-hw, hh);
      shape.lineTo(-hw, -hh);

      if (sectionType === 'hollow' && tx > 0 && ty > 0) {
        const hole = new THREE.Path();
        const ihw = hw - tx;
        const ihh = hh - ty;
        
        if (ihw > 0 && ihh > 0) {
          hole.moveTo(-ihw, -ihh);
          hole.lineTo(ihw, -ihh);
          hole.lineTo(ihw, ihh);
          hole.lineTo(-ihw, ihh);
          hole.lineTo(-ihw, -ihh);
          shape.holes.push(hole);
        }
      }
    }

    const extrudeSettings = {
      steps: 1,
      depth: length,
      bevelEnabled: false,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [length, width, height, tx, ty, sectionType]);

  return (
    <group rotation={[0, -Math.PI / 2, 0]} position={[-length / 2, 0, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial 
          color={materialColor} 
          metalness={0.8} 
          roughness={0.2} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Supports */}
      {supportCondition === 'simply_supported' && (
        <>
          <SupportIndicator type="pin" position={[0, -height / 2 - 20, 0]} />
          <SupportIndicator type="pin" position={[0, -height / 2 - 20, length]} />
        </>
      )}
      {supportCondition === 'cantilever' && (
        <SupportIndicator type="fixed" position={[0, 0, 0]} />
      )}
      {supportCondition === 'fixed_fixed' && (
        <>
          <SupportIndicator type="fixed" position={[0, 0, 0]} />
          <SupportIndicator type="fixed" position={[0, 0, length]} />
        </>
      )}
      {(supportCondition === 'fixed_pinned' || supportCondition === 'propped_cantilever') && (
        <>
          <SupportIndicator type="fixed" position={[0, 0, 0]} />
          <SupportIndicator type="pin" position={[0, -height / 2 - 20, length]} />
        </>
      )}
      {supportCondition === 'continuous' && (
        <>
          <SupportIndicator type="pin" position={[0, -height / 2 - 20, 0]} />
          {intermediateSupports?.map((pos, idx) => (
            <SupportIndicator key={idx} type="pin" position={[0, -height / 2 - 20, pos]} />
          ))}
          <SupportIndicator type="pin" position={[0, -height / 2 - 20, length]} />
        </>
      )}
      
      {/* Dimension Labels */}
      <group position={[length / 2, height / 2 + 40, 0]} rotation={[0, Math.PI / 2, 0]}>
         <Text fontSize={20} color="#94a3b8" anchorX="center" anchorY="middle">
           L = {length}{u}
         </Text>
      </group>
    </group>
  );
};

export const BeamVisualizer3D: React.FC<BeamVisualizer3DProps> = (props) => {
  return (
    <div className="w-full h-[250px] sm:h-[400px] bg-slate-900 rounded-xl overflow-hidden relative border border-slate-800 shadow-2xl">
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">3D Structural Preview</span>
        </div>
      </div>
      
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[props.length * 0.8, props.height * 2, props.length * 0.8]} fov={50} />
        <OrbitControls makeDefault minDistance={100} maxDistance={props.length * 5} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[props.length, props.height * 5, props.width * 5]} intensity={1} castShadow />
        <spotLight position={[-props.length, props.height * 10, -props.width * 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Center top>
          <BeamModel {...props} />
        </Center>
        
        <Grid 
          infiniteGrid 
          fadeDistance={props.length * 3} 
          fadeStrength={5} 
          cellSize={100} 
          sectionSize={500} 
          sectionColor="#334155" 
          cellColor="#1e293b" 
        />
        
        <Environment preset="city" />
      </Canvas>
      
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <div className="text-[9px] text-slate-500 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
          L: {props.length}{props.unitSystem === 'metric' ? 'mm' : 'in'} | W: {props.width}{props.unitSystem === 'metric' ? 'mm' : 'in'} | H: {props.height}{props.unitSystem === 'metric' ? 'mm' : 'in'}
        </div>
      </div>
    </div>
  );
};
