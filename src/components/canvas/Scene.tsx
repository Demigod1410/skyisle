import { Environment, Html, OrbitControls, PerspectiveCamera, SoftShadows, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FloatingIsland } from './FloatingIsland';
import { useControls } from 'leva';
import { LoadingScreen } from '../LoadingScreen';

// Error fallback component rendered outside Canvas
function ErrorFallbackOutside() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-sm">
      <div className="bg-red-950 text-white p-6 rounded-lg max-w-md text-center">
        <h2 className="text-xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="mb-4">
          There was an error loading the 3D scene. This might be due to:
          <ul className="list-disc list-inside mt-2 text-left">
            <li>WebGL not being supported</li>
            <li>Low system resources</li>
            <li>Incompatible browser</li>
          </ul>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// Scene error indicator for use inside Canvas - using mesh instead of div
function SceneErrorIndicator() {
  return (
    <group position={[0, 2, 0]}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <Html center>
        <div className="bg-red-950 text-white p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Scene Error</h2>
          <p>There was an error in the 3D scene</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md transition-colors"
          >
            Reload
          </button>
        </div>
      </Html>
    </group>
  );
}

export function Scene() {
  const { 
    intensity, 
    ambient,
    shadows 
  } = useControls({
    intensity: { value: 1, min: 0, max: 2, step: 0.1 },
    ambient: { value: 0.5, min: 0, max: 1, step: 0.1 },
    shadows: true
  });

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900">
      <ErrorBoundary FallbackComponent={ErrorFallbackOutside}>
        <Canvas shadows={shadows}>
          <Suspense fallback={<LoadingScreen />}>
            {/* Camera */}
            <PerspectiveCamera makeDefault position={[8, 5, 8]} />
            <OrbitControls 
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
              minDistance={5}
              maxDistance={15}
            />

            {/* Lighting */}
            <hemisphereLight intensity={ambient} groundColor="#000000" />
            <directionalLight
              castShadow
              position={[2.5, 8, 5]}
              intensity={intensity}
              shadow-mapSize={[1024, 1024]}
            >
              <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
            </directionalLight>

            {/* Environment and Effects */}
            <SoftShadows size={2.5} samples={16} focus={0} />
            <Environment preset="sunset" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            {/* Scene Content */}
            <ErrorBoundary FallbackComponent={SceneErrorIndicator}>
              <FloatingIsland />
            </ErrorBoundary>
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
