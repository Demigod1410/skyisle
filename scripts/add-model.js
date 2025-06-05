#!/usr/bin/env node

/**
 * Model preparation script for floating island showcase
 * This script helps you prepare and optimize 3D models for the scene
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const MODELS_DIR = path.resolve(__dirname, '../public/models');

// Make sure models directory exists
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
  console.log(`Created models directory at: ${MODELS_DIR}`);
}

const promptForModelPath = () => {
  return new Promise((resolve) => {
    rl.question('\nEnter the path to your .glb model file: ', (modelPath) => {
      resolve(modelPath.trim());
    });
  });
};

const optimizeModel = async (modelPath, outputName) => {
  const outputPath = path.join(MODELS_DIR, outputName || path.basename(modelPath));
  
  try {
    console.log('\nOptimizing model...');
    execSync(`npx gltf-pipeline -i "${modelPath}" -o "${outputPath}" --draco.compressionLevel=7`);
    console.log(`\n✅ Model optimized and saved to: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('\n❌ Error optimizing model:', error.message);
    console.log('Installing required packages...');
    execSync('npm install --no-save gltf-pipeline');
    console.log('Retrying optimization...');
    return optimizeModel(modelPath, outputName);
  }
};

const addToModelLoader = (modelName, modelPath) => {
  const modelLoaderPath = path.resolve(__dirname, '../src/lib/model-loader.ts');
  
  try {
    let fileContent = fs.readFileSync(modelLoaderPath, 'utf8');
    const modelPathsSection = "export const modelPaths = {";
    const insertPosition = fileContent.indexOf(modelPathsSection) + modelPathsSection.length;
    
    const modelEntry = `\n  ${modelName}: '${modelPath.replace(/\\/g, '/').replace(path.resolve(__dirname, '..'), '')}',`;
    
    const updatedContent = fileContent.slice(0, insertPosition) + modelEntry + fileContent.slice(insertPosition);
    fs.writeFileSync(modelLoaderPath, updatedContent);
    
    console.log(`\n✅ Added model to model-loader.ts as: ${modelName}`);
  } catch (error) {
    console.error('\n❌ Error updating model-loader.ts:', error.message);
  }
};

const main = async () => {
  console.log('🏝️ Floating Island - Model Preparation Tool 🏝️');
  console.log('==============================================');
  
  const modelPath = await promptForModelPath();
  
  if (!modelPath || !fs.existsSync(modelPath)) {
    console.error('\n❌ Invalid file path or file does not exist.');
    rl.close();
    return;
  }
  
  if (!modelPath.toLowerCase().endsWith('.glb')) {
    console.error('\n❌ Only .glb files are supported. Please convert your model to GLB format.');
    rl.close();
    return;
  }
  
  const fileName = path.basename(modelPath);
  
  rl.question(`\nEnter a name for this model (default: ${path.basename(fileName, '.glb')}): `, async (modelName) => {
    modelName = modelName.trim() || path.basename(fileName, '.glb');
    const validName = modelName.replace(/[^a-zA-Z0-9]/g, '');
    
    const outputFileName = `${validName}.glb`;
    const outputPath = await optimizeModel(modelPath, outputFileName);
    
    addToModelLoader(validName, outputPath);
    
    console.log(`\n🎉 Model processed successfully!`);
    console.log(`\nTo use this model in your scene, update your FloatingIsland.tsx:`);
    console.log(`
import { useModel } from '@/lib/model-loader';

// Inside your component:
const { scene } = useModel('/models/${outputFileName}');

// In your render function:
<primitive object={scene} position={[0, 1.5, 0]} scale={[0.5, 0.5, 0.5]} />
`);
    
    rl.close();
  });
};

main().catch(console.error);
