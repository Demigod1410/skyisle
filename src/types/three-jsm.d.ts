declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Object3D, LoadingManager } from 'three';

  export class GLTFLoader {
    constructor(manager?: LoadingManager);
    load(url: string, onLoad: (gltf: GLTF) => void, onProgress?: (event: ProgressEvent) => void, onError?: (error: ErrorEvent) => void): void;
    setDRACOLoader(dracoLoader: any): GLTFLoader;
    parse(data: ArrayBuffer | string, path: string, onLoad: (gltf: GLTF) => void, onError?: (error: ErrorEvent) => void): void;
  }

  export interface GLTF {
    animations: any[];
    scene: Object3D;
    scenes: Object3D[];
    cameras: any[];
    asset: any;
  }
}

declare module 'three/examples/jsm/loaders/DRACOLoader' {
  import { LoadingManager } from 'three';

  export class DRACOLoader {
    constructor(manager?: LoadingManager);
    setDecoderPath(path: string): DRACOLoader;
    setDecoderConfig(config: object): DRACOLoader;
    preload(): DRACOLoader;
    load(url: string, onLoad: Function, onProgress?: Function, onError?: Function): void;
  }
}
