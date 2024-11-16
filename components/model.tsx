import React, { Suspense } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

interface ModelProps {
  modelUrl: string;
}

function Model({ modelUrl }: ModelProps) {
  const { scene } = useGLTF(modelUrl ?? "/untitled.glb");
  return <primitive object={scene} />;
}

export const height = "50vh";

export function GLB({ modelUrl }: ModelProps) {
  return (
    <Canvas
      className="min-w-screen"
      style={{ height }}
      camera={{ position: [-10, 15, 15], fov: 50 }}
    >
      <ambientLight intensity={1} />
      <Suspense fallback={null}>
        <Model modelUrl={modelUrl} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
