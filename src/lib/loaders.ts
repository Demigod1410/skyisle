import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { LoadingManager } from 'three';

// Create a loading manager to handle loading progress
export const loadingManager = new LoadingManager();

// Create and configure Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/'); // Path to Draco decoder files

// Create and configure GLTF loader
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

export { gltfLoader };
