import { Environment, Html, OrbitControls, PerspectiveCamera, SoftShadows, Stars, Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FloatingIsland } from './FloatingIsland';
import { useControls } from 'leva';
import { LoadingScreen } from '../LoadingScreen';
import * as THREE from 'three';

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

export interface SceneProps {
  isDarkMode?: boolean;
}

export function Scene({ isDarkMode = true }: SceneProps) {
  const { 
    intensity, 
    ambient,
    shadows 
  } = useControls("lighting", {
    intensity: { value: isDarkMode ? 0.8 : 1.5, min: 0, max: 2, step: 0.1 },
    ambient: { value: isDarkMode ? 0.3 : 0.7, min: 0, max: 1, step: 0.1 },
    shadows: true
  });

  // Dynamic background color based on theme
  const bgGradient = isDarkMode 
    ? "from-black to-gray-900" 
    : "from-blue-300 to-sky-500";

  return (
    <div className={`w-full h-screen bg-gradient-to-b ${bgGradient} transition-colors duration-700`}>
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
            />            {/* Lighting - dynamic based on theme */}
            {isDarkMode ? (
              /* Night lighting */
              <>
                <hemisphereLight intensity={ambient * 0.5} groundColor="#000010" color="#1a237e" />
                <directionalLight
                  castShadow
                  position={[-5, 8, -2]}
                  intensity={intensity * 0.4}
                  shadow-mapSize={[1024, 1024]}
                  color="#b1c5ff"
                >
                  <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
                </directionalLight>
                <pointLight position={[0, 3, 0]} intensity={0.3} color="#5d63ff" distance={5} />
              </>
            ) : (
              /* Day lighting */
              <>
                <hemisphereLight intensity={ambient} groundColor="#3e5f8a" color="#ffeeb1" />
                <directionalLight
                  castShadow
                  position={[2.5, 8, 5]}
                  intensity={intensity}
                  shadow-mapSize={[2048, 2048]}
                  color="#fffbf0"
                >
                  <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
                </directionalLight>
                <pointLight position={[0, 3, 0]} intensity={0.2} color="#ffffe0" distance={5} />
              </>
            )}{/* Environment and Effects */}
            <SoftShadows size={2.5} samples={16} focus={0} />
            
            {/* Dynamic environment based on theme */}
            {isDarkMode ? (
              <>
                <Environment preset="night" />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade speed={1} />
                <ambientLight intensity={0.1} color="#2a365c" />
                {/* Moon light */}
                <directionalLight 
                  position={[-5, 5, -5]} 
                  intensity={0.1} 
                  color="#a9c0ff" 
                />
              </>
            ) : (
              <>
                <Environment preset="sunset" />
                <Sky 
                  distance={45000} 
                  sunPosition={[10, 5, 10]} 
                  turbidity={8}
                  rayleigh={6}
                  mieCoefficient={0.005}
                  mieDirectionalG={0.7}
                />
                {/* Warmer ambient light for daytime */}
                <ambientLight intensity={0.4} color="#fffaf0" />
              </>
            )}
              {/* Scene Content */}
            <ErrorBoundary FallbackComponent={SceneErrorIndicator}>
              <FloatingIsland isDarkMode={isDarkMode} />
            </ErrorBoundary>
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
