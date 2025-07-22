import { LoadingManager } from 'three';

// Check if window is defined to handle SSR
const isBrowser = typeof window !== 'undefined';

// Create a loading manager to track loading progress
export const loadingManager = isBrowser 
  ? new LoadingManager(
      // onLoad
      () => {
        console.log('Loading complete!');
      },
      // onProgress
      (url, itemsLoaded, itemsTotal) => {
        console.log(`Loading file: ${url}. ${itemsLoaded} of ${itemsTotal} files.`);
      },
      // onError
      (url) => {
        console.error(`There was an error loading ${url}`);
      }
    ) 
  : null;

// Initialize loaders as null
let dracoLoader = null;
let gltfLoader = null;

// Only create loaders in browser environment
if (isBrowser) {
  // Dynamic imports to avoid SSR issues
  const { DRACOLoader } = require('three/examples/jsm/loaders/DRACOLoader');
  const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader');
  
  // Create and configure Draco loader
  dracoLoader = new DRACOLoader(loadingManager);
  // Use the correct absolute path from the public folder
  dracoLoader.setDecoderPath('/draco/');
  
  // Create and configure GLTF loader
  gltfLoader = new GLTFLoader(loadingManager);
  if (dracoLoader) {
    gltfLoader.setDRACOLoader(dracoLoader);
  }
}

export { gltfLoader };
