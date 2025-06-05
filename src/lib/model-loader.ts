/**
 * This file provides utilities for loading and managing 3D models in the floating island scene.
 */
import { useGLTF } from '@react-three/drei';
import { Object3D } from 'three';

// Pre-cache models to improve performance - add your model paths here
export const modelPaths = {
  // Add your models here:
  // myModel: '/models/my-model.glb'
};

/**
 * Async function to load a model and prepare it for use
 */
export async function loadModel(path: string): Promise<Object3D | null> {
  try {
    // Dynamic import of GLTFLoader to ensure it's only loaded in browser
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader');
    const loader = new GLTFLoader();
    
    return new Promise((resolve, reject) => {
      loader.load(
        path,
        (gltf) => {
          resolve(gltf.scene);
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
          reject(error);
        }
      );
    });
  } catch (error) {
    console.error('Failed to load model:', error);
    return null;
  }
}

/**
 * Helper hook to load GLTF models with proper caching
 */
export function useModel(path: string) {
  return useGLTF(path);
}

/**
 * Utility to prepare your model files for upload
 * 
 * Recommended process for adding your own models:
 * 
 * 1. Create models in Blender or your preferred 3D software
 * 2. Export as .glb format (preferred for web)
 * 3. Optimize the model using tools like gltf-pipeline:
 *    npx gltf-pipeline -i model.glb -o model-optimized.glb --draco.compressionLevel=7
 * 4. Place the optimized model in the public/models directory
 * 5. Add the path to modelPaths above
 * 6. Import and use in your component with useModel hook
 */
