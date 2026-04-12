import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, Center, Text } from '@react-three/drei';
import * as THREE from 'three';

interface BeamVisualizer3DProps {
  length: number;
  width: number;
  height: number;
  thickness: number;
  sectionType: 'solid' | 'hollow';
  materialColor?: string;
}

const BeamModel: React.FC<BeamVisualizer3DProps> = ({ 
  length, 
  width, 
  height, 
  thickness, 
  sectionType,
  materialColor = '#94a3b8' 
}) => {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Outer rectangle
    const hw = width / 2;
    const hh = height / 2;
    shape.moveTo(-hw, -hh);
    shape.lineTo(hw, -hh);
    shape.lineTo(hw, hh);
    shape.lineTo(-hw, hh);
    shape.lineTo(-hw, -hh);

    if (sectionType === 'hollow' && thickness > 0) {
      const hole = new THREE.Path();
      const ihw = hw - thickness;
      const ihh = hh - thickness;
      
      if (ihw > 0 && ihh > 0) {
        hole.moveTo(-ihw, -ihh);
        hole.lineTo(ihw, -ihh);
        hole.lineTo(ihw, ihh);
        hole.lineTo(-ihw, ihh);
        hole.lineTo(-ihw, -ihh);
        shape.holes.push(hole);
      }
    }

    const extrudeSettings = {
      steps: 1,
      depth: length,
      bevelEnabled: false,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [length, width, height, thickness, sectionType]);

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
      
      {/* Dimension Labels */}
      <group position={[length / 2, height / 2 + 20, 0]} rotation={[0, Math.PI / 2, 0]}>
         <Text fontSize={15} color="#64748b" anchorX="center" anchorY="middle">
           {length}mm
         </Text>
      </group>
    </group>
  );
};

export const BeamVisualizer3D: React.FC<BeamVisualizer3DProps> = (props) => {
  return (
    <div className="w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden relative border border-slate-800 shadow-2xl">
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
          L: {props.length}mm | W: {props.width}mm | H: {props.height}mm
        </div>
      </div>
    </div>
  );
};
