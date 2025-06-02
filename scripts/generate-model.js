import { Document, NodeIO } from '@gltf-transform/core';
import { MeshStandardMaterial } from 'three';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new glTF document
const document = new Document();

// Create basic textures and materials
const islandMaterial = document
  .createMaterial()
  .setName('islandMaterial')
  .setRoughnessFactor(0.8)
  .setMetallicFactor(0.2);

const houseMaterial = document
  .createMaterial()
  .setName('houseMaterial')
  .setRoughnessFactor(0.3)
  .setMetallicFactor(0.2);

const treeMaterial = document
  .createMaterial()
  .setName('treeMaterial')
  .setRoughnessFactor(0.4)
  .setMetallicFactor(0);

// Create nodes
const scene = document.createScene();
const islandNode = document.createNode('island');
const houseNode = document.createNode('house');
const treeNode = document.createNode('tree');

// Set up transformations
houseNode.setTranslation([0, 1, 0]);

// Add nodes to scene
scene.addChild(islandNode);
scene.addChild(houseNode);
scene.addChild(treeNode);

// Write file
const io = new NodeIO();
await io.write(
  path.join(__dirname, '..', 'public', 'models', 'floating_island.glb'),
  document
);
