import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { LoadingManager } from 'three';

// Create a loading manager to track loading progress
export const loadingManager = new LoadingManager(
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
);

// Create and configure Draco loader
const dracoLoader = new DRACOLoader(loadingManager);
dracoLoader.setDecoderPath('/draco/'); // Path to Draco decoder files
dracoLoader.preload();

// Create and configure GLTF loader
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

export { gltfLoader };
